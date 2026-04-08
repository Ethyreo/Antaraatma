'use client';
import React, { useState } from 'react';
import StudentSidebar from '@/components/StudentSidebar';
import { mockPrograms, mockCourses, mockModules, mockLessons, mockProgressRecords, calculateProgramProgress, isLessonUnlocked } from '@/lib/data/mockData';
import { CheckCircle, Lock, Play, ChevronDown, ChevronUp } from 'lucide-react';

const CURRENT_USER_ID = 'user-student-1';

export default function ProgressTrackingPage() {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

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
          {mockPrograms?.filter(p => p?.status === 'published')?.map(program => {
            const programProgress = calculateProgramProgress(CURRENT_USER_ID, program?.id);
            const programLessons = mockLessons?.filter(l => l?.programId === program?.id);
            const completedCount = mockProgressRecords?.filter(p => p?.userId === CURRENT_USER_ID && p?.programId === program?.id && p?.isCompleted)?.length;
            const isCertEligible = programProgress === 100;
            const courses = mockCourses?.filter(c => c?.programId === program?.id)?.sort((a, b) => a?.order - b?.order);

            return (
              <div key={program?.id} className="bg-white border border-stone-200/80 rounded-sm overflow-hidden">
                {/* Program Header */}
                <div className="px-8 py-6 border-b border-stone-100 bg-stone-50">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest mb-1">{program?.duration}</p>
                      <h2 className="font-serif text-2xl text-stone-800">{program?.title}</h2>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-serif text-3xl text-stone-800 tabular-nums">{programProgress}%</p>
                      <p className="text-xs font-sans text-stone-400 mt-0.5">{completedCount}/{programLessons?.length} lessons</p>
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
                  {courses?.map(course => {
                    const courseModules = mockModules?.filter(m => m?.courseId === course?.id)?.sort((a, b) => a?.order - b?.order);
                    const courseLessons = mockLessons?.filter(l => l?.courseId === course?.id);
                    const courseCompleted = mockProgressRecords?.filter(p => p?.userId === CURRENT_USER_ID && p?.courseId === course?.id && p?.isCompleted)?.length;
                    const courseProgress = courseLessons?.length > 0 ? Math.round((courseCompleted / courseLessons?.length) * 100) : 0;

                    return (
                      <div key={course?.id} className="px-8 py-5">
                        <div className="flex items-center justify-between gap-4 mb-4">
                          <h3 className="font-serif text-lg text-stone-700">{course?.title}</h3>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-sans text-stone-400">{courseProgress}%</span>
                            <div className="w-24 h-1 bg-stone-100 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${courseProgress}%` }} />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {courseModules?.map(mod => {
                            const modLessons = mockLessons?.filter(l => l?.moduleId === mod?.id)?.sort((a, b) => a?.order - b?.order);
                            const modCompleted = mockProgressRecords?.filter(p => p?.userId === CURRENT_USER_ID && p?.moduleId === mod?.id && p?.isCompleted)?.length;
                            const modProgress = modLessons?.length > 0 ? Math.round((modCompleted / modLessons?.length) * 100) : 0;
                            const isExpanded = expandedModule === mod?.id;

                            return (
                              <div key={mod?.id} className="border border-stone-100 rounded-sm overflow-hidden">
                                <button
                                  onClick={() => setExpandedModule(isExpanded ? null : mod?.id)}
                                  className="w-full flex items-center justify-between gap-4 px-5 py-3.5 bg-stone-50/50 hover:bg-stone-50 transition-colors text-left"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${modProgress === 100 ? 'bg-amber-500' : modProgress > 0 ? 'bg-amber-300' : 'bg-stone-300'}`} />
                                    <span className="text-sm font-sans font-medium text-stone-700">{mod?.title}</span>
                                    {mod?.focusArea && (
                                      <span className="text-2xs font-sans text-stone-400 bg-stone-100 px-2 py-0.5 rounded-sm">{mod?.focusArea}</span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-xs font-sans text-stone-400">{modCompleted}/{modLessons?.length}</span>
                                    {isExpanded ? <ChevronUp size={14} className="text-stone-400" /> : <ChevronDown size={14} className="text-stone-400" />}
                                  </div>
                                </button>
                                {isExpanded && modLessons?.length > 0 && (
                                  <div className="divide-y divide-stone-50">
                                    {modLessons?.map(lesson => {
                                      const isCompleted = mockProgressRecords?.some(p => p?.userId === CURRENT_USER_ID && p?.lessonId === lesson?.id && p?.isCompleted);
                                      const unlocked = isLessonUnlocked(lesson?.id, CURRENT_USER_ID);

                                      return (
                                        <div key={lesson?.id} className={`flex items-center gap-4 px-5 py-3 ${!unlocked ? 'opacity-50' : ''}`}>
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
                                            <p className={`text-sm font-sans ${isCompleted ? 'text-stone-500 line-through' : 'text-stone-700'}`}>{lesson?.title}</p>
                                            <p className="text-xs font-sans text-stone-400 mt-0.5">{lesson?.description}</p>
                                          </div>
                                          <div className="flex items-center gap-3 shrink-0">
                                            {lesson?.duration && <span className="text-xs font-sans text-stone-400">{lesson?.duration}</span>}
                                            {lesson?.isFree && <span className="text-2xs font-sans font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-sm">Free</span>}
                                            {!unlocked && <span className="text-2xs font-sans text-stone-400 capitalize">{lesson?.unlockType}</span>}
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
