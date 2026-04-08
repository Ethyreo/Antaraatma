'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Backend integration point: fetch from /api/admin/enrollment-trend?months=6
const enrollmentTrend = [
  { month: 'Nov', awareness: 48, foundation: 19, mastery: 4 },
  { month: 'Dec', awareness: 52, foundation: 22, mastery: 5 },
  { month: 'Jan', awareness: 61, foundation: 24, mastery: 6 },
  { month: 'Feb', awareness: 55, foundation: 21, mastery: 7 },
  { month: 'Mar', awareness: 74, foundation: 28, mastery: 8 },
  { month: 'Apr', awareness: 38, foundation: 34, mastery: 5 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-stone-200 rounded-sm px-4 py-3 shadow-card-hover">
      <p className="text-xs font-sans font-600 text-stone-700 mb-2">{label} 2026</p>
      {payload.map((entry: any) => (
        <div key={`tooltip-${entry.dataKey}`} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-xs font-sans text-stone-600 capitalize">{entry.dataKey}:</span>
          <span className="text-xs font-sans font-600 text-stone-800 tabular-nums">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function EnrollmentFunnelChart() {
  return (
    <div className="card-base p-6 h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="section-label mb-1">Enrollment Funnel</p>
          <p className="font-serif text-lg text-stone-900">6-Month Program Enrollment Trend</p>
        </div>
        <div className="flex items-center gap-4 mt-1">
          {[
            { label: 'Awareness', color: 'bg-amber-300' },
            { label: 'Foundation', color: 'bg-amber-600' },
            { label: 'Mastery', color: 'bg-stone-700' },
          ].map((leg) => (
            <div key={`legend-${leg.label.toLowerCase()}`} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${leg.color}`} />
              <span className="text-xs font-sans text-stone-500">{leg.label}</span>
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={enrollmentTrend} barGap={2} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(35 20% 88%)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: 'hsl(35 10% 50%)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fontFamily: 'DM Sans', fill: 'hsl(35 10% 50%)' }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(35 15% 94%)' }} />
          <Bar dataKey="awareness" fill="hsl(43 70% 72%)" radius={[2, 2, 0, 0]} />
          <Bar dataKey="foundation" fill="hsl(38 47% 55%)" radius={[2, 2, 0, 0]} />
          <Bar dataKey="mastery" fill="hsl(60 3% 25%)" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Conversion note */}
      <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-6">
        <div>
          <p className="text-xs font-sans text-stone-400">Awareness → Foundation</p>
          <p className="text-sm font-sans font-600 text-red-600 tabular-nums">41% <span className="text-xs font-400 text-red-400">↓ 3%</span></p>
        </div>
        <div>
          <p className="text-xs font-sans text-stone-400">Foundation → Mastery</p>
          <p className="text-sm font-sans font-600 text-green-600 tabular-nums">17% <span className="text-xs font-400 text-green-400">↑ 2%</span></p>
        </div>
        <div className="ml-auto">
          <span className="status-badge bg-red-50 text-red-700 text-xs">Awareness conversion needs review</span>
        </div>
      </div>
    </div>
  );
}