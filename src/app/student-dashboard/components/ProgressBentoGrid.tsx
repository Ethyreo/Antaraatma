'use client';
import React from 'react';
import { TrendingUp, Clock, Award, Flame } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

// Backend integration point: fetch from /api/student/progress?studentId=current
const progressData = [
  { name: 'Overall', value: 62, fill: 'hsl(38 47% 55%)' },
];

function ProgressRing({ value }: { value: number }) {
  return (
    <ResponsiveContainer width={80} height={80}>
      <RadialBarChart
        cx="50%" cy="50%"
        innerRadius="70%" outerRadius="100%"
        startAngle={90} endAngle={-270}
        data={progressData}
        barSize={6}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
        <RadialBar
          background={{ fill: 'hsl(35 15% 90%)' }}
          dataKey="value"
          angleAxisId={0}
          cornerRadius={3}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

// Grid plan: 5 cards → row 1: hero spans 2 cols + 2 regular → row 2: 1 card spans full or 2 cols
// grid-cols-4: hero (2 cols) + 2 regular + 1 card spans 2 cols in row 2 with 2 regular
// Actually: 5 cards → 2+2 row1, 1 hero-wide row2 → use 4 col grid
// Plan: hero (col-span-2) + stat1 + stat2 = row1 (4 cols)
//       stat3 + stat4 + wide-card (col-span-2) = row2 (4 cols) — but we have 5 cards total
// Revised: 4 stat cards + 1 progress card
// Row 1: progress-hero (col-span-2) + streak + next-session = 4 cols
// Row 2: lessons-done (col-span-2) + certificate-progress (col-span-2) = 4 cols
// Total: 5 cards ✓ no orphans

export default function ProgressBentoGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 xl:gap-5">
      {/* Hero: Overall Progress — col-span-2 */}
      <div className="col-span-2 card-base p-6 flex items-center gap-6">
        <div className="relative shrink-0">
          <ProgressRing value={62} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-lg text-stone-900 tabular-nums">62%</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="section-label mb-1">Foundation Course Progress</p>
          <p className="font-serif text-2xl text-stone-900 mb-1">Module 5 of 8</p>
          <p className="text-xs font-sans text-stone-500 mb-3">Nutrition & Detoxification</p>
          <div className="w-full bg-stone-100 rounded-full h-1.5">
            <div className="bg-amber-600 h-1.5 rounded-full transition-all duration-700" style={{ width: '62%' }} />
          </div>
          <p className="text-xs font-sans text-stone-400 mt-1.5">24 of 40 lessons completed</p>
        </div>
      </div>

      {/* Streak */}
      <div className="card-base p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="section-label">Learning Streak</p>
          <Flame size={15} className="text-orange-500" />
        </div>
        <p className="font-serif text-3xl text-stone-900 tabular-nums">14</p>
        <p className="text-xs font-sans text-stone-500">consecutive days</p>
        <div className="flex gap-1 mt-auto">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={`streak-day-${i + 1}`}
              className={`flex-1 h-1.5 rounded-full ${i < 6 ? 'bg-orange-400' : 'bg-stone-200'}`}
            />
          ))}
        </div>
      </div>

      {/* Next session */}
      <div className="card-base p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="section-label">Next Live Session</p>
          <Clock size={15} className="text-amber-600" />
        </div>
        <p className="font-serif text-base text-stone-900 leading-snug">Module 5 Q&A with Dr. Vijay</p>
        <p className="text-xs font-sans font-500 text-amber-700 mt-auto">08 Apr 2026 · 7:00 PM IST</p>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-sans text-stone-500">3 days away</span>
        </div>
      </div>

      {/* Lessons completed */}
      <div className="col-span-2 card-base p-5 flex items-center gap-5">
        <div className="w-10 h-10 rounded-sm bg-amber-50 flex items-center justify-center shrink-0">
          <TrendingUp size={18} className="text-amber-700" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="section-label mb-1">Lessons Completed This Week</p>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-2xl text-stone-900 tabular-nums">6</span>
            <span className="text-xs font-sans text-green-600 font-500">↑ 2 vs last week</span>
          </div>
        </div>
        {/* Mini bar chart */}
        <div className="hidden sm:flex items-end gap-1 h-10">
          {[3, 5, 4, 6, 4, 5, 6].map((v, i) => (
            <div
              key={`lesson-bar-day-${i + 1}`}
              className="w-3 rounded-sm bg-amber-200"
              style={{ height: `${(v / 7) * 100}%` }}
            />
          ))}
        </div>
      </div>

      {/* Certificate progress */}
      <div className="col-span-2 card-base p-5 flex items-center gap-5">
        <div className="w-10 h-10 rounded-sm bg-stone-50 flex items-center justify-center shrink-0">
          <Award size={18} className="text-stone-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="section-label mb-1">Foundation Certificate</p>
          <p className="text-sm font-sans font-500 text-stone-700">38% toward completion</p>
          <p className="text-xs font-sans text-stone-400 mt-0.5">Complete all 8 modules + final assessment</p>
        </div>
        <div className="text-right shrink-0">
          <span className="status-badge bg-stone-100 text-stone-600">In Progress</span>
        </div>
      </div>
    </div>
  );
}