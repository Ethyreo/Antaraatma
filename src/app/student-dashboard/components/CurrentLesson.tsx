'use client';
import React, { useEffect, useState } from 'react';
import { Play, CheckCircle, Lock, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Icon from '@/components/ui/AppIcon';


interface LessonItem {
  id: string;
  title: string;
  duration: string | null;
  status: 'completed' | 'current' | 'locked';
}

interface ModuleData {
  id: string;
  title: string;
  moduleNumber: number;
  totalModules: number;
  completedLessons: number;
  totalLessons: number;
  lessons: LessonItem[];
}

const statusConfig = {
  completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Completed' },
  current: { icon: Play, color: 'text-amber-700', bg: 'bg-amber-50', label: 'Continue' },
  locked: { icon: Lock, color: 'text-stone-400', bg: 'bg-stone-50', label: 'Locked' },
};

export default function CurrentLesson() {
  const { user } = useAuth();
  const [moduleData, setModuleData] = useState<ModuleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();

    async function fetchCurrentLesson() {
      try {
        // Get active enrollment
        const { data: enrollment } = await supabase
          .from('enrollments')
          .select('program_id')
          .eq('user_id', user.id)
          .eq('enrollment_status', 'active')
          .order('enrolled_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!enrollment) { setLoading(false); return; }

        const programId = enrollment.program_id;

        // Get all modules
        const { data: modules } = await supabase
          .from('modules')
          .select('id, title, sort_order')
          .eq('program_id', programId)
          .eq('status', 'published')
          .order('sort_order', { ascending: true });

        if (!modules?.length) { setLoading(false); return; }

        // Get completed lessons
        const { data: progressRecords } = await supabase
          .from('progress_records')
          .select('lesson_id')
          .eq('user_id', user.id)
          .eq('program_id', programId)
          .eq('is_completed', true);

        const completedIds = new Set(progressRecords?.map((p) => p.lesson_id) ?? []);

        // Find current module (first with incomplete lessons)
        let currentModuleIdx = 0;
        for (let i = 0; i < modules.length; i++) {
          const { data: mLessons } = await supabase
            .from('lessons')
            .select('id')
            .eq('module_id', modules[i].id)
            .eq('status', 'published');
          const allDone = mLessons?.every((l) => completedIds.has(l.id));
          if (!allDone) { currentModuleIdx = i; break; }
          if (i === modules.length - 1) currentModuleIdx = i;
        }

        const currentMod = modules[currentModuleIdx];

        // Get lessons for current module
        const { data: lessons } = await supabase
          .from('lessons')
          .select('id, title, duration, sort_order')
          .eq('module_id', currentMod.id)
          .eq('status', 'published')
          .order('sort_order', { ascending: true });

        let foundCurrent = false;
        const lessonItems: LessonItem[] = (lessons ?? []).map((l) => {
          if (completedIds.has(l.id)) {
            return { id: l.id, title: l.title, duration: l.duration, status: 'completed' };
          } else if (!foundCurrent) {
            foundCurrent = true;
            return { id: l.id, title: l.title, duration: l.duration, status: 'current' };
          } else {
            return { id: l.id, title: l.title, duration: l.duration, status: 'locked' };
          }
        });

        const completedCount = lessonItems.filter((l) => l.status === 'completed').length;

        setModuleData({
          id: currentMod.id,
          title: currentMod.title,
          moduleNumber: currentModuleIdx + 1,
          totalModules: modules.length,
          completedLessons: completedCount,
          totalLessons: lessonItems.length,
          lessons: lessonItems,
        });
      } catch (err) {
        console.error('CurrentLesson fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentLesson();
  }, [user]);

  const handleContinue = () => {
    toast.success('Opening lesson player...');
  };

  if (loading) {
    return <div className="card-base p-6 animate-pulse bg-stone-100" style={{ height: 300 }} />;
  }

  if (!moduleData) {
    return (
      <div className="card-base p-6 text-center">
        <p className="text-sm font-sans text-stone-500">No active enrollment. Enroll in a program to start learning.</p>
      </div>
    );
  }

  return (
    <div className="card-base overflow-hidden">
      <div className="p-6 border-b border-stone-100 flex items-start justify-between gap-4">
        <div>
          <p className="section-label mb-1">Continue Learning</p>
          <h3 className="font-serif text-xl text-stone-900">{moduleData.title}</h3>
          <p className="text-xs font-sans text-stone-500 mt-1">
            Module {moduleData.moduleNumber} of {moduleData.totalModules} ·{' '}
            {moduleData.completedLessons}/{moduleData.totalLessons} lessons done
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="w-12 h-12 rounded-full bg-stone-50 flex items-center justify-center">
            <span className="font-serif text-sm text-stone-700 tabular-nums">
              {moduleData.totalLessons > 0 ? Math.round((moduleData.completedLessons / moduleData.totalLessons) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 bg-stone-50 border-b border-stone-100">
        <div className="w-full bg-stone-200 rounded-full h-1">
          <div
            className="bg-amber-600 h-1 rounded-full transition-all duration-700"
            style={{ width: `${moduleData.totalLessons > 0 ? (moduleData.completedLessons / moduleData.totalLessons) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="divide-y divide-stone-100">
        {moduleData.lessons.map((lesson) => {
          const config = statusConfig[lesson.status];
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
                {lesson.duration && <p className="text-xs font-sans text-stone-400 mt-0.5">{lesson.duration}</p>}
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