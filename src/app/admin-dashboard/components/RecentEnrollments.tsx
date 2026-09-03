'use client';
import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface EnrollmentRow {
  id: string;
  enrolled_at: string;
  enrollment_status: string;
  user_profiles: { full_name: string } | null;
  programs: { title: string } | null;
  orders: { amount: number; order_status: string } | null;
}

const programColor: Record<string, string> = {
  'Awareness Session': 'bg-amber-100 text-amber-800',
  'Foundation Course': 'bg-stone-100 text-stone-700',
  'Transformation Mastery': 'bg-stone-800 text-stone-200',
};

const statusColor: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  expired: 'bg-red-100 text-red-700',
  cancelled: 'bg-stone-100 text-stone-600',
};

export default function RecentEnrollments() {
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchEnrollments() {
      try {
        const { data } = await supabase
          .from('enrollments')
          .select('id, enrolled_at, enrollment_status, user_profiles(full_name), programs(title), orders(amount, order_status)')
          .order('enrolled_at', { ascending: false })
          .limit(8);
        setEnrollments((data ?? []) as unknown as EnrollmentRow[]);
      } catch (err) {
        console.error('RecentEnrollments fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchEnrollments();
  }, []);

  return (
    <div className="card-base overflow-hidden">
      <div className="p-5 border-b border-stone-100 flex items-center justify-between">
        <div>
          <p className="section-label mb-0.5">Recent Enrollments</p>
          <p className="text-xs font-sans text-stone-500">Last 8 enrollments</p>
        </div>
        <button className="text-xs font-sans font-500 text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-1">
          View all
          <ArrowRight size={11} />
        </button>
      </div>

      <div className="divide-y divide-stone-100">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5 animate-pulse">
              <div className="w-7 h-7 rounded-full bg-stone-200 shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-stone-200 rounded w-1/2" />
                <div className="h-3 bg-stone-100 rounded w-1/3" />
              </div>
              <div className="text-right space-y-1">
                <div className="h-3 bg-stone-200 rounded w-16" />
                <div className="h-3 bg-stone-100 rounded w-12" />
              </div>
            </div>
          ))
        ) : enrollments.length === 0 ? (
          <div className="px-5 py-6 text-center">
            <p className="text-xs font-sans text-stone-400">No enrollments yet.</p>
          </div>
        ) : (
          enrollments.map((enr) => {
            const studentName = enr.user_profiles?.full_name ?? 'Unknown';
            const programTitle = enr.programs?.title ?? 'Unknown Program';
            const amount = enr.orders?.amount ? `₹${Number(enr.orders.amount).toLocaleString('en-IN')}` : '—';
            return (
              <div key={enr.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-stone-50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                  <span className="font-serif text-xs text-amber-800">{studentName[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-sans font-500 text-stone-800 truncate">{studentName}</p>
                  <span className={`status-badge text-2xs mt-0.5 ${programColor[programTitle] ?? 'bg-stone-100 text-stone-600'}`}>
                    {programTitle}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-sans font-600 text-stone-800 tabular-nums">{amount}</p>
                  <span className={`status-badge text-2xs mt-0.5 ${statusColor[enr.enrollment_status] ?? 'bg-stone-100 text-stone-600'}`}>
                    {enr.enrollment_status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
