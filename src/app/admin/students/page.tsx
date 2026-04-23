'use client';
import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import {
  Search, UserPlus, UserCheck, UserX, Trash2, X, Loader2,
  Mail, Clock, CheckCircle2, AlertCircle, BarChart2,
  ChevronDown, ChevronRight, BookOpen, CheckSquare, Square,
  ArrowLeft,
} from 'lucide-react';

interface StudentProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  is_active: boolean;
  onboarding_completed?: boolean;
  created_at: string;
}

interface Invitation {
  id: string;
  email: string;
  full_name: string;
  status: 'pending' | 'accepted' | 'expired';
  notes?: string;
  created_at: string;
}

interface LessonProgress {
  id: string;
  title: string;
  duration?: string;
  sort_order: number;
  module_id: string;
  course_id?: string;
  program_id: string;
  is_completed: boolean;
  progress_percent: number;
  completed_at: string | null;
  last_accessed_at: string | null;
  has_record: boolean;
}

interface ModuleProgress {
  id: string;
  title: string;
  sort_order: number;
  lessons: LessonProgress[];
  total_lessons: number;
  completed_lessons: number;
}

interface ProgramProgress {
  enrollment_id: string;
  enrollment_status: string;
  enrolled_at: string;
  program_id: string;
  program_title: string;
  modules: ModuleProgress[];
  total_lessons: number;
  completed_lessons: number;
  progress_percent: number;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'students' | 'invitations'>('students');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ email: '', full_name: '', notes: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  // Progress panel state
  const [progressStudent, setProgressStudent] = useState<StudentProfile | null>(null);
  const [progressData, setProgressData] = useState<ProgramProgress[]>([]);
  const [progressLoading, setProgressLoading] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [togglingLesson, setTogglingLesson] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/students');
      const json = await res.json();
      setStudents(json.students || []);
      setInvitations(json.invitations || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const fetchStudentProgress = useCallback(async (student: StudentProfile) => {
    setProgressStudent(student);
    setProgressLoading(true);
    setProgressData([]);
    setExpandedModules(new Set());
    try {
      const res = await fetch(`/api/admin/student-progress?user_id=${student.id}`);
      const json = await res.json();
      setProgressData(json.programs || []);
      // Auto-expand all modules
      const allModuleIds = new Set<string>();
      (json.programs || []).forEach((p: ProgramProgress) => {
        p.modules.forEach((m: ModuleProgress) => allModuleIds.add(m.id));
      });
      setExpandedModules(allModuleIds);
    } catch {
      setProgressData([]);
    } finally {
      setProgressLoading(false);
    }
  }, []);

  const handleToggleLesson = async (
    lesson: LessonProgress,
    programId: string,
    studentId: string
  ) => {
    const newCompleted = !lesson.is_completed;
    setTogglingLesson(lesson.id);

    // Optimistic update
    setProgressData(prev =>
      prev.map(p => ({
        ...p,
        modules: p.modules.map(m => ({
          ...m,
          lessons: m.lessons.map(l =>
            l.id === lesson.id ? { ...l, is_completed: newCompleted, progress_percent: newCompleted ? 100 : 0 } : l
          ),
          completed_lessons: m.lessons.filter(l =>
            l.id === lesson.id ? newCompleted : l.is_completed
          ).length,
        })),
        completed_lessons: p.modules.reduce((sum, m) =>
          sum + m.lessons.filter(l => l.id === lesson.id ? newCompleted : l.is_completed).length, 0
        ),
        progress_percent: (() => {
          const total = p.total_lessons;
          const completed = p.modules.reduce((sum, m) =>
            sum + m.lessons.filter(l => l.id === lesson.id ? newCompleted : l.is_completed).length, 0
          );
          return total > 0 ? Math.round((completed / total) * 100) : 0;
        })(),
      }))
    );

    try {
      await fetch('/api/admin/student-progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: studentId,
          lesson_id: lesson.id,
          module_id: lesson.module_id,
          course_id: lesson.course_id ?? null,
          program_id: programId,
          is_completed: newCompleted,
        }),
      });
    } catch {
      // Revert on error
      fetchStudentProgress(progressStudent!);
    } finally {
      setTogglingLesson(null);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  const filteredStudents = students.filter(s => {
    if (!search) return true;
    return (
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const filteredInvitations = invitations.filter(inv => {
    if (!search) return true;
    return (
      inv.full_name.toLowerCase().includes(search.toLowerCase()) ||
      inv.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleToggleActive = async (id: string, current: boolean) => {
    await fetch('/api/students', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type: 'student', is_active: !current }),
    });
    setStudents(prev => prev.map(s => s.id === id ? { ...s, is_active: !current } : s));
  };

  const handleDeleteInvitation = async (id: string) => {
    if (!confirm('Delete this invitation?')) return;
    await fetch(`/api/students?id=${id}&type=invitation`, { method: 'DELETE' });
    setInvitations(prev => prev.filter(inv => inv.id !== id));
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');
    if (!addForm.email || !addForm.full_name) {
      setAddError('Email and full name are required.');
      return;
    }
    setAddLoading(true);
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      const json = await res.json();
      if (!res.ok) {
        setAddError(json.error || 'Failed to add student.');
      } else {
        setAddSuccess(`Invitation created for ${addForm.full_name}. They can now sign up using this email.`);
        setAddForm({ email: '', full_name: '', notes: '' });
        fetchData();
      }
    } catch {
      setAddError('Network error. Please try again.');
    } finally {
      setAddLoading(false);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      accepted: 'bg-green-50 text-green-700 border-green-200',
      expired: 'bg-stone-50 text-stone-500 border-stone-200',
    };
    return map[status] || map.pending;
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        {/* Topbar */}
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-4 sm:px-6 xl:px-8 h-16 flex items-center justify-between gap-3">
          <div>
            {progressStudent ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setProgressStudent(null)}
                  className="text-stone-400 hover:text-stone-700 transition-colors"
                >
                  <ArrowLeft size={15} />
                </button>
                <div>
                  <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Students / Progress</p>
                  <p className="font-serif text-lg text-stone-800 leading-tight">{progressStudent.full_name}</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Admin</p>
                <p className="font-serif text-lg text-stone-800 leading-tight">Students</p>
              </div>
            )}
          </div>
          {!progressStudent && (
            <button
              onClick={() => { setShowAddModal(true); setAddError(''); setAddSuccess(''); }}
              className="flex items-center gap-1.5 bg-amber-800 text-amber-50 text-xs font-sans font-medium px-3 py-2 rounded-sm hover:bg-amber-900 transition-colors"
            >
              <UserPlus size={13} />
              <span className="hidden sm:inline">Add Student</span>
            </button>
          )}
        </div>

        {/* Progress View */}
        {progressStudent ? (
          <div className="p-4 sm:p-6 xl:p-8 max-w-screen-xl mx-auto space-y-5">
            {/* Student summary card */}
            <div className="bg-white border border-stone-200/80 rounded-sm px-5 py-4 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-serif text-base text-stone-800">{progressStudent.full_name}</p>
                <p className="text-xs font-sans text-stone-400 mt-0.5">{progressStudent.email}</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-sans text-stone-500">
                <span className="flex items-center gap-1">
                  <BookOpen size={12} />
                  {progressData.length} program{progressData.length !== 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-green-600" />
                  {progressData.reduce((s, p) => s + p.completed_lessons, 0)} lessons completed
                </span>
              </div>
              <button
                onClick={() => fetchStudentProgress(progressStudent)}
                className="text-xs font-sans text-amber-700 hover:text-amber-900 border border-amber-200 px-2.5 py-1.5 rounded-sm transition-colors"
              >
                Refresh
              </button>
            </div>

            {progressLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={20} className="animate-spin text-stone-400" />
              </div>
            ) : progressData.length === 0 ? (
              <div className="bg-white border border-stone-200/80 rounded-sm px-5 py-16 text-center">
                <BookOpen size={28} className="mx-auto text-stone-300 mb-3" />
                <p className="font-serif text-stone-600 text-base">No programs enrolled</p>
                <p className="text-xs font-sans text-stone-400 mt-1">This student has not been enrolled in any programs yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {progressData.map(program => (
                  <div key={program.enrollment_id} className="bg-white border border-stone-200/80 rounded-sm overflow-hidden">
                    {/* Program header */}
                    <div className="px-5 py-4 border-b border-stone-100 flex flex-wrap items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-sm text-stone-800">{program.program_title}</p>
                        <p className="text-xs font-sans text-stone-400 mt-0.5">
                          Enrolled {new Date(program.enrolled_at).toLocaleDateString('en-IN')}
                          {' · '}
                          <span className={`capitalize ${program.enrollment_status === 'active' ? 'text-green-600' : 'text-stone-400'}`}>
                            {program.enrollment_status}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xs font-sans font-semibold text-stone-700">{program.progress_percent}%</p>
                          <p className="text-2xs font-sans text-stone-400">{program.completed_lessons}/{program.total_lessons} lessons</p>
                        </div>
                        <div className="w-20 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-600 rounded-full transition-all duration-300"
                            style={{ width: `${program.progress_percent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Modules */}
                    {program.modules.length === 0 ? (
                      <div className="px-5 py-8 text-center text-xs font-sans text-stone-400">
                        No modules found for this program.
                      </div>
                    ) : (
                      <div className="divide-y divide-stone-50">
                        {program.modules.map(mod => (
                          <div key={mod.id}>
                            {/* Module row */}
                            <button
                              onClick={() => toggleModule(mod.id)}
                              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-stone-50/60 transition-colors text-left"
                            >
                              {expandedModules.has(mod.id)
                                ? <ChevronDown size={13} className="text-stone-400 shrink-0" />
                                : <ChevronRight size={13} className="text-stone-400 shrink-0" />
                              }
                              <span className="flex-1 text-xs font-sans font-medium text-stone-700">{mod.title}</span>
                              <span className="text-2xs font-sans text-stone-400 shrink-0">
                                {mod.completed_lessons}/{mod.total_lessons}
                              </span>
                              <div className="w-16 h-1 bg-stone-100 rounded-full overflow-hidden shrink-0">
                                <div
                                  className="h-full bg-amber-500 rounded-full transition-all"
                                  style={{ width: mod.total_lessons > 0 ? `${Math.round((mod.completed_lessons / mod.total_lessons) * 100)}%` : '0%' }}
                                />
                              </div>
                            </button>

                            {/* Lessons */}
                            {expandedModules.has(mod.id) && (
                              <div className="bg-stone-50/40 border-t border-stone-100">
                                {mod.lessons.length === 0 ? (
                                  <p className="px-10 py-4 text-xs font-sans text-stone-400">No lessons in this module.</p>
                                ) : (
                                  mod.lessons.map(lesson => (
                                    <div
                                      key={lesson.id}
                                      className="flex items-center gap-3 px-10 py-2.5 border-b border-stone-100/60 last:border-0 hover:bg-stone-50 transition-colors"
                                    >
                                      <button
                                        onClick={() => handleToggleLesson(lesson, program.program_id, progressStudent.id)}
                                        disabled={togglingLesson === lesson.id}
                                        className="shrink-0 transition-colors disabled:opacity-50"
                                        title={lesson.is_completed ? 'Mark as incomplete' : 'Mark as complete'}
                                      >
                                        {togglingLesson === lesson.id ? (
                                          <Loader2 size={14} className="animate-spin text-stone-400" />
                                        ) : lesson.is_completed ? (
                                          <CheckSquare size={14} className="text-green-600" />
                                        ) : (
                                          <Square size={14} className="text-stone-300 hover:text-amber-600" />
                                        )}
                                      </button>
                                      <span className={`flex-1 text-xs font-sans ${lesson.is_completed ? 'text-stone-500 line-through' : 'text-stone-700'}`}>
                                        {lesson.title}
                                      </span>
                                      {lesson.duration && (
                                        <span className="text-2xs font-sans text-stone-400 shrink-0">{lesson.duration}</span>
                                      )}
                                      {lesson.is_completed && lesson.completed_at && (
                                        <span className="text-2xs font-sans text-green-600 shrink-0 hidden sm:inline">
                                          {new Date(lesson.completed_at).toLocaleDateString('en-IN')}
                                        </span>
                                      )}
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Main students list view */
          <div className="p-4 sm:p-6 xl:p-8 max-w-screen-xl mx-auto space-y-5">
            {/* Tabs + Search */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex border border-stone-200 rounded-sm p-0.5 bg-stone-50 w-fit">
                {(['students', 'invitations'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-3 py-1.5 text-xs font-sans font-medium rounded-sm transition-all capitalize ${tab === t ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                  >
                    {t}
                    <span className="ml-1.5 text-2xs opacity-60">
                      {t === 'students' ? students.length : invitations.length}
                    </span>
                  </button>
                ))}
              </div>
              <div className="relative sm:ml-auto max-w-xs w-full">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700 placeholder-stone-400"
                />
              </div>
            </div>

            {/* Students Table */}
            {tab === 'students' && (
              <div className="bg-white border border-stone-200/80 rounded-sm overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 size={18} className="animate-spin text-stone-400" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[640px]">
                      <thead>
                        <tr className="border-b border-stone-100 bg-stone-50">
                          {['Name', 'Email', 'Phone', 'Onboarding', 'Status', 'Joined', 'Actions'].map(h => (
                            <th key={h} className="text-left text-xs font-sans font-medium text-stone-400 uppercase tracking-widest px-4 py-3">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-50">
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-4 py-12 text-center text-sm font-sans text-stone-400">
                              No students found. Add a student to get started.
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map(student => (
                            <tr key={student.id} className="hover:bg-stone-50/50 transition-colors">
                              <td className="px-4 py-3 font-sans font-medium text-stone-700 text-sm">{student.full_name || '—'}</td>
                              <td className="px-4 py-3 font-sans text-stone-500 text-xs">{student.email}</td>
                              <td className="px-4 py-3 font-sans text-stone-400 text-xs">{student.phone || '—'}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-1 text-xs font-sans px-2 py-0.5 rounded-full border ${student.onboarding_completed ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                  {student.onboarding_completed ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                                  {student.onboarding_completed ? 'Done' : 'Pending'}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-1 text-xs font-sans font-medium px-2 py-0.5 rounded-full border ${student.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-stone-50 text-stone-500 border-stone-200'}`}>
                                  {student.is_active ? <UserCheck size={10} /> : <UserX size={10} />}
                                  {student.is_active ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-sans text-stone-400 text-xs">
                                {new Date(student.created_at).toLocaleDateString('en-IN')}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => fetchStudentProgress(student)}
                                    className="text-stone-400 hover:text-amber-700 transition-colors"
                                    title="View progress"
                                  >
                                    <BarChart2 size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleToggleActive(student.id, student.is_active)}
                                    className="text-stone-400 hover:text-amber-700 transition-colors"
                                    title={student.is_active ? 'Deactivate' : 'Activate'}
                                  >
                                    {student.is_active ? <UserX size={13} /> : <UserCheck size={13} />}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Invitations Table */}
            {tab === 'invitations' && (
              <div className="bg-white border border-stone-200/80 rounded-sm overflow-hidden">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 size={18} className="animate-spin text-stone-400" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[500px]">
                      <thead>
                        <tr className="border-b border-stone-100 bg-stone-50">
                          {['Name', 'Email', 'Status', 'Notes', 'Invited On', 'Actions'].map(h => (
                            <th key={h} className="text-left text-xs font-sans font-medium text-stone-400 uppercase tracking-widest px-4 py-3">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-50">
                        {filteredInvitations.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-4 py-12 text-center text-sm font-sans text-stone-400">
                              No invitations yet. Use "Add Student" to invite someone.
                            </td>
                          </tr>
                        ) : (
                          filteredInvitations.map(inv => (
                            <tr key={inv.id} className="hover:bg-stone-50/50 transition-colors">
                              <td className="px-4 py-3 font-sans font-medium text-stone-700 text-sm">{inv.full_name}</td>
                              <td className="px-4 py-3 font-sans text-stone-500 text-xs">{inv.email}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center gap-1 text-xs font-sans font-medium px-2 py-0.5 rounded-full border capitalize ${statusBadge(inv.status)}`}>
                                  {inv.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-sans text-stone-400 text-xs max-w-[160px] truncate">{inv.notes || '—'}</td>
                              <td className="px-4 py-3 font-sans text-stone-400 text-xs">
                                {new Date(inv.created_at).toLocaleDateString('en-IN')}
                              </td>
                              <td className="px-4 py-3">
                                {inv.status === 'pending' && (
                                  <button
                                    onClick={() => handleDeleteInvitation(inv.id)}
                                    className="text-stone-400 hover:text-red-600 transition-colors"
                                    title="Delete invitation"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-sm border border-stone-200 shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <div>
                <p className="font-serif text-base text-stone-800">Add New Student</p>
                <p className="text-xs font-sans text-stone-400 mt-0.5">The student will sign up using this email</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-sans font-medium text-stone-700 mb-1.5">
                  <Mail size={11} className="inline mr-1" />
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={addForm.email}
                  onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="student@example.com"
                  className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700 placeholder-stone-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-stone-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addForm.full_name}
                  onChange={e => setAddForm(p => ({ ...p, full_name: e.target.value }))}
                  placeholder="Student's full name"
                  className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700 placeholder-stone-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-medium text-stone-700 mb-1.5">
                  Notes <span className="text-stone-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={addForm.notes}
                  onChange={e => setAddForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Any notes about this student..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700 placeholder-stone-400 resize-none"
                />
              </div>

              {addError && (
                <div className="flex items-start gap-2 text-xs font-sans text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
                  <AlertCircle size={13} className="mt-0.5 shrink-0" />
                  {addError}
                </div>
              )}

              {addSuccess && (
                <div className="flex items-start gap-2 text-xs font-sans text-green-700 bg-green-50 border border-green-200 rounded-sm px-3 py-2">
                  <CheckCircle2 size={13} className="mt-0.5 shrink-0" />
                  {addSuccess}
                </div>
              )}

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 text-sm font-sans text-stone-600 border border-stone-200 rounded-sm hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-sans font-medium bg-amber-800 text-amber-50 rounded-sm hover:bg-amber-900 transition-colors disabled:opacity-60"
                >
                  {addLoading ? <Loader2 size={13} className="animate-spin" /> : <UserPlus size={13} />}
                  {addLoading ? 'Adding...' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
