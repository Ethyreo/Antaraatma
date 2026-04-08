'use client';
import React, { useEffect, useState } from 'react';
import { ChevronRight, Plus, Edit2, Eye, Trash2, GripVertical, Video, FileText, ToggleRight, ToggleLeft } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface LessonRow {
  id: string;
  title: string;
  duration: string | null;
  status: string;
  sort_order: number;
  video_url: string | null;
}

interface ModuleRow {
  id: string;
  title: string;
  sort_order: number;
  status: string;
  lessons: LessonRow[];
}

interface Props {
  programId: string;
}

const statusBadge: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-stone-100 text-stone-600',
  archived: 'bg-red-100 text-red-600',
};

export default function ModuleTree({ programId }: Props) {
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [programTitle, setProgramTitle] = useState('Program');
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [lessonStatuses, setLessonStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!programId) return;
    const supabase = createClient();

    async function fetchModules() {
      setLoading(true);
      try {
        // Get program title
        const { data: prog } = await supabase
          .from('programs')
          .select('title')
          .eq('id', programId)
          .maybeSingle();
        if (prog) setProgramTitle(prog.title);

        // Get modules
        const { data: mods } = await supabase
          .from('modules')
          .select('id, title, sort_order, status')
          .eq('program_id', programId)
          .order('sort_order', { ascending: true });

        if (!mods) { setLoading(false); return; }

        // Get lessons for all modules
        const { data: allLessons } = await supabase
          .from('lessons')
          .select('id, title, duration, status, sort_order, video_url, module_id')
          .eq('program_id', programId)
          .order('sort_order', { ascending: true });

        const lessonsByModule: Record<string, LessonRow[]> = {};
        (allLessons ?? []).forEach((l: any) => {
          if (!lessonsByModule[l.module_id]) lessonsByModule[l.module_id] = [];
          lessonsByModule[l.module_id].push(l);
        });

        const enriched: ModuleRow[] = mods.map((m) => ({
          ...m,
          lessons: lessonsByModule[m.id] ?? [],
        }));

        setModules(enriched);

        // Build lesson status map
        const statusMap: Record<string, string> = {};
        (allLessons ?? []).forEach((l: any) => { statusMap[l.id] = l.status; });
        setLessonStatuses(statusMap);

        // Auto-expand first module
        if (enriched.length > 0) {
          setExpandedModules(new Set([enriched[0].id]));
        }
      } catch (err) {
        console.error('ModuleTree fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchModules();
  }, [programId]);

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleLessonStatus = async (id: string, title: string) => {
    const supabase = createClient();
    const next = lessonStatuses[id] === 'published' ? 'draft' : 'published';
    try {
      const { error } = await supabase.from('lessons').update({ status: next }).eq('id', id);
      if (error) throw error;
      setLessonStatuses((prev) => ({ ...prev, [id]: next }));
      toast.success(`"${title}" set to ${next}`);
    } catch {
      toast.error('Failed to update lesson status');
    }
  };

  if (loading) {
    return (
      <div className="card-base overflow-hidden">
        <div className="p-5 border-b border-stone-100 animate-pulse">
          <div className="h-4 bg-stone-200 rounded w-1/3 mb-2" />
          <div className="h-3 bg-stone-100 rounded w-1/4" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-5 py-4 border-b border-stone-100 animate-pulse">
            <div className="h-4 bg-stone-200 rounded flex-1" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card-base overflow-hidden">
      <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-amber-50/30">
        <div>
          <p className="section-label mb-0.5">Module & Lesson Tree</p>
          <p className="font-serif text-base text-stone-900">{programTitle}</p>
          <p className="text-xs font-sans text-stone-500 mt-0.5">{modules.length} modules · Click to expand lessons</p>
        </div>
        <button
          className="flex items-center gap-1.5 bg-amber-800 text-amber-50 text-xs font-sans font-500 px-3 py-1.5 rounded-sm hover:bg-amber-900 transition-all active:scale-95"
          onClick={() => toast.success('Opening new module form...')}
        >
          <Plus size={12} />
          Add Module
        </button>
      </div>

      {modules.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm font-sans text-stone-400">No modules yet for this program.</p>
        </div>
      ) : (
        <div className="divide-y divide-stone-100">
          {modules.map((mod) => {
            const isExpanded = expandedModules.has(mod.id);
            return (
              <div key={mod.id}>
                <div
                  className={`flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors group ${isExpanded ? 'bg-amber-50/40' : 'hover:bg-stone-50'}`}
                  onClick={() => toggleModule(mod.id)}
                >
                  <GripVertical size={14} className="text-stone-300 cursor-grab shrink-0" />
                  <ChevronRight size={14} className={`text-amber-600 transition-transform shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-sans font-600 text-stone-400 tabular-nums w-5">
                      {String(mod.sort_order).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-sans font-500 text-stone-800">{mod.title}</p>
                    <p className="text-xs font-sans text-stone-400 mt-0.5">{mod.lessons.length} lessons</p>
                  </div>
                  <span className={`status-badge ${statusBadge[mod.status] ?? 'bg-stone-100 text-stone-600'} shrink-0`}>
                    {mod.status}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="p-1.5 text-stone-400 hover:text-amber-700 hover:bg-amber-50 rounded-sm transition-colors"
                      title={`Edit ${mod.title}`}
                      onClick={() => toast.success(`Editing module: ${mod.title}`)}
                    >
                      <Edit2 size={12} />
                    </button>
                    <button className="p-1.5 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition-colors" title={`Preview ${mod.title}`}>
                      <Eye size={12} />
                    </button>
                    <button
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                      title={`Delete ${mod.title}`}
                      onClick={() => toast.error(`Delete module: ${mod.title}?`)}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="bg-stone-50/60 border-t border-stone-100">
                    {mod.lessons.length === 0 ? (
                      <div className="px-16 py-6 text-center">
                        <p className="text-xs font-sans text-stone-400">No lessons yet in this module.</p>
                        <button
                          className="mt-2 text-xs font-sans font-500 text-amber-700 hover:text-amber-800"
                          onClick={() => toast.success(`Adding lesson to ${mod.title}`)}
                        >
                          + Add first lesson
                        </button>
                      </div>
                    ) : (
                      <div className="divide-y divide-stone-100/80">
                        {mod.lessons.map((lesson) => {
                          const isVideo = !!lesson.video_url;
                          const LessonIcon = isVideo ? Video : FileText;
                          const iconColor = isVideo ? 'text-blue-500 bg-blue-50' : 'text-amber-600 bg-amber-50';
                          const currentStatus = lessonStatuses[lesson.id] ?? lesson.status;
                          const [ic, bg] = iconColor.split(' ');
                          return (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-3 pl-16 pr-5 py-3 hover:bg-stone-100/60 transition-colors group"
                            >
                              <GripVertical size={12} className="text-stone-200 cursor-grab shrink-0" />
                              <span className="text-xs font-sans text-stone-400 tabular-nums w-4 shrink-0">
                                {String(lesson.sort_order).padStart(2, '0')}
                              </span>
                              <div className={`w-6 h-6 rounded-sm flex items-center justify-center shrink-0 ${bg}`}>
                                <LessonIcon size={11} className={ic} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-sans font-500 text-stone-700 truncate">{lesson.title}</p>
                                {lesson.duration && <p className="text-2xs font-sans text-stone-400">{lesson.duration}</p>}
                              </div>
                              <span className={`status-badge text-2xs ${statusBadge[currentStatus] ?? 'bg-stone-100 text-stone-600'}`}>
                                {currentStatus}
                              </span>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => toggleLessonStatus(lesson.id, lesson.title)}
                                  className="p-1 text-stone-400 hover:text-amber-700 hover:bg-amber-50 rounded-sm transition-colors"
                                  title="Toggle status"
                                >
                                  {currentStatus === 'published' ? <ToggleRight size={13} className="text-green-600" /> : <ToggleLeft size={13} />}
                                </button>
                                <button
                                  className="p-1 text-stone-400 hover:text-amber-700 hover:bg-amber-50 rounded-sm transition-colors"
                                  title={`Edit ${lesson.title}`}
                                  onClick={() => toast.success(`Editing: ${lesson.title}`)}
                                >
                                  <Edit2 size={11} />
                                </button>
                                <button
                                  className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                                  title={`Delete ${lesson.title}`}
                                  onClick={() => toast.error(`Delete lesson: ${lesson.title}?`)}
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        <div className="pl-16 pr-5 py-3">
                          <button
                            className="text-xs font-sans font-500 text-amber-700 hover:text-amber-800 flex items-center gap-1"
                            onClick={() => toast.success(`Adding lesson to ${mod.title}`)}
                          >
                            <Plus size={11} />
                            Add lesson
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}