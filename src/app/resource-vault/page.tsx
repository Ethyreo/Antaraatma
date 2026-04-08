'use client';
import React, { useState, useMemo } from 'react';
import StudentSidebar from '@/components/StudentSidebar';
import { mockResources, mockPrograms, getAccessibleResources } from '@/lib/data/mockData';
import { Search, Download, Lock, BookOpen, Headphones, Video, FileText } from 'lucide-react';
import type { ResourceType } from '@/lib/data/types';

const CURRENT_USER_ID = 'user-student-1';

const typeIcons: Record<ResourceType, React.ReactNode> = {
  ebook: <BookOpen size={16} />,
  pdf: <FileText size={16} />,
  audio: <Headphones size={16} />,
  video: <Video size={16} />,
  guide: <FileText size={16} />,
  worksheet: <FileText size={16} />,
};

export default function ResourceVaultPage() {
  const accessible = getAccessibleResources(CURRENT_USER_ID);
  const accessibleIds = new Set(accessible.map(r => r.id));
  const allPublished = mockResources.filter(r => r.status === 'published');
  const locked = allPublished.filter(r => !accessibleIds.has(r.id));
  const featured = accessible.filter(r => r.featured);

  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<string | null>(null);
  const [activeProgram, setActiveProgram] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return accessible.filter(r => {
      const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase());
      const matchType = !activeType || r.type === activeType;
      const matchProgram = !activeProgram || r.programId === activeProgram;
      return matchSearch && matchType && matchProgram;
    });
  }, [accessible, search, activeType, activeProgram]);

  const types: ResourceType[] = ['ebook', 'pdf', 'audio', 'video', 'guide', 'worksheet'];
  const programs = mockPrograms.filter(p => p.status === 'published');

  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <StudentSidebar />
      <div className="flex-1 min-w-0">
        {/* Topbar */}
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center">
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Learning</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Resource Vault</p>
          </div>
        </div>

        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto space-y-8">
          {/* Intro */}
          <div className="max-w-2xl">
            <h1 className="font-serif text-display-md text-stone-900 mb-4">Your healing library.</h1>
            <p className="text-base font-sans font-light text-stone-500 leading-relaxed">
              All resources unlocked by your enrollments — ebooks, audio guides, worksheets, and video content — curated for each stage of your journey.
            </p>
          </div>

          {/* Featured Resources */}
          {featured.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-px bg-amber-700/40" />
                <h2 className="font-serif text-xl text-stone-800">Featured Resources</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featured.map(res => (
                  <div key={res.id} className="bg-white border border-amber-200/60 rounded-sm p-6 group hover:shadow-card-hover transition-all duration-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-sm bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                        {typeIcons[res.type]}
                      </div>
                      <span className="text-2xs font-sans font-medium text-amber-700 uppercase tracking-widest capitalize">{res.type}</span>
                    </div>
                    <h3 className="font-serif text-base text-stone-800 mb-2">{res.title}</h3>
                    <p className="text-xs font-sans font-light text-stone-500 leading-relaxed mb-5">{res.description}</p>
                    <button className="inline-flex items-center gap-2 text-xs font-sans font-medium text-amber-800 hover:text-amber-900 transition-colors">
                      <Download size={13} />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search & Filters */}
          <div className="space-y-3">
            <div className="relative max-w-md">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-base pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setActiveType(null)} className={`text-xs font-sans font-medium px-3 py-1.5 rounded-sm border transition-colors ${!activeType ? 'bg-amber-800 text-amber-50 border-amber-800' : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300'}`}>All Types</button>
              {types.map(t => (
                <button key={t} onClick={() => setActiveType(activeType === t ? null : t)} className={`text-xs font-sans font-medium px-3 py-1.5 rounded-sm border transition-colors capitalize ${activeType === t ? 'bg-amber-800 text-amber-50 border-amber-800' : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300'}`}>{t}</button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setActiveProgram(null)} className={`text-xs font-sans font-medium px-3 py-1.5 rounded-sm border transition-colors ${!activeProgram ? 'bg-stone-800 text-stone-100 border-stone-800' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'}`}>All Programs</button>
              {programs.map(p => (
                <button key={p.id} onClick={() => setActiveProgram(activeProgram === p.id ? null : p.id)} className={`text-xs font-sans font-medium px-3 py-1.5 rounded-sm border transition-colors ${activeProgram === p.id ? 'bg-stone-800 text-stone-100 border-stone-800' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'}`}>{p.title}</button>
              ))}
            </div>
          </div>

          {/* All Accessible Resources */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-amber-700/40" />
              <h2 className="font-serif text-xl text-stone-800">Your Resources ({filtered.length})</h2>
            </div>
            {filtered.length === 0 ? (
              <p className="font-serif text-lg text-stone-400">No resources match your filters.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(res => (
                  <div key={res.id} className="flex items-start gap-4 bg-white border border-stone-200/80 rounded-sm p-5 hover:shadow-card transition-all duration-200">
                    <div className="w-10 h-10 rounded-sm bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-500 shrink-0">
                      {typeIcons[res.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-sans font-medium text-stone-800 mb-0.5">{res.title}</p>
                      <p className="text-xs font-sans font-light text-stone-500 leading-relaxed mb-3">{res.description}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-2xs font-sans text-stone-400 capitalize">{res.type}</span>
                        {res.programId && (
                          <>
                            <span className="text-stone-300">·</span>
                            <span className="text-2xs font-sans text-stone-400">{mockPrograms.find(p => p.id === res.programId)?.title}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button className="shrink-0 w-8 h-8 rounded-sm bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 hover:bg-amber-100 transition-colors">
                      <Download size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Locked Resources */}
          {locked.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-px bg-stone-300" />
                <h2 className="font-serif text-xl text-stone-400">Locked Resources ({locked.length})</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locked.map(res => (
                  <div key={res.id} className="flex items-start gap-4 bg-stone-50 border border-stone-200/60 rounded-sm p-5 opacity-60">
                    <div className="w-10 h-10 rounded-sm bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 shrink-0">
                      <Lock size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-sans font-medium text-stone-500 mb-0.5">{res.title}</p>
                      <p className="text-xs font-sans text-stone-400 capitalize">{res.type} · Requires {res.accessLevel} access</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
