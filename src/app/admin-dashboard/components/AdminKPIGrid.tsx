import React from 'react';
import { TrendingUp, TrendingDown, Users, BookOpen, IndianRupee, AlertCircle } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


// Backend integration point: fetch from /api/admin/kpis
// Grid plan: 6 cards → grid-cols-3 → 2 rows of 3
const kpis = [
  {
    id: 'kpi-active-students',
    label: 'Active Students',
    value: '248',
    change: '+14',
    changeLabel: 'vs last month',
    trend: 'up',
    icon: Users,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    note: 'Accessed content in last 7 days',
  },
  {
    id: 'kpi-new-enrollments',
    label: 'New Enrollments',
    value: '34',
    change: '+8',
    changeLabel: 'vs last month',
    trend: 'up',
    icon: BookOpen,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    note: 'This month across all programs',
  },
  {
    id: 'kpi-revenue',
    label: 'Monthly Revenue',
    value: '₹3,84,000',
    change: '+22%',
    changeLabel: 'vs last month',
    trend: 'up',
    icon: IndianRupee,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-700',
    note: 'Foundation + Mastery enrollments',
  },
  {
    id: 'kpi-conversion',
    label: 'Awareness → Foundation',
    value: '41%',
    change: '-3%',
    changeLabel: 'vs last month',
    trend: 'down',
    icon: TrendingDown,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    note: 'Conversion rate needs attention',
    alert: true,
  },
  {
    id: 'kpi-completion',
    label: 'Course Completion Rate',
    value: '94%',
    change: '+1%',
    changeLabel: 'vs last month',
    trend: 'up',
    icon: TrendingUp,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    note: 'Foundation Course completions',
  },
  {
    id: 'kpi-open-leads',
    label: 'Open Leads',
    value: '14',
    change: '5 urgent',
    changeLabel: 'need follow-up today',
    trend: 'neutral',
    icon: AlertCircle,
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    note: '5 uncontacted for 72h+',
    alert: true,
  },
];

export default function AdminKPIGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-5">
      {kpis?.map((kpi) => {
        const Icon = kpi?.icon;
        return (
          <div
            key={kpi?.id}
            className={`card-base p-5 xl:p-6 ${kpi?.alert ? 'border-red-200 bg-red-50/30' : ''}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-9 h-9 rounded-sm ${kpi?.iconBg} flex items-center justify-center`}>
                <Icon size={16} className={kpi?.iconColor} />
              </div>
              {kpi?.alert && (
                <span className="status-badge bg-red-100 text-red-700 text-2xs">Needs Attention</span>
              )}
            </div>
            <p className="section-label mb-1">{kpi?.label}</p>
            <p className="font-serif text-3xl text-stone-900 tabular-nums mb-2">{kpi?.value}</p>
            <div className="flex items-center gap-1.5 mb-3">
              <span className={`text-xs font-sans font-500 tabular-nums ${
                kpi?.trend === 'up' ? 'text-green-600' :
                kpi?.trend === 'down'? 'text-red-600' : 'text-orange-600'
              }`}>
                {kpi?.change}
              </span>
              <span className="text-xs font-sans text-stone-400">{kpi?.changeLabel}</span>
            </div>
            <p className="text-xs font-sans text-stone-400 leading-snug">{kpi?.note}</p>
          </div>
        );
      })}
    </div>
  );
}