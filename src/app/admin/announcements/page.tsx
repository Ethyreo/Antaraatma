'use client';
import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { mockAnnouncements } from '@/lib/data/mockData';
import type { Announcement } from '@/lib/data/types';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);

  const toggleStatus = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'published' ? 'unpublished' : 'published' } : a));
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center justify-between">
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Admin</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Announcements</p>
          </div>
          <button className="btn-primary text-xs py-2 px-4"><Plus size={13} />New Announcement</button>
        </div>
        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto space-y-4">
          {announcements.map(ann => (
            <div key={ann.id} className="bg-white border border-stone-200/80 rounded-sm p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-sans font-medium text-stone-800">{ann.title}</h3>
                    <span className={`text-2xs font-sans font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm border ${ann.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-stone-100 text-stone-600 border-stone-200'}`}>{ann.status}</span>
                    <span className="text-2xs font-sans text-stone-400 bg-stone-100 px-2 py-0.5 rounded-sm capitalize">Target: {ann.targetRole}</span>
                  </div>
                  <p className="text-sm font-sans font-light text-stone-500 leading-relaxed mb-2">{ann.body}</p>
                  <p className="text-xs font-sans text-stone-400">Published: {new Date(ann.publishedAt).toLocaleDateString('en-IN')}{ann.expiresAt && ` · Expires: ${new Date(ann.expiresAt).toLocaleDateString('en-IN')}`}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleStatus(ann.id)} className="p-2 rounded-sm border border-stone-200 text-stone-400 hover:text-amber-700 hover:border-amber-300 transition-colors bg-white">
                    <Edit2 size={14} />
                  </button>
                  <button className="p-2 rounded-sm border border-stone-200 text-stone-400 hover:text-red-600 hover:border-red-200 transition-colors bg-white">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
