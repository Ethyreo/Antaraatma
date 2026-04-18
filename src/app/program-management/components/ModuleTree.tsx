'use client';
import React, { useEffect, useState } from 'react';
import { ChevronRight, Plus, Trash2, GripVertical, Video, FileText, ToggleRight, ToggleLeft, X, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface LessonRow {
  id: string;
  title: string;
  duration: string | null;
  status: string;
  sort_order: number;
  video_url: string | null;
}

interface ModuleRow {
  id: string;
  title: string;
  sort_order: number;
  status: string;
  lessons: LessonRow[];
}

interface Props {
  programId: string;
}

const statusBadge: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-stone-100 text-stone-600',
  archived: 'bg-red-100 text-red-600',
};

export default function ModuleTree({ programId }: Props) {
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [programTitle, setProgramTitle] = useState('Program');
  const [courseId, setCourseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [lessonStatuses, setLessonStatuses] = useState<Record<string, string>>({});

  // Add Module Modal
  const [showAddModule, setShowAddModule] = useState(false);
  const [moduleForm, setModuleForm] = useState({ title: '', description: '', focus_area: '', status: 'draft' });
  const [savingModule, setSavingModule] = useState(false);
  const [moduleError, setModuleError] = useState('');

  // Add Lesson Modal
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [addLessonModuleId, setAddLessonModuleId] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState({ title: '', description: '', duration: '', video_url: '', status: 'draft' });
  const [savingLesson, setSavingLesson] = useState(false);
  const [lessonError, setLessonError] = useState('');

  const fetchModules = async () => {
    if (!programId) return;
    setLoading(true);
    const supabase = createClient();
    try {
      const { data: prog } = await supabase
        .from('programs')
        .select('title')
        .eq('id', programId)
        .maybeSingle();
      if (prog) setProgramTitle(prog.title);

      // Get first course for this program (needed for module/lesson creation)
      const { data: courses } = await supabase
        .from('courses')
        .select('id')
        .eq('program_id', programId)
        .order('sort_order', { ascending: true })
        .limit(1);
      if (courses?.[0]) setCourseId(courses[0].id);

      const { data: mods } = await supabase
        .from('modules')
        .select('id, title, sort_order, status')
        .eq('program_id', programId)
        .order('sort_order', { ascending: true });

      if (!mods) { setLoading(false); return; }

      const { data: allLessons } = await supabase
        .from('lessons')
        .select('id, title, duration, status, sort_order, video_url, module_id')
        .eq('program_id', programId)
        .order('sort_order', { ascending: true });

      const lessonsByModule: Record<string, LessonRow[]> = {};
      (allLessons ?? []).forEach((l: any) => {
        if (!lessonsByModule[l.module_id]) lessonsByModule[l.module_id] = [];
        lessonsByModule[l.module_id].push(l);
      });

      const enriched: ModuleRow[] = mods.map((m) => ({
        ...m,
        lessons: lessonsByModule[m.id] ?? [],
      }));

      setModules(enriched);

      const statusMap: Record<string, string> = {};
      (allLessons ?? []).forEach((l: any) => { statusMap[l.id] = l.status; });
      setLessonStatuses(statusMap);

      if (enriched.length > 0) {
        setExpandedModules(new Set([enriched[0].id]));
      }
    } catch (err) {
      console.error('ModuleTree fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [programId]);

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleLessonStatus = async (id: string, title: string) => {
    const supabase = createClient();
    const next = lessonStatuses[id] === 'published' ? 'draft' : 'published';
    try {
      const { error } = await supabase.from('lessons').update({ status: next }).eq('id', id);
      if (error) throw error;
      setLessonStatuses((prev) => ({ ...prev, [id]: next }));
      toast.success(`"${title}" set to ${next}`);
    } catch {
      toast.error('Failed to update lesson status');
    }
  };

  const handleAddModule = async () => {
    if (!moduleForm.title.trim()) { setModuleError('Title is required.'); return; }
    if (!courseId) { setModuleError('No course found for this program. Create a course first.'); return; }
    setSavingModule(true);
    setModuleError('');
    try {
      const res = await fetch('/api/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: moduleForm.title,
          description: moduleForm.description,
          focus_area: moduleForm.focus_area || null,
          program_id: programId,
          course_id: courseId,
          sort_order: modules.length,
          status: moduleForm.status,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        setModuleError(json.error || 'Failed to create module.');
      } else {
        toast.success(`Module "${moduleForm.title}" created!`);
        setShowAddModule(false);
        setModuleForm({ title: '', description: '', focus_area: '', status: 'draft' });
        await fetchModules();
      }
    } catch {
      setModuleError('Network error. Please try again.');
    } finally {
      setSavingModule(false);
    }
  };

  const handleDeleteModule = async (id: string, title: string) => {
    if (!confirm(`Delete module "${title}"? All lessons inside will also be deleted.`)) return;
    try {
      const res = await fetch(`/api/modules?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setModules(prev => prev.filter(m => m.id !== id));
        toast.success(`Module "${title}" deleted.`);
      }
    } catch {
      toast.error('Failed to delete module.');
    }
  };

  const openAddLesson = (moduleId: string) => {
    setAddLessonModuleId(moduleId);
    setLessonForm({ title: '', description: '', duration: '', video_url: '', status: 'draft' });
    setLessonError('');
    setShowAddLesson(true);
  };

  const handleAddLesson = async () => {
    if (!lessonForm.title.trim()) { setLessonError('Title is required.'); return; }
    if (!addLessonModuleId || !courseId) { setLessonError('Module or course not found.'); return; }
    setSavingLesson(true);
    setLessonError('');
    try {
      const mod = modules.find(m => m.id === addLessonModuleId);
      const sortOrder = mod?.lessons.length ?? 0;
      const res = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: lessonForm.title,
          description: lessonForm.description,
          duration: lessonForm.duration || null,
          video_url: lessonForm.video_url || null,
          module_id: addLessonModuleId,
          course_id: courseId,
          program_id: programId,
          sort_order: sortOrder,
          status: lessonForm.status,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        setLessonError(json.error || 'Failed to create lesson.');
      } else {
        toast.success(`Lesson "${lessonForm.title}" created!`);
        setShowAddLesson(false);
        setAddLessonModuleId(null);
        await fetchModules();
      }
    } catch {
      setLessonError('Network error. Please try again.');
    } finally {
      setSavingLesson(false);
    }
  };

  const handleDeleteLesson = async (id: string, title: string) => {
    if (!confirm(`Delete lesson "${title}"?`)) return;
    try {
      const res = await fetch(`/api/lessons?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setModules(prev => prev.map(m => ({
          ...m,
          lessons: m.lessons.filter(l => l.id !== id),
        })));
        toast.success(`Lesson "${title}" deleted.`);
      }
    } catch {
      toast.error('Failed to delete lesson.');
    }
  };

  if (loading) {
    return (
      <div className="card-base overflow-hidden">
        <div className="p-5 border-b border-stone-100 animate-pulse">
          <div className="h-4 bg-stone-200 rounded w-1/3 mb-2" />
          <div className="h-3 bg-stone-100 rounded w-1/4" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-4 border-b border-stone-100 animate-pulse">
            <div className="h-4 bg-stone-200 rounded flex-1" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="card-base overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-amber-50/30">
          <div>
            <p className="section-label mb-0.5">Module & Lesson Tree</p>
            <p className="font-serif text-base text-stone-900">{programTitle}</p>
            <p className="text-xs font-sans text-stone-500 mt-0.5">{modules.length} modules · Click to expand lessons</p>
          </div>
          <button
            className="flex items-center gap-1.5 bg-amber-800 text-amber-50 text-xs font-sans font-500 px-3 py-1.5 rounded-sm hover:bg-amber-900 transition-all active:scale-95"
            onClick={() => { setShowAddModule(true); setModuleError(''); }}
          >
            <Plus size={12} />
            Add Module
          </button>
        </div>

        {modules.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-sans text-stone-400">No modules yet for this program.</p>
            <button
              onClick={() => { setShowAddModule(true); setModuleError(''); }}
              className="mt-3 text-xs font-sans font-500 text-amber-700 hover:text-amber-800 transition-colors"
            >
              + Add first module
            </button>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {modules.map((mod) => {
              const isExpanded = expandedModules.has(mod.id);
              return (
                <div key={mod.id}>
                  <div
                    className={`flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors group ${isExpanded ? 'bg-amber-50/40' : 'hover:bg-stone-50'}`}
                    onClick={() => toggleModule(mod.id)}
                  >
                    <GripVertical size={14} className="text-stone-300 cursor-grab shrink-0" />
                    <ChevronRight size={14} className={`text-amber-600 transition-transform shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-sans font-600 text-stone-400 tabular-nums w-5">
                        {String(mod.sort_order).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-sans font-500 text-stone-800">{mod.title}</p>
                      <p className="text-xs font-sans text-stone-400 mt-0.5">{mod.lessons.length} lessons</p>
                    </div>
                    <span className={`status-badge ${statusBadge[mod.status] ?? 'bg-stone-100 text-stone-600'} shrink-0`}>
                      {mod.status}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                        title={`Delete ${mod.title}`}
                        onClick={() => handleDeleteModule(mod.id, mod.title)}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="bg-stone-50/60 border-t border-stone-100">
                      {mod.lessons.length === 0 ? (
                        <div className="px-16 py-6 text-center">
                          <p className="text-xs font-sans text-stone-400">No lessons yet in this module.</p>
                          <button
                            className="mt-2 text-xs font-sans font-500 text-amber-700 hover:text-amber-800"
                            onClick={() => openAddLesson(mod.id)}
                          >
                            + Add first lesson
                          </button>
                        </div>
                      ) : (
                        <div className="divide-y divide-stone-100/80">
                          {mod.lessons.map((lesson) => {
                            const isVideo = !!lesson.video_url;
                            const LessonIcon = isVideo ? Video : FileText;
                            const iconColor = isVideo ? 'text-blue-500 bg-blue-50' : 'text-amber-600 bg-amber-50';
                            const currentStatus = lessonStatuses[lesson.id] ?? lesson.status;
                            const [ic, bg] = iconColor.split(' ');
                            return (
                              <div
                                key={lesson.id}
                                className="flex items-center gap-3 pl-16 pr-5 py-3 hover:bg-stone-100/60 transition-colors group"
                              >
                                <GripVertical size={12} className="text-stone-200 cursor-grab shrink-0" />
                                <span className="text-xs font-sans text-stone-400 tabular-nums w-4 shrink-0">
                                  {String(lesson.sort_order).padStart(2, '0')}
                                </span>
                                <div className={`w-6 h-6 rounded-sm flex items-center justify-center shrink-0 ${bg}`}>
                                  <LessonIcon size={11} className={ic} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-sans font-500 text-stone-700 truncate">{lesson.title}</p>
                                  {lesson.duration && <p className="text-2xs font-sans text-stone-400">{lesson.duration}</p>}
                                </div>
                                <span className={`status-badge text-2xs ${statusBadge[currentStatus] ?? 'bg-stone-100 text-stone-600'}`}>
                                  {currentStatus}
                                </span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => toggleLessonStatus(lesson.id, lesson.title)}
                                    className="p-1 text-stone-400 hover:text-amber-700 hover:bg-amber-50 rounded-sm transition-colors"
                                    title="Toggle status"
                                  >
                                    {currentStatus === 'published' ? <ToggleRight size={13} className="text-green-600" /> : <ToggleLeft size={13} />}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
                                    className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                                    title="Delete lesson"
                                  >
                                    <Trash2 size={11} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                          <div className="pl-16 pr-5 py-3">
                            <button
                              onClick={() => openAddLesson(mod.id)}
                              className="text-xs font-sans font-500 text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-1"
                            >
                              <Plus size={11} />
                              Add lesson
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Module Modal */}
      {showAddModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm" onClick={() => setShowAddModule(false)} />
          <div className="relative bg-white rounded-sm shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-serif text-lg text-stone-900">Add Module</p>
              <button onClick={() => setShowAddModule(false)} className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-sm transition-colors"><X size={16} /></button>
            </div>
            {moduleError && (
              <div className="flex items-center gap-2 text-xs font-sans text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
                <AlertCircle size={13} />{moduleError}
              </div>
            )}
            <div>
              <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Module Title *</label>
              <input
                type="text"
                value={moduleForm.title}
                onChange={e => setModuleForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700"
                placeholder="e.g. Introduction to Healing"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Description</label>
              <textarea
                value={moduleForm.description}
                onChange={e => setModuleForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700 resize-none"
                placeholder="Brief module description…"
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Focus Area (optional)</label>
              <input
                type="text"
                value={moduleForm.focus_area}
                onChange={e => setModuleForm(f => ({ ...f, focus_area: e.target.value }))}
                className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700"
                placeholder="e.g. Physical, Emotional, Nutrition"
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Status</label>
              <select
                value={moduleForm.status}
                onChange={e => setModuleForm(f => ({ ...f, status: e.target.value }))}
                className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100">
              <button onClick={() => setShowAddModule(false)} className="text-xs font-sans font-medium px-4 py-2 rounded-sm border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition-colors">Cancel</button>
              <button
                onClick={handleAddModule}
                disabled={savingModule}
                className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5 disabled:opacity-50"
              >
                {savingModule && <Loader2 size={12} className="animate-spin" />}
                Create Module
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lesson Modal */}
      {showAddLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm" onClick={() => setShowAddLesson(false)} />
          <div className="relative bg-white rounded-sm shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-serif text-lg text-stone-900">Add Lesson</p>
              <button onClick={() => setShowAddLesson(false)} className="p-1.5 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-sm transition-colors"><X size={16} /></button>
            </div>
            {lessonError && (
              <div className="flex items-center gap-2 text-xs font-sans text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
                <AlertCircle size={13} />{lessonError}
              </div>
            )}
            <div>
              <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Lesson Title *</label>
              <input
                type="text"
                value={lessonForm.title}
                onChange={e => setLessonForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700"
                placeholder="e.g. Morning Reset Protocol"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Description</label>
              <textarea
                value={lessonForm.description}
                onChange={e => setLessonForm(f => ({ ...f, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700 resize-none"
                placeholder="Brief lesson description…"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Duration</label>
                <input
                  type="text"
                  value={lessonForm.duration}
                  onChange={e => setLessonForm(f => ({ ...f, duration: e.target.value }))}
                  className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700"
                  placeholder="e.g. 30 min"
                />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Status</label>
                <select
                  value={lessonForm.status}
                  onChange={e => setLessonForm(f => ({ ...f, status: e.target.value }))}
                  className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Video URL (optional)</label>
              <input
                type="text"
                value={lessonForm.video_url}
                onChange={e => setLessonForm(f => ({ ...f, video_url: e.target.value }))}
                className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700"
                placeholder="https://…"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-100">
              <button onClick={() => setShowAddLesson(false)} className="text-xs font-sans font-medium px-4 py-2 rounded-sm border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition-colors">Cancel</button>
              <button
                onClick={handleAddLesson}
                disabled={savingLesson}
                className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5 disabled:opacity-50"
              >
                {savingLesson && <Loader2 size={12} className="animate-spin" />}
                Create Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}