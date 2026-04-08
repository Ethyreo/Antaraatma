'use client';
import React, { useEffect, useState } from 'react';
import { Edit2, Eye, Users, BookOpen, ToggleLeft, ToggleRight, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface ProgramRow {
  id: string;
  title: string;
  slug: string;
  status: string;
  price: number;
  updated_at: string;
  enrollmentCount?: number;
  moduleCount?: number;
  lessonCount?: number;
}

interface Props {
  selectedProgramId: string | null;
  onSelectProgram: (id: string) => void;
}

const statusConfig: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-stone-100 text-stone-600',
  archived: 'bg-red-100 text-red-600',
};

export default function ProgramTable({ selectedProgramId, onSelectProgram }: Props) {
  const [programs, setPrograms] = useState<ProgramRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    const supabase = createClient();

    async function fetchPrograms() {
      try {
        const { data: progs } = await supabase
          .from('programs')
          .select('id, title, slug, status, price, updated_at')
          .order('sort_order', { ascending: true });

        if (!progs) { setLoading(false); return; }

        // Fetch enrollment, module, lesson counts in parallel
        const enriched = await Promise.all(
          progs.map(async (prog) => {
            const [
              { count: enrollmentCount },
              { count: moduleCount },
              { count: lessonCount },
            ] = await Promise.all([
              supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('program_id', prog.id),
              supabase.from('modules').select('*', { count: 'exact', head: true }).eq('program_id', prog.id),
              supabase.from('lessons').select('*', { count: 'exact', head: true }).eq('program_id', prog.id),
            ]);
            return {
              ...prog,
              enrollmentCount: enrollmentCount ?? 0,
              moduleCount: moduleCount ?? 0,
              lessonCount: lessonCount ?? 0,
            };
          })
        );

        setPrograms(enriched);
        setStatuses(Object.fromEntries(enriched.map((p) => [p.id, p.status])));
      } catch (err) {
        console.error('ProgramTable fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPrograms();
  }, []);

  const toggleStatus = async (id: string, title: string) => {
    const supabase = createClient();
    const next = statuses[id] === 'published' ? 'draft' : 'published';
    try {
      const { error } = await supabase
        .from('programs')
        .update({ status: next })
        .eq('id', id);
      if (error) throw error;
      setStatuses((prev) => ({ ...prev, [id]: next }));
      toast.success(`"${title}" set to ${next}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="card-base overflow-hidden">
        <div className="p-5 border-b border-stone-100">
          <div className="h-4 bg-stone-200 rounded w-1/4 animate-pulse" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-stone-100 animate-pulse">
            <div className="h-4 bg-stone-200 rounded flex-1" />
            <div className="h-4 bg-stone-100 rounded w-16" />
            <div className="h-4 bg-stone-100 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card-base overflow-hidden">
      <div className="p-5 border-b border-stone-100 flex items-center justify-between">
        <div>
          <p className="section-label mb-0.5">Programs</p>
          <p className="text-xs font-sans text-stone-500">{programs.length} programs in pathway</p>
        </div>
        <p className="text-xs font-sans text-stone-400 italic">Click a program row to expand its modules below</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/50">
              {['Program', 'Status', 'Price', 'Modules', 'Lessons', 'Enrollments', 'Updated', 'Actions'].map((col) => (
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
                  className={`cursor-pointer transition-colors ${isSelected ? 'bg-amber-50/60' : 'hover:bg-stone-50'}`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <ChevronRight size={14} className={`text-amber-600 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                      <div>
                        <p className="text-sm font-sans font-500 text-stone-800">{prog.title}</p>
                        <p className="text-2xs font-sans text-stone-400">{prog.slug}</p>
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
                      ₹{Number(prog.price).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <BookOpen size={12} className="text-stone-400" />
                      <span className="text-sm font-sans text-stone-700 tabular-nums">{prog.moduleCount}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-sans text-stone-700 tabular-nums">{prog.lessonCount}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Users size={12} className="text-stone-400" />
                      <span className="text-sm font-sans text-stone-700 tabular-nums">{prog.enrollmentCount?.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-sans text-stone-500">
                      {new Date(prog.updated_at).toLocaleDateString('en-IN')}
                    </span>
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
                        onClick={() => toast.info(`Edit ${prog.title}`)}
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