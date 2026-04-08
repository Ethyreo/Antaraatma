import React from 'react';
import { CheckCircle, BookOpen, Download, Award, Calendar } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


// Backend integration point: fetch from /api/student/activity?studentId=current&limit=8
const activities = [
  { id: 'act-001', type: 'lesson', icon: CheckCircle, color: 'text-green-600 bg-green-50', title: 'Completed lesson', detail: 'Foods That Burden vs. Foods That Heal', time: '2 hours ago' },
  { id: 'act-002', type: 'download', icon: Download, color: 'text-blue-600 bg-blue-50', title: 'Downloaded resource', detail: 'Detox Protocol Guide (PDF)', time: '3 hours ago' },
  { id: 'act-003', type: 'lesson', icon: CheckCircle, color: 'text-green-600 bg-green-50', title: 'Completed lesson', detail: 'Nutritional Foundations of Cellular Cleansing', time: 'Yesterday' },
  { id: 'act-004', type: 'session', icon: Calendar, color: 'text-amber-600 bg-amber-50', title: 'Attended live session', detail: 'Module 4 Q&A with Dr. Vijay', time: '2 days ago' },
  { id: 'act-005', type: 'lesson', icon: CheckCircle, color: 'text-green-600 bg-green-50', title: 'Completed lesson', detail: 'The Liver as Your Master Detoxifier', time: '3 days ago' },
  { id: 'act-006', type: 'module', icon: BookOpen, color: 'text-purple-600 bg-purple-50', title: 'Started module', detail: 'Module 5: Nutrition & Detoxification', time: '3 days ago' },
  { id: 'act-007', type: 'award', icon: Award, color: 'text-amber-600 bg-amber-50', title: 'Module 4 completed', detail: 'Sleep & Recovery — Badge earned', time: '4 days ago' },
  { id: 'act-008', type: 'download', icon: Download, color: 'text-blue-600 bg-blue-50', title: 'Downloaded resource', detail: 'Sleep Optimisation Workbook', time: '5 days ago' },
];

export default function RecentActivity() {
  return (
    <div className="card-base overflow-hidden">
      <div className="p-5 border-b border-stone-100">
        <p className="section-label mb-0.5">Recent Activity</p>
        <p className="text-xs font-sans text-stone-500">Your last 8 actions</p>
      </div>
      <div className="divide-y divide-stone-100">
        {activities?.map((act) => {
          const Icon = act?.icon;
          return (
            <div key={act?.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-stone-50/50 transition-colors">
              <div className={`w-7 h-7 rounded-sm flex items-center justify-center shrink-0 mt-0.5 ${act?.color?.split(' ')?.[1]}`}>
                <Icon size={13} className={act?.color?.split(' ')?.[0]} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-sans font-500 text-stone-600">{act?.title}</p>
                <p className="text-xs font-sans text-stone-500 truncate">{act?.detail}</p>
              </div>
              <span className="text-2xs font-sans text-stone-400 shrink-0 mt-0.5">{act?.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}