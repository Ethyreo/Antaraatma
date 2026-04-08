'use client';
import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { mockResources } from '@/lib/data/mockData';
import type { Resource } from '@/lib/data/types';
import { Search, Edit2, Trash2, BookOpen, FileText, Headphones, Video, FileCheck } from 'lucide-react';

const typeIcons: Record<string, React.ReactNode> = {
  ebook: <BookOpen size={13} />,
  pdf: <FileText size={13} />,
  audio: <Headphones size={13} />,
  video: <Video size={13} />,
  guide: <FileCheck size={13} />,
  worksheet: <FileCheck size={13} />,
};

const typeColors: Record<string, string> = {
  ebook: 'bg-blue-50 text-blue-700 border-blue-200',
  pdf: 'bg-red-50 text-red-700 border-red-200',
  audio: 'bg-purple-50 text-purple-700 border-purple-200',
  video: 'bg-pink-50 text-pink-700 border-pink-200',
  guide: 'bg-green-50 text-green-700 border-green-200',
  worksheet: 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function AdminResourcesPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [resources] = useState<Resource[]>(mockResources);

  const filtered = resources.filter(r => {
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || r.type === typeFilter;
    return matchSearch && matchType;
  });

  const allTypes = Array.from(new Set(resources.map(r => r.type)));

  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center justify-between">
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Admin</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Resources</p>
          </div>
          <span className="text-xs font-sans text-stone-400 bg-stone-100 border border-stone-200 rounded-sm px-2.5 py-1">
            {filtered.length} resource{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto space-y-6">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700 placeholder-stone-400"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTypeFilter(null)}
                className={`text-xs font-sans font-medium px-3 py-2 rounded-sm border transition-colors ${typeFilter === null ? 'bg-amber-800 text-amber-50 border-amber-800' : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300'}`}
              >
                All
              </button>
              {allTypes.map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`text-xs font-sans font-medium px-3 py-2 rounded-sm border transition-colors capitalize ${typeFilter === t ? 'bg-amber-800 text-amber-50 border-amber-800' : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white border border-stone-200/80 rounded-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  {['Title', 'Description', 'Type', 'Access', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-sans font-medium text-stone-400 uppercase tracking-widest px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-10 text-center text-sm font-sans text-stone-400">
                      No resources found.
                    </td>
                  </tr>
                ) : (
                  filtered.map(resource => (
                    <tr key={resource.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-sans font-medium text-stone-700 max-w-[200px]">
                        <span className="line-clamp-1">{resource.title}</span>
                      </td>
                      <td className="px-5 py-3.5 font-sans text-stone-500 text-xs max-w-[260px]">
                        <span className="line-clamp-2">{resource.description}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-sans font-medium px-2 py-0.5 rounded-full border capitalize ${typeColors[resource.type] || 'bg-stone-50 text-stone-600 border-stone-200'}`}>
                          {typeIcons[resource.type]}
                          {resource.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-sans text-stone-500 text-xs capitalize">{resource.accessLevel}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-sans font-medium px-2 py-0.5 rounded-full border capitalize ${resource.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-stone-50 text-stone-500 border-stone-200'}`}>
                          {resource.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button className="text-stone-400 hover:text-amber-700 transition-colors" title="Edit">
                            <Edit2 size={14} />
                          </button>
                          <button className="text-stone-400 hover:text-red-600 transition-colors" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
