'use client';
import React, { useEffect, useState } from 'react';
import { CheckCircle, BookOpen, Download, Award } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Icon from '@/components/ui/AppIcon';


interface ActivityItem {
  id: string;
  type: string;
  title: string;
  detail: string;
  time: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

const activityConfig: Record<string, { icon: React.ElementType; color: string }> = {
  lesson: { icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  module: { icon: BookOpen, color: 'text-purple-600 bg-purple-50' },
  award: { icon: Award, color: 'text-amber-600 bg-amber-50' },
  download: { icon: Download, color: 'text-blue-600 bg-blue-50' },
};

export default function RecentActivity() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();

    async function fetchActivity() {
      try {
        const { data: progressRecords } = await supabase
          .from('progress_records')
          .select('id, lesson_id, is_completed, completed_at, last_accessed_at, lessons(title, modules(title))')
          .eq('user_id', user.id)
          .order('last_accessed_at', { ascending: false })
          .limit(8);

        const items: ActivityItem[] = (progressRecords ?? []).map((rec: any) => {
          const lessonTitle = rec.lessons?.title ?? 'Lesson';
          const moduleTitle = rec.lessons?.modules?.title ?? '';
          if (rec.is_completed) {
            return {
              id: rec.id,
              type: 'lesson',
              title: 'Completed lesson',
              detail: lessonTitle,
              time: timeAgo(rec.completed_at ?? rec.last_accessed_at),
            };
          } else {
            return {
              id: rec.id,
              type: 'module',
              title: 'Accessed lesson',
              detail: `${lessonTitle}${moduleTitle ? ` · ${moduleTitle}` : ''}`,
              time: timeAgo(rec.last_accessed_at),
            };
          }
        });

        setActivities(items);
      } catch (err) {
        console.error('RecentActivity fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchActivity();
  }, [user]);

  return (
    <div className="card-base overflow-hidden">
      <div className="p-5 border-b border-stone-100">
        <p className="section-label mb-0.5">Recent Activity</p>
        <p className="text-xs font-sans text-stone-500">Your last actions</p>
      </div>
      <div className="divide-y divide-stone-100">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 px-5 py-3.5 animate-pulse">
              <div className="w-7 h-7 rounded-sm bg-stone-200 shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-stone-200 rounded w-1/3" />
                <div className="h-3 bg-stone-100 rounded w-2/3" />
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <div className="px-5 py-6 text-center">
            <p className="text-xs font-sans text-stone-400">No activity yet. Start a lesson to see your progress here.</p>
          </div>
        ) : (
          activities.map((act) => {
            const conf = activityConfig[act.type] ?? activityConfig.lesson;
            const Icon = conf.icon;
            const [iconColor, bgColor] = conf.color.split(' ');
            return (
              <div key={act.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-stone-50/50 transition-colors">
                <div className={`w-7 h-7 rounded-sm flex items-center justify-center shrink-0 mt-0.5 ${bgColor}`}>
                  <Icon size={13} className={iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-sans font-500 text-stone-600">{act.title}</p>
                  <p className="text-xs font-sans text-stone-500 truncate">{act.detail}</p>
                </div>
                <span className="text-2xs font-sans text-stone-400 shrink-0 mt-0.5">{act.time}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}