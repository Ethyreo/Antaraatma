'use client';
import React, { useState, useEffect } from 'react';
import StudentSidebar from '@/components/StudentSidebar';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Lock, Play, ChevronDown, ChevronUp } from 'lucide-react';

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

interface ProgramData {
  program: ProgramRow;
  courses: CourseRow[];
  modules: ModuleRow[];
  lessons: LessonRow[];
  completedLessonIds: Set<string>;
}

export default function ProgressTrackingPage() {
  const { user } = useAuth();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [programDataList, setProgramDataList] = useState<ProgramData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();

    async function fetchData() {
      try {
        // Get active enrollments
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('program_id, programs(id, title, duration)')
          .eq('user_id', user!.id)
          .eq('enrollment_status', 'active');

        if (!enrollments || enrollments.length === 0) {
          setLoading(false);
          return;
        }

        const results: ProgramData[] = [];

        for (const enrollment of enrollments) {
          const prog = enrollment.programs as any;
          if (!prog) continue;

          const programId = prog.id;

          // Fetch courses, modules, lessons in parallel
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
            supabase
              .from('progress_records')
              .select('lesson_id')
              .eq('user_id', user!.id)
              .eq('program_id', programId)
              .eq('is_completed', true),
          ]);

          const completedLessonIds = new Set<string>(
            (progressRes.data ?? []).map((p: any) => p.lesson_id)
          );

          results.push({
            program: { id: prog.id, title: prog.title, duration: prog.duration },
            courses: coursesRes.data ?? [],
            modules: modulesRes.data ?? [],
            lessons: lessonsRes.data ?? [],
            completedLessonIds,
          });
        }

        setProgramDataList(results);
      } catch (err) {
        console.error('Progress tracking fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <StudentSidebar />
      <div className="flex-1 min-w-0">
        {/* Topbar */}
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center">
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Learning</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Progress Tracking</p>
          </div>
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

          {!loading && programDataList.map(({ program, courses, modules, lessons, completedLessonIds }) => {
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
                            <span className="text-xs font-sans text-stone-400">{courseProgress}%</span>
                            <div className="w-24 h-1 bg-stone-100 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${courseProgress}%` }} />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {courseModules.map(mod => {
                            const modLessons = lessons.filter(l => l.module_id === mod.id).sort((a, b) => a.sort_order - b.sort_order);
                            const modCompleted = modLessons.filter(l => completedLessonIds.has(l.id)).length;
                            const modProgress = modLessons.length > 0 ? Math.round((modCompleted / modLessons.length) * 100) : 0;
                            const isExpanded = expandedModule === mod.id;

                            return (
                              <div key={mod.id} className="border border-stone-100 rounded-sm overflow-hidden">
                                <button
                                  onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
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
                                      // Sequential unlock: first lesson always unlocked, rest unlock after previous is completed
                                      const unlocked = lesson.unlock_type === 'immediate' || lesson.is_free || lessonIndex === 0
                                        ? true
                                        : lessonIndex > 0 ? completedLessonIds.has(modLessons[lessonIndex - 1].id) : true;

                                      return (
                                        <div key={lesson.id} className={`flex items-center gap-4 px-5 py-3 ${!unlocked ? 'opacity-50' : ''}`}>
                                          <div className="shrink-0">
                                            {isCompleted ? (
                                              <CheckCircle size={16} className="text-amber-600" />
                                            ) : unlocked ? (
                                              <Play size={16} className="text-stone-400" />
                                            ) : (
                                              <Lock size={16} className="text-stone-300" />
                                            )}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-sans ${isCompleted ? 'text-stone-500 line-through' : 'text-stone-700'}`}>{lesson.title}</p>
                                            <p className="text-xs font-sans text-stone-400 mt-0.5">{lesson.description}</p>
                                          </div>
                                          <div className="flex items-center gap-3 shrink-0">
                                            {lesson.duration && <span className="text-xs font-sans text-stone-400">{lesson.duration}</span>}
                                            {lesson.is_free && <span className="text-2xs font-sans font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-sm">Free</span>}
                                            {!unlocked && <span className="text-2xs font-sans text-stone-400 capitalize">{lesson.unlock_type}</span>}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
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
