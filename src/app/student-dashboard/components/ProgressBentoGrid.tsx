'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { TrendingUp, Clock, Award, Flame } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ProgressStats {
  overallPercent: number;
  currentModuleTitle: string;
  currentModuleNumber: number;
  totalModules: number;
  completedLessons: number;
  totalLessons: number;
  streakDays: number;
  lessonsThisWeek: number;
  programTitle: string;
  certPercent: number;
}

function ProgressRing({ value }: { value: number }) {
  const data = [{ name: 'Overall', value, fill: 'hsl(38 47% 55%)' }];
  return (
    <ResponsiveContainer width={80} height={80}>
      <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" startAngle={90} endAngle={-270} data={data} barSize={6}>
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar background={{ fill: 'hsl(35 15% 90%)' }} dataKey="value" angleAxisId={0} cornerRadius={3} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

export default function ProgressBentoGrid() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    try {
      // Get active enrollment
      const { data: enrollment } = await supabase
        .from('enrollments')
        .select('program_id, programs(title)')
        .eq('user_id', user.id)
        .eq('enrollment_status', 'active')
        .order('enrolled_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!enrollment) {
        setLoading(false);
        return;
      }

      const programId = enrollment.program_id;
      const programTitle = (enrollment.programs as any)?.title ?? 'Your Program';

      const { data: modules } = await supabase
        .from('modules')
        .select('id, title, sort_order')
        .eq('program_id', programId)
        .eq('status', 'published')
        .order('sort_order', { ascending: true });

      const { data: lessons } = await supabase
        .from('lessons')
        .select('id, module_id, sort_order')
        .eq('program_id', programId)
        .eq('status', 'published')
        .order('sort_order', { ascending: true });

      const { data: progressRecords } = await supabase
        .from('progress_records')
        .select('lesson_id, completed_at, last_accessed_at')
        .eq('user_id', user.id)
        .eq('program_id', programId)
        .eq('is_completed', true);

      const totalLessons = lessons?.length ?? 0;
      const completedLessons = progressRecords?.length ?? 0;
      const overallPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      const completedLessonIds = new Set(progressRecords?.map((p) => p.lesson_id) ?? []);
      let currentModuleIndex = 0;
      if (modules && lessons) {
        for (let i = 0; i < modules.length; i++) {
          const moduleLessons = lessons.filter((l) => l.module_id === modules[i].id);
          const allDone = moduleLessons.every((l) => completedLessonIds.has(l.id));
          if (!allDone) { currentModuleIndex = i; break; }
          if (i === modules.length - 1) currentModuleIndex = i;
        }
      }

      const currentModule = modules?.[currentModuleIndex];

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const lessonsThisWeek = progressRecords?.filter((p) =>
        p.completed_at && new Date(p.completed_at) >= weekAgo
      ).length ?? 0;

      const activityDates = new Set(
        progressRecords?.map((p) => p.last_accessed_at?.split('T')[0]).filter(Boolean) ?? []
      );
      let streakDays = 0;
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        if (activityDates.has(key)) streakDays++;
        else if (i > 0) break;
      }

      setStats({
        overallPercent,
        currentModuleTitle: currentModule?.title ?? 'Getting Started',
        currentModuleNumber: currentModuleIndex + 1,
        totalModules: modules?.length ?? 0,
        completedLessons,
        totalLessons,
        streakDays,
        lessonsThisWeek,
        programTitle,
        certPercent: overallPercent,
      });
    } catch (err) {
      console.error('Progress fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Re-fetch when the tab becomes visible again (e.g. user returns from progress-tracking page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchProgress();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchProgress]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 xl:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`card-base p-6 animate-pulse bg-stone-100 ${i === 1 || i === 3 ? 'col-span-2' : ''}`} style={{ height: 120 }} />
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="card-base p-6 text-center">
        <p className="text-sm font-sans text-stone-500">No active enrollment found. Enroll in a program to see your progress.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 xl:gap-5">
      {/* Hero: Overall Progress */}
      <div className="col-span-2 card-base p-6 flex items-center gap-6">
        <div className="relative shrink-0">
          <ProgressRing value={stats.overallPercent} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-lg text-stone-900 tabular-nums">{stats.overallPercent}%</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="section-label mb-1">{stats.programTitle} Progress</p>
          <p className="font-serif text-2xl text-stone-900 mb-1">Module {stats.currentModuleNumber} of {stats.totalModules}</p>
          <p className="text-xs font-sans text-stone-500 mb-3">{stats.currentModuleTitle}</p>
          <div className="w-full bg-stone-100 rounded-full h-1.5">
            <div className="bg-amber-600 h-1.5 rounded-full transition-all duration-700" style={{ width: `${stats.overallPercent}%` }} />
          </div>
          <p className="text-xs font-sans text-stone-400 mt-1.5">{stats.completedLessons} of {stats.totalLessons} lessons completed</p>
        </div>
      </div>

      {/* Streak */}
      <div className="card-base p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="section-label">Learning Streak</p>
          <Flame size={15} className="text-orange-500" />
        </div>
        <p className="font-serif text-3xl text-stone-900 tabular-nums">{stats.streakDays}</p>
        <p className="text-xs font-sans text-stone-500">consecutive days</p>
        <div className="flex gap-1 mt-auto">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={`streak-day-${i + 1}`} className={`flex-1 h-1.5 rounded-full ${i < Math.min(stats.streakDays, 7) ? 'bg-orange-400' : 'bg-stone-200'}`} />
          ))}
        </div>
      </div>

      {/* Next session placeholder */}
      <div className="card-base p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="section-label">Next Live Session</p>
          <Clock size={15} className="text-amber-600" />
        </div>
        <p className="font-serif text-base text-stone-900 leading-snug">Module {stats.currentModuleNumber} Q&A with Dr. Vijay</p>
        <p className="text-xs font-sans font-500 text-amber-700 mt-auto">Check announcements</p>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-sans text-stone-500">Stay tuned</span>
        </div>
      </div>

      {/* Lessons completed this week */}
      <div className="col-span-2 card-base p-5 flex items-center gap-5">
        <div className="w-10 h-10 rounded-sm bg-amber-50 flex items-center justify-center shrink-0">
          <TrendingUp size={18} className="text-amber-700" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="section-label mb-1">Lessons Completed This Week</p>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl text-stone-900 tabular-nums">{stats.lessonsThisWeek}</span>
            <span className="text-xs font-sans text-stone-500">lessons this week</span>
          </div>
        </div>
      </div>

      {/* Certificate progress */}
      <div className="col-span-2 card-base p-5 flex items-center gap-5">
        <div className="w-10 h-10 rounded-sm bg-stone-50 flex items-center justify-center shrink-0">
          <Award size={18} className="text-stone-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="section-label mb-1">{stats.programTitle} Certificate</p>
          <p className="text-sm font-sans font-500 text-stone-700">{stats.certPercent}% toward completion</p>
          <p className="text-xs font-sans text-stone-400 mt-0.5">Complete all modules + final assessment</p>
        </div>
        <div className="text-right shrink-0">
          <span className="status-badge bg-stone-100 text-stone-600">{stats.certPercent >= 100 ? 'Completed' : 'In Progress'}</span>
        </div>
      </div>
    </div>
  );
}