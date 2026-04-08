'use client';
import React, { useState } from 'react';
import { ChevronRight, Plus, Edit2, Eye, Trash2, GripVertical, Video, FileText, ToggleRight, ToggleLeft } from 'lucide-react';
import { toast } from 'sonner';

// Backend integration point: fetch from /api/admin/programs/:programId/modules
const moduleData: Record<string, {
  id: string;
  title: string;
  order: number;
  status: string;
  lessonsCount: number;
  duration: string;
  lessons: { id: string; title: string; type: string; duration: string; status: string; order: number }[];
}[]> = {
  'prog-foundation': [
    {
      id: 'mod-f1', title: 'Introduction to Naturopathy', order: 1, status: 'published', lessonsCount: 4, duration: '62 min',
      lessons: [
        { id: 'les-f1-1', title: 'What is Naturopathy?', type: 'video', duration: '14 min', status: 'published', order: 1 },
        { id: 'les-f1-2', title: 'The Six Principles of Naturopathic Medicine', type: 'video', duration: '18 min', status: 'published', order: 2 },
        { id: 'les-f1-3', title: 'Understanding Your Body Constitution', type: 'video', duration: '16 min', status: 'published', order: 3 },
        { id: 'les-f1-4', title: 'Module 1 Assessment', type: 'resource', duration: '14 min', status: 'published', order: 4 },
      ],
    },
    {
      id: 'mod-f2', title: 'Gut Health & Microbiome', order: 2, status: 'published', lessonsCount: 5, duration: '88 min',
      lessons: [
        { id: 'les-f2-1', title: 'The Gut as Your Second Brain', type: 'video', duration: '21 min', status: 'published', order: 1 },
        { id: 'les-f2-2', title: 'Mapping Your Microbiome', type: 'video', duration: '19 min', status: 'published', order: 2 },
        { id: 'les-f2-3', title: 'Foods That Heal the Gut Lining', type: 'video', duration: '22 min', status: 'published', order: 3 },
        { id: 'les-f2-4', title: 'Gut Healing 30-Day Protocol', type: 'resource', duration: '15 min', status: 'published', order: 4 },
        { id: 'les-f2-5', title: 'Module 2 Assessment', type: 'resource', duration: '11 min', status: 'published', order: 5 },
      ],
    },
    {
      id: 'mod-f3', title: 'Sleep & Circadian Healing', order: 3, status: 'published', lessonsCount: 4, duration: '72 min',
      lessons: [
        { id: 'les-f3-1', title: 'The Healing Window: 10pm–2am', type: 'video', duration: '17 min', status: 'published', order: 1 },
        { id: 'les-f3-2', title: 'Cortisol, Melatonin, and Sleep Architecture', type: 'video', duration: '24 min', status: 'published', order: 2 },
        { id: 'les-f3-3', title: 'Sleep Optimisation Protocol', type: 'resource', duration: '18 min', status: 'published', order: 3 },
        { id: 'les-f3-4', title: 'Module 3 Assessment', type: 'resource', duration: '13 min', status: 'published', order: 4 },
      ],
    },
    {
      id: 'mod-f4', title: 'Movement as Medicine', order: 4, status: 'published', lessonsCount: 4, duration: '68 min',
      lessons: [
        { id: 'les-f4-1', title: 'Why Conventional Exercise Often Harms', type: 'video', duration: '16 min', status: 'published', order: 1 },
        { id: 'les-f4-2', title: 'Lymphatic Movement Practices', type: 'video', duration: '20 min', status: 'published', order: 2 },
        { id: 'les-f4-3', title: 'Morning Movement Sequence (Video Practice)', type: 'video', duration: '22 min', status: 'published', order: 3 },
        { id: 'les-f4-4', title: 'Module 4 Assessment', type: 'resource', duration: '10 min', status: 'published', order: 4 },
      ],
    },
    {
      id: 'mod-f5', title: 'Nutrition & Detoxification', order: 5, status: 'published', lessonsCount: 6, duration: '140 min',
      lessons: [
        { id: 'les-f5-1', title: 'The Liver as Your Master Detoxifier', type: 'video', duration: '18 min', status: 'published', order: 1 },
        { id: 'les-f5-2', title: 'Nutritional Foundations of Cellular Cleansing', type: 'video', duration: '22 min', status: 'published', order: 2 },
        { id: 'les-f5-3', title: 'Foods That Burden vs. Foods That Heal', type: 'video', duration: '26 min', status: 'published', order: 3 },
        { id: 'les-f5-4', title: 'The 7-Day Gentle Detox Protocol', type: 'video', duration: '31 min', status: 'published', order: 4 },
        { id: 'les-f5-5', title: 'Understanding Herxheimer Reactions', type: 'video', duration: '19 min', status: 'draft', order: 5 },
        { id: 'les-f5-6', title: 'Sustaining Detox Beyond the Program', type: 'video', duration: '24 min', status: 'draft', order: 6 },
      ],
    },
    {
      id: 'mod-f6', title: 'Mental Clarity & Emotional Healing', order: 6, status: 'draft', lessonsCount: 5, duration: '0 min',
      lessons: [],
    },
    {
      id: 'mod-f7', title: 'Hormonal Balance', order: 7, status: 'draft', lessonsCount: 5, duration: '0 min',
      lessons: [],
    },
    {
      id: 'mod-f8', title: 'Final Integration & Certification', order: 8, status: 'draft', lessonsCount: 3, duration: '0 min',
      lessons: [],
    },
  ],
  'prog-awareness': [
    {
      id: 'mod-a1', title: 'Awareness Session — Live Program', order: 1, status: 'published', lessonsCount: 1, duration: '90 min',
      lessons: [
        { id: 'les-a1-1', title: 'Live Awareness Session with Dr. Vijay', type: 'video', duration: '90 min', status: 'published', order: 1 },
      ],
    },
  ],
  'prog-mastery': [
    {
      id: 'mod-m1', title: 'Mastery Foundation & Orientation', order: 1, status: 'published', lessonsCount: 4, duration: '80 min',
      lessons: [
        { id: 'les-m1-1', title: 'The Mastery Pathway Overview', type: 'video', duration: '22 min', status: 'published', order: 1 },
        { id: 'les-m1-2', title: 'Your Personal Healing Assessment', type: 'resource', duration: '30 min', status: 'published', order: 2 },
        { id: 'les-m1-3', title: '1:1 Intake Consultation', type: 'video', duration: '16 min', status: 'published', order: 3 },
        { id: 'les-m1-4', title: 'Setting Your Healing Intentions', type: 'resource', duration: '12 min', status: 'published', order: 4 },
      ],
    },
  ],
};

const lessonTypeConfig = {
  video: { icon: Video, color: 'text-blue-500 bg-blue-50' },
  resource: { icon: FileText, color: 'text-amber-600 bg-amber-50' },
};

const statusBadge: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-stone-100 text-stone-600',
};

interface Props {
  programId: string;
}

export default function ModuleTree({ programId }: Props) {
  const modules = moduleData[programId] ?? [];
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['mod-f5']));
  const [lessonStatuses, setLessonStatuses] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    modules.forEach((m) => m.lessons.forEach((l) => { map[l.id] = l.status; }));
    return map;
  });

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleLessonStatus = (id: string, title: string) => {
    setLessonStatuses((prev) => {
      const next = prev[id] === 'published' ? 'draft' : 'published';
      toast.success(`"${title}" set to ${next}`);
      return { ...prev, [id]: next };
    });
  };

  const programTitle = {
    'prog-foundation': 'Foundation Course',
    'prog-awareness': 'Awareness Session',
    'prog-mastery': 'Transformation Mastery',
  }[programId] ?? 'Program';

  return (
    <div className="card-base overflow-hidden">
      {/* Header */}
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

      {/* Module list */}
      <div className="divide-y divide-stone-100">
        {modules.map((mod) => {
          const isExpanded = expandedModules.has(mod.id);
          return (
            <div key={mod.id}>
              {/* Module row */}
              <div
                className={`flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors group ${
                  isExpanded ? 'bg-amber-50/40' : 'hover:bg-stone-50'
                }`}
                onClick={() => toggleModule(mod.id)}
              >
                <GripVertical size={14} className="text-stone-300 cursor-grab shrink-0" />
                <ChevronRight
                  size={14}
                  className={`text-amber-600 transition-transform shrink-0 ${isExpanded ? 'rotate-90' : ''}`}
                />
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-sans font-600 text-stone-400 tabular-nums w-5">
                    {String(mod.order).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-sans font-500 text-stone-800">{mod.title}</p>
                  <p className="text-xs font-sans text-stone-400 mt-0.5">
                    {mod.lessonsCount} lessons
                    {mod.duration !== '0 min' && ` · ${mod.duration}`}
                  </p>
                </div>
                <span className={`status-badge ${statusBadge[mod.status] ?? 'bg-stone-100 text-stone-600'} shrink-0`}>
                  {mod.status}
                </span>
                <div
                  className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="p-1.5 text-stone-400 hover:text-amber-700 hover:bg-amber-50 rounded-sm transition-colors"
                    title={`Edit ${mod.title}`}
                    onClick={() => toast.success(`Editing module: ${mod.title}`)}
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    className="p-1.5 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                    title={`Preview ${mod.title}`}
                  >
                    <Eye size={12} />
                  </button>
                  <button
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                    title={`Delete ${mod.title} — this cannot be undone`}
                    onClick={() => toast.error(`Delete module: ${mod.title}?`)}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Lessons sub-list */}
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
                    <>
                      <div className="divide-y divide-stone-100/80">
                        {mod.lessons.map((lesson) => {
                          const typeConf = lessonTypeConfig[lesson.type as keyof typeof lessonTypeConfig] ?? lessonTypeConfig.video;
                          const LessonIcon = typeConf.icon;
                          const currentStatus = lessonStatuses[lesson.id] ?? lesson.status;
                          return (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-3 pl-16 pr-5 py-3 hover:bg-stone-100/60 transition-colors group"
                            >
                              <GripVertical size={12} className="text-stone-200 cursor-grab shrink-0" />
                              <span className="text-xs font-sans text-stone-400 tabular-nums w-4 shrink-0">
                                {String(lesson.order).padStart(2, '0')}
                              </span>
                              <div className={`w-6 h-6 rounded-sm flex items-center justify-center shrink-0 ${typeConf.color.split(' ')[1]}`}>
                                <LessonIcon size={11} className={typeConf.color.split(' ')[0]} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-sans font-500 text-stone-700 truncate">{lesson.title}</p>
                                <p className="text-2xs font-sans text-stone-400">{lesson.type} · {lesson.duration}</p>
                              </div>
                              <span className={`status-badge text-2xs ${statusBadge[currentStatus] ?? 'bg-stone-100 text-stone-600'}`}>
                                {currentStatus}
                              </span>
                              <div
                                className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <button
                                  onClick={() => toggleLessonStatus(lesson.id, lesson.title)}
                                  className="p-1 text-stone-400 hover:text-amber-700 rounded-sm transition-colors"
                                  title={`Toggle ${lesson.title} status`}
                                >
                                  {currentStatus === 'published'
                                    ? <ToggleRight size={14} className="text-green-600" />
                                    : <ToggleLeft size={14} />}
                                </button>
                                <button
                                  className="p-1 text-stone-400 hover:text-amber-700 rounded-sm transition-colors"
                                  title={`Edit ${lesson.title}`}
                                  onClick={() => toast.success(`Editing: ${lesson.title}`)}
                                >
                                  <Edit2 size={11} />
                                </button>
                                <button
                                  className="p-1 text-stone-400 hover:text-red-600 rounded-sm transition-colors"
                                  title={`Delete ${lesson.title} — this cannot be undone`}
                                  onClick={() => toast.error(`Delete: ${lesson.title}?`)}
                                >
                                  <Trash2 size={11} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="pl-16 pr-5 py-3 border-t border-stone-100/80">
                        <button
                          className="flex items-center gap-1.5 text-xs font-sans font-500 text-amber-700 hover:text-amber-800 transition-colors"
                          onClick={() => toast.success(`Adding lesson to ${mod.title}`)}
                        >
                          <Plus size={11} />
                          Add lesson to {mod.title}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-stone-100 bg-stone-50/30">
        <button
          className="flex items-center gap-1.5 text-xs font-sans font-500 text-amber-700 hover:text-amber-800 transition-colors"
          onClick={() => toast.success('Opening new module form...')}
        >
          <Plus size={11} />
          Add another module to {programTitle}
        </button>
      </div>
    </div>
  );
}