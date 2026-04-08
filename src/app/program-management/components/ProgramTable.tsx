'use client';
import React, { useState } from 'react';
import { Edit2, Eye, Users, BookOpen, ToggleLeft, ToggleRight, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

// Backend integration point: fetch from /api/admin/programs
const programs = [
  {
    id: 'prog-awareness',
    title: 'Awareness Session',
    slug: 'awareness-session',
    status: 'published',
    price: 499,
    currency: '₹',
    modules: 1,
    lessons: 1,
    enrollments: 1842,
    completionRate: 98,
    lastUpdated: '28 Mar 2026',
    level: 'Entry',
    format: 'Live Online',
  },
  {
    id: 'prog-foundation',
    title: 'Foundation Course',
    slug: 'foundation-course',
    status: 'published',
    price: 12000,
    currency: '₹',
    modules: 8,
    lessons: 40,
    enrollments: 748,
    completionRate: 94,
    lastUpdated: '02 Apr 2026',
    level: 'Core',
    format: 'Self-paced + Live',
  },
  {
    id: 'prog-mastery',
    title: 'Transformation Mastery',
    slug: 'transformation-mastery',
    status: 'published',
    price: 48000,
    currency: '₹',
    modules: 24,
    lessons: 88,
    enrollments: 124,
    completionRate: 91,
    lastUpdated: '01 Apr 2026',
    level: 'Advanced',
    format: 'Mentored',
  },
];

interface Props {
  selectedProgramId: string | null;
  onSelectProgram: (id: string) => void;
}

export default function ProgramTable({ selectedProgramId, onSelectProgram }: Props) {
  const [statuses, setStatuses] = useState<Record<string, string>>(
    Object.fromEntries(programs.map((p) => [p.id, p.status]))
  );

  const toggleStatus = (id: string, title: string) => {
    setStatuses((prev) => {
      const next = prev[id] === 'published' ? 'draft' : 'published';
      toast.success(`"${title}" set to ${next}`);
      return { ...prev, [id]: next };
    });
  };

  const statusConfig: Record<string, string> = {
    published: 'bg-green-100 text-green-700',
    draft: 'bg-stone-100 text-stone-600',
    archived: 'bg-red-100 text-red-600',
  };

  return (
    <div className="card-base overflow-hidden">
      <div className="p-5 border-b border-stone-100 flex items-center justify-between">
        <div>
          <p className="section-label mb-0.5">Programs</p>
          <p className="text-xs font-sans text-stone-500">{programs.length} programs in pathway</p>
        </div>
        <p className="text-xs font-sans text-stone-400 italic">Click a program row to expand its modules below</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/50">
              {['Program', 'Status', 'Price', 'Modules', 'Lessons', 'Enrollments', 'Completion', 'Updated', 'Actions'].map((col) => (
                <th
                  key={`col-${col.toLowerCase().replace(/\s/g, '-')}`}
                  className="text-left px-5 py-3 text-2xs font-sans font-600 uppercase tracking-[0.08em] text-stone-500"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {programs.map((prog) => {
              const isSelected = selectedProgramId === prog.id;
              return (
                <tr
                  key={prog.id}
                  onClick={() => onSelectProgram(prog.id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-amber-50/60' : 'hover:bg-stone-50'
                  }`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <ChevronRight
                        size={14}
                        className={`text-amber-600 transition-transform ${isSelected ? 'rotate-90' : ''}`}
                      />
                      <div>
                        <p className="text-sm font-sans font-500 text-stone-800">{prog.title}</p>
                        <p className="text-2xs font-sans text-stone-400">{prog.level} · {prog.format}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`status-badge ${statusConfig[statuses[prog.id]] ?? 'bg-stone-100 text-stone-600'}`}>
                      {statuses[prog.id]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-sans font-500 text-stone-800 tabular-nums">
                      {prog.currency}{prog.price.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <BookOpen size={12} className="text-stone-400" />
                      <span className="text-sm font-sans text-stone-700 tabular-nums">{prog.modules}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-sans text-stone-700 tabular-nums">{prog.lessons}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Users size={12} className="text-stone-400" />
                      <span className="text-sm font-sans text-stone-700 tabular-nums">{prog.enrollments.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-stone-100 rounded-full h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded-full"
                          style={{ width: `${prog.completionRate}%` }}
                        />
                      </div>
                      <span className="text-xs font-sans text-stone-600 tabular-nums">{prog.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-sans text-stone-500">{prog.lastUpdated}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleStatus(prog.id, prog.title)}
                        className="p-1.5 text-stone-400 hover:text-amber-700 hover:bg-amber-50 rounded-sm transition-colors"
                        title={`Toggle ${prog.title} status`}
                      >
                        {statuses[prog.id] === 'published' ? <ToggleRight size={15} className="text-green-600" /> : <ToggleLeft size={15} />}
                      </button>
                      <button
                        className="p-1.5 text-stone-400 hover:text-amber-700 hover:bg-amber-50 rounded-sm transition-colors"
                        title={`Edit ${prog.title}`}
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        className="p-1.5 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                        title={`Preview ${prog.title}`}
                      >
                        <Eye size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}