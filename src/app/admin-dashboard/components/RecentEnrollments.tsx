import React from 'react';
import { ArrowRight } from 'lucide-react';

// Backend integration point: fetch from /api/admin/enrollments?limit=8&sort=recent
const enrollments = [
  { id: 'enr-001', student: 'Ananya Iyer', program: 'Foundation Course', amount: '₹12,000', date: '05 Apr 2026', status: 'active' },
  { id: 'enr-002', student: 'Vikram Rao', program: 'Awareness Session', amount: '₹499', date: '05 Apr 2026', status: 'active' },
  { id: 'enr-003', student: 'Preethi Suresh', program: 'Transformation Mastery', amount: '₹48,000', date: '04 Apr 2026', status: 'active' },
  { id: 'enr-004', student: 'Arun Kumar', program: 'Foundation Course', amount: '₹12,000', date: '04 Apr 2026', status: 'active' },
  { id: 'enr-005', student: 'Nisha Verma', program: 'Awareness Session', amount: '₹499', date: '03 Apr 2026', status: 'refunded' },
  { id: 'enr-006', student: 'Karthik Balan', program: 'Foundation Course', amount: '₹12,000', date: '03 Apr 2026', status: 'active' },
  { id: 'enr-007', student: 'Smitha Rao', program: 'Transformation Mastery', amount: '₹16,000', date: '02 Apr 2026', status: 'instalment' },
  { id: 'enr-008', student: 'Deepak Nair', program: 'Awareness Session', amount: '₹499', date: '01 Apr 2026', status: 'active' },
];

const programColor: Record<string, string> = {
  'Awareness Session': 'bg-amber-100 text-amber-800',
  'Foundation Course': 'bg-stone-100 text-stone-700',
  'Transformation Mastery': 'bg-stone-800 text-stone-200',
};

const statusColor: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  refunded: 'bg-red-100 text-red-700',
  instalment: 'bg-blue-100 text-blue-700',
};

export default function RecentEnrollments() {
  return (
    <div className="card-base overflow-hidden">
      <div className="p-5 border-b border-stone-100 flex items-center justify-between">
        <div>
          <p className="section-label mb-0.5">Recent Enrollments</p>
          <p className="text-xs font-sans text-stone-500">Last 8 orders</p>
        </div>
        <button className="text-xs font-sans font-500 text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-1">
          View all
          <ArrowRight size={11} />
        </button>
      </div>

      <div className="divide-y divide-stone-100">
        {enrollments.map((enr) => (
          <div key={enr.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-stone-50 transition-colors">
            <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
              <span className="font-serif text-xs text-amber-800">{enr.student[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-sans font-500 text-stone-800 truncate">{enr.student}</p>
              <span className={`status-badge text-2xs mt-0.5 ${programColor[enr.program] ?? 'bg-stone-100 text-stone-600'}`}>
                {enr.program}
              </span>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-sans font-600 text-stone-800 tabular-nums">{enr.amount}</p>
              <span className={`status-badge text-2xs mt-0.5 ${statusColor[enr.status] ?? 'bg-stone-100 text-stone-600'}`}>
                {enr.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}