'use client';
import React, { useState, useEffect, useCallback } from 'react';
import StudentSidebar from '@/components/StudentSidebar';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Lock, Play, ChevronDown, ChevronUp, Loader2, RefreshCw } from 'lucide-react';

interface LessonRow {
  id: string;
  title: string;
  description: string;
  duration: string | null;
  is_free: boolean;
  unlock_type: string;
  sort_order: number;
  module_id: string;
  course_id: string;
}

interface ModuleRow {
  id: string;
  title: string;
  focus_area: string | null;
  sort_order: number;
  course_id: string;
}

interface CourseRow {
  id: string;
  title: string;
  sort_order: number;
  program_id: string;
}

interface ProgramRow {
  id: string;
  title: string;
  duration: string;
}

interface ProgressRecord {
  lesson_id: string;
  is_completed: boolean;
  progress_percent: number;
  last_accessed_at: string | null;
}

interface ProgramData {
  program: ProgramRow;
  courses: CourseRow[];
  modules: ModuleRow[];
  lessons: LessonRow[];
  completedLessonIds: Set<string>;
  accessedLessonIds: Set<string>;
}

export default function ProgressTrackingPage() {
  const { user } = useAuth();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [programDataList, setProgramDataList] = useState<ProgramData[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingLesson, setMarkingLesson] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    if (!user) return;
    if (!silent) setLoading(true);
    else setRefreshing(true);

    const supabase = createClient();
    try {
      const { data: enrollments } = await supabase
        .from('enrollments')
        .select('program_id, programs(id, title, duration)')
        .eq('user_id', user.id)
        .eq('enrollment_status', 'active');

      if (!enrollments || enrollments.length === 0) {
        setProgramDataList([]);
        return;
      }

      const results: ProgramData[] = [];

      for (const enrollment of enrollments) {
        const prog = enrollment.programs as any;
        if (!prog) continue;
        const programId = prog.id;

        const [coursesRes, modulesRes, lessonsRes, progressRes] = await Promise.all([
          supabase
            .from('courses')
            .select('id, title, sort_order, program_id')
            .eq('program_id', programId)
            .eq('status', 'published')
            .order('sort_order', { ascending: true }),
          supabase
            .from('modules')
            .select('id, title, focus_area, sort_order, course_id')
            .eq('program_id', programId)
            .eq('status', 'published')
            .order('sort_order', { ascending: true }),
          supabase
            .from('lessons')
            .select('id, title, description, duration, is_free, unlock_type, sort_order, module_id, course_id')
            .eq('program_id', programId)
            .eq('status', 'published')
            .order('sort_order', { ascending: true }),
          // Fetch ALL progress records for this user+program (not just completed)
          supabase
            .from('progress_records')
            .select('lesson_id, is_completed, progress_percent, last_accessed_at')
            .eq('user_id', user.id)
            .eq('program_id', programId),
        ]);

        const progressData: ProgressRecord[] = progressRes.data ?? [];

        const completedLessonIds = new Set<string>(
          progressData.filter((p) => p.is_completed).map((p) => p.lesson_id)
        );
        const accessedLessonIds = new Set<string>(
          progressData.map((p) => p.lesson_id)
        );

        results.push({
          program: { id: prog.id, title: prog.title, duration: prog.duration },
          courses: coursesRes.data ?? [],
          modules: modulesRes.data ?? [],
          lessons: lessonsRes.data ?? [],
          completedLessonIds,
          accessedLessonIds,
        });
      }

      setProgramDataList(results);
    } catch (err) {
      console.error('Progress tracking fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Re-fetch when tab becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchData(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchData]);

  // Auto-trigger last_accessed_at when a module is expanded
  const handleModuleExpand = async (
    modId: string,
    lessons: LessonRow[],
    programId: string,
    moduleId: string,
    courseId: string
  ) => {
    const isExpanding = expandedModule !== modId;
    setExpandedModule(isExpanding ? modId : null);

    if (isExpanding && user && lessons.length > 0) {
      const firstLesson = lessons[0];
      try {
        await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lesson_id: firstLesson.id,
            module_id: moduleId,
            course_id: courseId,
            program_id: programId,
            action: 'access',
          }),
        });
      } catch (err) {
        console.error('Access tracking error:', err);
      }
    }
  };

  const handleMarkComplete = async (
    lesson: LessonRow,
    programId: string,
    programDataIndex: number
  ) => {
    if (!user || markingLesson === lesson.id) return;
    setMarkingLesson(lesson.id);

    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_id: lesson.id,
          module_id: lesson.module_id,
          course_id: lesson.course_id,
          program_id: programId,
          action: 'complete',
        }),
      });

      if (res.ok) {
        // Optimistically update local state immediately
        setProgramDataList(prev => {
          const updated = [...prev];
          const pd = { ...updated[programDataIndex] };
          const newCompleted = new Set(pd.completedLessonIds);
          newCompleted.add(lesson.id);
          const newAccessed = new Set(pd.accessedLessonIds);
          newAccessed.add(lesson.id);
          pd.completedLessonIds = newCompleted;
          pd.accessedLessonIds = newAccessed;
          updated[programDataIndex] = pd;
          return updated;
        });
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error('Mark complete failed:', errData);
      }
    } catch (err) {
      console.error('Mark complete error:', err);
    } finally {
      setMarkingLesson(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <StudentSidebar />
      <div className="flex-1 min-w-0">
        {/* Topbar */}
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center justify-between">
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Learning</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Progress Tracking</p>
          </div>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs font-sans text-stone-500 hover:text-stone-700 transition-colors disabled:opacity-50"
            title="Refresh progress"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto space-y-10">
          {loading && (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white border border-stone-200/80 rounded-sm overflow-hidden animate-pulse" style={{ height: 160 }} />
              ))}
            </div>
          )}

          {!loading && programDataList.length === 0 && (
            <div className="bg-white border border-stone-200/80 rounded-sm p-10 text-center">
              <p className="font-serif text-lg text-stone-600">No active enrollments found.</p>
              <p className="text-sm font-sans text-stone-400 mt-2">Enrol in a program to start tracking your progress.</p>
            </div>
          )}

          {!loading && programDataList.map(({ program, courses, modules, lessons, completedLessonIds, accessedLessonIds }, programDataIndex) => {
            const totalLessons = lessons.length;
            const completedCount = completedLessonIds.size;
            const programProgress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
            const isCertEligible = programProgress === 100;

            return (
              <div key={program.id} className="bg-white border border-stone-200/80 rounded-sm overflow-hidden">
                {/* Program Header */}
                <div className="px-8 py-6 border-b border-stone-100 bg-stone-50">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest mb-1">{program.duration}</p>
                      <h2 className="font-serif text-2xl text-stone-800">{program.title}</h2>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-serif text-3xl text-stone-800 tabular-nums">{programProgress}%</p>
                      <p className="text-xs font-sans text-stone-400 mt-0.5">{completedCount}/{totalLessons} lessons</p>
                      {isCertEligible && (
                        <span className="inline-block mt-2 text-2xs font-sans font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm">Certificate Eligible</span>
                      )}
                    </div>
                  </div>
                  {/* Program Progress Bar */}
                  <div className="mt-5">
                    <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-600 rounded-full transition-all duration-700" style={{ width: `${programProgress}%` }} />
                    </div>
                  </div>
                </div>

                {/* Courses & Modules */}
                <div className="divide-y divide-stone-50">
                  {courses.length === 0 && (
                    <div className="px-8 py-6 text-center">
                      <p className="text-sm font-sans text-stone-400">No published courses in this program yet.</p>
                    </div>
                  )}
                  {courses.map(course => {
                    const courseModules = modules.filter(m => m.course_id === course.id).sort((a, b) => a.sort_order - b.sort_order);
                    const courseLessons = lessons.filter(l => l.course_id === course.id);
                    const courseCompleted = courseLessons.filter(l => completedLessonIds.has(l.id)).length;
                    const courseProgress = courseLessons.length > 0 ? Math.round((courseCompleted / courseLessons.length) * 100) : 0;

                    return (
                      <div key={course.id} className="px-8 py-5">
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <h3 className="font-serif text-lg text-stone-700">{course.title}</h3>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-sans text-stone-400">{courseCompleted}/{courseLessons.length} lessons · {courseProgress}%</span>
                            <div className="w-24 h-1 bg-stone-100 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${courseProgress}%` }} />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {courseModules.length === 0 && (
                            <p className="text-xs font-sans text-stone-400 pl-2">No published modules in this course yet.</p>
                          )}
                          {courseModules.map(mod => {
                            const modLessons = lessons.filter(l => l.module_id === mod.id).sort((a, b) => a.sort_order - b.sort_order);
                            const modCompleted = modLessons.filter(l => completedLessonIds.has(l.id)).length;
                            const modProgress = modLessons.length > 0 ? Math.round((modCompleted / modLessons.length) * 100) : 0;
                            const isExpanded = expandedModule === mod.id;

                            return (
                              <div key={mod.id} className="border border-stone-100 rounded-sm overflow-hidden">
                                <button
                                  onClick={() => handleModuleExpand(mod.id, modLessons, program.id, mod.id, course.id)}
                                  className="w-full flex items-center justify-between gap-4 px-5 py-3.5 bg-stone-50/50 hover:bg-stone-50 transition-colors text-left"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${modProgress === 100 ? 'bg-amber-500' : modProgress > 0 ? 'bg-amber-300' : 'bg-stone-300'}`} />
                                    <span className="text-sm font-sans font-medium text-stone-700">{mod.title}</span>
                                    {mod.focus_area && (
                                      <span className="text-2xs font-sans text-stone-400 bg-stone-100 px-2 py-0.5 rounded-sm">{mod.focus_area}</span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-xs font-sans text-stone-400">{modCompleted}/{modLessons.length}</span>
                                    {isExpanded ? <ChevronUp size={14} className="text-stone-400" /> : <ChevronDown size={14} className="text-stone-400" />}
                                  </div>
                                </button>
                                {isExpanded && modLessons.length > 0 && (
                                  <div className="divide-y divide-stone-50">
                                    {modLessons.map((lesson, lessonIndex) => {
                                      const isCompleted = completedLessonIds.has(lesson.id);
                                      const isAccessed = accessedLessonIds.has(lesson.id);
                                      const isMarking = markingLesson === lesson.id;
                                      // Sequential unlock: first lesson always unlocked, rest unlock after previous is completed
                                      const unlocked =
                                        lesson.unlock_type === 'immediate' || lesson.is_free || lessonIndex === 0
                                          ? true
                                          : completedLessonIds.has(modLessons[lessonIndex - 1].id);

                                      return (
                                        <div key={lesson.id} className={`flex items-center gap-4 px-5 py-3 ${!unlocked ? 'opacity-50' : ''}`}>
                                          <div className="shrink-0">
                                            {isCompleted ? (
                                              <CheckCircle size={16} className="text-amber-600" />
                                            ) : unlocked ? (
                                              <Play size={16} className={isAccessed ? 'text-amber-400' : 'text-stone-400'} />
                                            ) : (
                                              <Lock size={16} className="text-stone-300" />
                                            )}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-sans ${isCompleted ? 'text-stone-400 line-through' : 'text-stone-700'}`}>{lesson.title}</p>
                                            {lesson.description && (
                                              <p className="text-xs font-sans text-stone-400 mt-0.5 truncate">{lesson.description}</p>
                                            )}
                                          </div>
                                          <div className="flex items-center gap-3 shrink-0">
                                            {lesson.duration && <span className="text-xs font-sans text-stone-400">{lesson.duration}</span>}
                                            {lesson.is_free && (
                                              <span className="text-2xs font-sans font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-sm">Free</span>
                                            )}
                                            {!unlocked && (
                                              <span className="text-2xs font-sans text-stone-400 capitalize flex items-center gap-1">
                                                <Lock size={10} /> Locked
                                              </span>
                                            )}
                                            {unlocked && !isCompleted && (
                                              <button
                                                onClick={() => handleMarkComplete(lesson, program.id, programDataIndex)}
                                                disabled={isMarking}
                                                className="flex items-center gap-1.5 text-xs font-sans font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1 rounded-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                              >
                                                {isMarking ? (
                                                  <Loader2 size={11} className="animate-spin" />
                                                ) : (
                                                  <CheckCircle size={11} />
                                                )}
                                                {isMarking ? 'Saving…' : 'Mark Complete'}
                                              </button>
                                            )}
                                            {isCompleted && (
                                              <span className="text-2xs font-sans text-amber-600 font-medium flex items-center gap-1">
                                                <CheckCircle size={11} /> Done
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                                {isExpanded && modLessons.length === 0 && (
                                  <div className="px-5 py-3 text-xs font-sans text-stone-400">No published lessons in this module yet.</div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
