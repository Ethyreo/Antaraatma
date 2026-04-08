'use client';
import React, { useEffect, useState } from 'react';
import { TrendingUp, Users, BookOpen, IndianRupee, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Icon from '@/components/ui/AppIcon';


interface KPIItem {
  id: string;
  label: string;
  value: string;
  change: string;
  changeLabel: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  note: string;
  alert?: boolean;
}

export default function AdminKPIGrid() {
  const [kpis, setKpis] = useState<KPIItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchKPIs() {
      try {
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

        const [
          { count: activeStudents },
          { count: newEnrollmentsThisMonth },
          { count: newEnrollmentsLastMonth },
          { data: paidOrdersThisMonth },
          { data: paidOrdersLastMonth },
          { count: openLeads },
          { count: completedProgress },
          { count: totalProgress },
        ] = await Promise.all([
          supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'student').eq('is_active', true),
          supabase.from('enrollments').select('*', { count: 'exact', head: true }).gte('enrolled_at', thisMonthStart),
          supabase.from('enrollments').select('*', { count: 'exact', head: true }).gte('enrolled_at', lastMonthStart).lte('enrolled_at', lastMonthEnd),
          supabase.from('orders').select('amount').eq('order_status', 'paid').gte('created_at', thisMonthStart),
          supabase.from('orders').select('amount').eq('order_status', 'paid').gte('created_at', lastMonthStart).lte('created_at', lastMonthEnd),
          supabase.from('leads').select('*', { count: 'exact', head: true }).in('lead_status', ['new', 'contacted']),
          supabase.from('progress_records').select('*', { count: 'exact', head: true }).eq('is_completed', true),
          supabase.from('progress_records').select('*', { count: 'exact', head: true }),
        ]);

        const revenueThis = paidOrdersThisMonth?.reduce((s, o) => s + Number(o.amount), 0) ?? 0;
        const revenueLast = paidOrdersLastMonth?.reduce((s, o) => s + Number(o.amount), 0) ?? 0;
        const revenueChange = revenueLast > 0 ? Math.round(((revenueThis - revenueLast) / revenueLast) * 100) : 0;

        const enrollChange = (newEnrollmentsThisMonth ?? 0) - (newEnrollmentsLastMonth ?? 0);
        const completionRate = (totalProgress ?? 0) > 0 ? Math.round(((completedProgress ?? 0) / (totalProgress ?? 1)) * 100) : 0;

        setKpis([
          {
            id: 'kpi-active-students',
            label: 'Active Students',
            value: String(activeStudents ?? 0),
            change: `${activeStudents ?? 0}`,
            changeLabel: 'total registered',
            trend: 'up',
            icon: Users,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
            note: 'All active student accounts',
          },
          {
            id: 'kpi-new-enrollments',
            label: 'New Enrollments',
            value: String(newEnrollmentsThisMonth ?? 0),
            change: enrollChange >= 0 ? `+${enrollChange}` : String(enrollChange),
            changeLabel: 'vs last month',
            trend: enrollChange >= 0 ? 'up' : 'down',
            icon: BookOpen,
            iconBg: 'bg-green-50',
            iconColor: 'text-green-600',
            note: 'This month across all programs',
          },
          {
            id: 'kpi-revenue',
            label: 'Monthly Revenue',
            value: `₹${revenueThis.toLocaleString('en-IN')}`,
            change: `${revenueChange >= 0 ? '+' : ''}${revenueChange}%`,
            changeLabel: 'vs last month',
            trend: revenueChange >= 0 ? 'up' : 'down',
            icon: IndianRupee,
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-700',
            note: 'All paid orders this month',
          },
          {
            id: 'kpi-completion',
            label: 'Course Completion Rate',
            value: `${completionRate}%`,
            change: `${completionRate}%`,
            changeLabel: 'lessons completed',
            trend: completionRate >= 80 ? 'up' : 'neutral',
            icon: TrendingUp,
            iconBg: 'bg-green-50',
            iconColor: 'text-green-600',
            note: 'Across all enrolled students',
          },
          {
            id: 'kpi-open-leads',
            label: 'Open Leads',
            value: String(openLeads ?? 0),
            change: String(openLeads ?? 0),
            changeLabel: 'need follow-up',
            trend: 'neutral',
            icon: AlertCircle,
            iconBg: 'bg-orange-50',
            iconColor: 'text-orange-600',
            note: 'New + contacted leads',
            alert: (openLeads ?? 0) > 5,
          },
        ]);
      } catch (err) {
        console.error('AdminKPIGrid fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchKPIs();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="card-base p-5 xl:p-6 animate-pulse">
            <div className="w-9 h-9 rounded-sm bg-stone-200 mb-4" />
            <div className="h-3 bg-stone-200 rounded w-1/2 mb-2" />
            <div className="h-8 bg-stone-200 rounded w-2/3 mb-2" />
            <div className="h-3 bg-stone-100 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-5">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div key={kpi.id} className={`card-base p-5 xl:p-6 ${kpi.alert ? 'border-red-200 bg-red-50/30' : ''}`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-9 h-9 rounded-sm ${kpi.iconBg} flex items-center justify-center`}>
                <Icon size={16} className={kpi.iconColor} />
              </div>
              {kpi.alert && (
                <span className="status-badge bg-red-100 text-red-700 text-2xs">Needs Attention</span>
              )}
            </div>
            <p className="section-label mb-1">{kpi.label}</p>
            <p className="font-serif text-3xl text-stone-900 tabular-nums mb-2">{kpi.value}</p>
            <div className="flex items-center gap-1.5 mb-3">
              <span className={`text-xs font-sans font-500 tabular-nums ${
                kpi.trend === 'up' ? 'text-green-600' :
                kpi.trend === 'down' ? 'text-red-600' : 'text-orange-600'
              }`}>
                {kpi.change}
              </span>
              <span className="text-xs font-sans text-stone-400">{kpi.changeLabel}</span>
            </div>
            <p className="text-xs font-sans text-stone-400 leading-snug">{kpi.note}</p>
          </div>
        );
      })}
    </div>
  );
}