'use client';
import React from 'react';
import { Play, CheckCircle, Lock, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';


// Backend integration point: fetch from /api/student/current-lesson?studentId=current
const currentModule = {
  id: 'module-005',
  title: 'Nutrition & Detoxification',
  moduleNumber: 5,
  totalModules: 8,
  completedLessons: 3,
  totalLessons: 6,
  lessons: [
    { id: 'lesson-5-1', title: 'The Liver as Your Master Detoxifier', duration: '18 min', status: 'completed' },
    { id: 'lesson-5-2', title: 'Nutritional Foundations of Cellular Cleansing', duration: '22 min', status: 'completed' },
    { id: 'lesson-5-3', title: 'Foods That Burden vs. Foods That Heal', duration: '26 min', status: 'completed' },
    { id: 'lesson-5-4', title: 'The 7-Day Gentle Detox Protocol', duration: '31 min', status: 'current' },
    { id: 'lesson-5-5', title: 'Understanding Herxheimer Reactions', duration: '19 min', status: 'locked' },
    { id: 'lesson-5-6', title: 'Sustaining Detox Beyond the Program', duration: '24 min', status: 'locked' },
  ],
};

const statusConfig = {
  completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Completed' },
  current: { icon: Play, color: 'text-amber-700', bg: 'bg-amber-50', label: 'Continue' },
  locked: { icon: Lock, color: 'text-stone-400', bg: 'bg-stone-50', label: 'Locked' },
};

export default function CurrentLesson() {
  const handleContinue = () => {
    toast.success('Opening lesson player...');
  };

  return (
    <div className="card-base overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-stone-100 flex items-start justify-between gap-4">
        <div>
          <p className="section-label mb-1">Continue Learning</p>
          <h3 className="font-serif text-xl text-stone-900">{currentModule.title}</h3>
          <p className="text-xs font-sans text-stone-500 mt-1">
            Module {currentModule.moduleNumber} of {currentModule.totalModules} ·{' '}
            {currentModule.completedLessons}/{currentModule.totalLessons} lessons done
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center">
            <span className="font-serif text-sm text-stone-700 tabular-nums">
              {Math.round((currentModule.completedLessons / currentModule.totalLessons) * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Module progress bar */}
      <div className="px-6 py-3 bg-stone-50 border-b border-stone-100">
        <div className="w-full bg-stone-200 rounded-full h-1">
          <div
            className="bg-amber-600 h-1 rounded-full transition-all duration-700"
            style={{ width: `${(currentModule.completedLessons / currentModule.totalLessons) * 100}%` }}
          />
        </div>
      </div>

      {/* Lessons list */}
      <div className="divide-y divide-stone-100">
        {currentModule.lessons.map((lesson) => {
          const config = statusConfig[lesson.status as keyof typeof statusConfig];
          const Icon = config.icon;
          const isCurrent = lesson.status === 'current';

          return (
            <div
              key={lesson.id}
              className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                isCurrent ? 'bg-amber-50/50' : lesson.status === 'locked' ? 'opacity-60' : 'hover:bg-stone-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center shrink-0`}>
                <Icon size={14} className={config.color} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-sans font-500 truncate ${isCurrent ? 'text-amber-900' : 'text-stone-700'}`}>
                  {lesson.title}
                </p>
                <p className="text-xs font-sans text-stone-400 mt-0.5">{lesson.duration}</p>
              </div>
              {isCurrent && (
                <button
                  onClick={handleContinue}
                  className="shrink-0 flex items-center gap-1.5 bg-amber-800 text-amber-50 px-3 py-1.5 text-xs font-sans font-500 rounded-sm hover:bg-amber-900 transition-colors active:scale-95"
                >
                  Continue
                  <ChevronRight size={12} />
                </button>
              )}
              {lesson.status === 'completed' && (
                <span className="text-2xs font-sans text-green-600 shrink-0">Done</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}