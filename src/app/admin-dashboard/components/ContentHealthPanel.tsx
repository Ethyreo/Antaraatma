import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, FileText, BookOpen, Layers, FolderOpen } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


// Backend integration point: fetch from /api/admin/content-health
const contentItems = [
  { id: 'ch-programs', label: 'Programs', count: 3, published: 3, drafts: 0, issues: 0, icon: BookOpen },
  { id: 'ch-modules', label: 'Modules', count: 24, published: 19, drafts: 3, issues: 2, icon: Layers },
  { id: 'ch-lessons', label: 'Lessons', count: 148, published: 131, drafts: 11, issues: 6, icon: FileText },
  { id: 'ch-resources', label: 'Resources', count: 62, published: 58, drafts: 2, issues: 2, icon: FolderOpen },
];

const recentActivity = [
  { id: 'ca-001', action: 'Lesson published', item: 'Sustaining Detox Beyond the Program', time: '1 hour ago', type: 'success' },
  { id: 'ca-002', action: 'Module draft created', item: 'Advanced Fasting Protocols', time: '3 hours ago', type: 'neutral' },
  { id: 'ca-003', action: 'Resource updated', item: 'Healing Foods Chart v2', time: 'Yesterday', type: 'neutral' },
  { id: 'ca-004', action: 'Broken resource link', item: 'Module 3 PDF attachment', time: '2 days ago', type: 'error' },
];

const typeConfig = {
  success: { icon: CheckCircle, color: 'text-green-600' },
  neutral: { icon: CheckCircle, color: 'text-stone-400' },
  error: { icon: XCircle, color: 'text-red-500' },
};

export default function ContentHealthPanel() {
  return (
    <div className="card-base overflow-hidden h-full flex flex-col">
      <div className="p-5 border-b border-stone-100">
        <p className="section-label mb-0.5">Content Health</p>
        <p className="text-xs font-sans text-stone-500">Platform content status</p>
      </div>

      {/* Content counts */}
      <div className="p-5 grid grid-cols-2 gap-3 border-b border-stone-100">
        {contentItems.map((item) => {
          const Icon = item.icon;
          const hasIssues = item.issues > 0;
          return (
            <div key={item.id} className={`p-3 rounded-sm border ${hasIssues ? 'border-orange-200 bg-orange-50/50' : 'border-stone-100 bg-stone-50'}`}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Icon size={12} className={hasIssues ? 'text-orange-600' : 'text-stone-500'} />
                <span className="text-2xs font-sans font-600 uppercase tracking-wide text-stone-500">{item.label}</span>
              </div>
              <p className="font-serif text-xl text-stone-900 tabular-nums">{item.count}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xs font-sans text-green-600">{item.published} live</span>
                {item.drafts > 0 && <span className="text-2xs font-sans text-stone-400">{item.drafts} draft</span>}
                {item.issues > 0 && (
                  <span className="text-2xs font-sans text-orange-600 flex items-center gap-0.5">
                    <AlertTriangle size={9} />
                    {item.issues}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent content activity */}
      <div className="flex-1 divide-y divide-stone-100">
        <p className="px-5 py-3 text-2xs font-sans font-600 uppercase tracking-wide text-stone-400">Recent Changes</p>
        {recentActivity.map((act) => {
          const config = typeConfig[act.type as keyof typeof typeConfig];
          const Icon = config.icon;
          return (
            <div key={act.id} className="flex items-start gap-2.5 px-5 py-3 hover:bg-stone-50 transition-colors">
              <Icon size={12} className={`${config.color} mt-0.5 shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-sans text-stone-500">{act.action}</p>
                <p className="text-xs font-sans font-500 text-stone-700 truncate">{act.item}</p>
              </div>
              <span className="text-2xs font-sans text-stone-400 shrink-0">{act.time}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}