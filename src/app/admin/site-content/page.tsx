'use client';
import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { mockSiteSections } from '@/lib/data/mockData';
import type { SiteSection } from '@/lib/data/types';
import { Save, Edit2 } from 'lucide-react';

export default function AdminSiteContentPage() {
  const [sections, setSections] = useState<SiteSection[]>(mockSiteSections);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  const startEdit = (section: SiteSection) => {
    setEditing(section.id);
    const vals: Record<string, string> = {};
    Object.entries(section.content).forEach(([k, v]) => { vals[k] = String(v); });
    setEditValues(vals);
  };

  const saveEdit = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? {
      ...s,
      content: Object.fromEntries(Object.entries(editValues).map(([k, v]) => [k, v])),
      updatedAt: new Date().toISOString(),
    } : s));
    setEditing(null);
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center">
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Admin</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Site Content Controls</p>
          </div>
        </div>
        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto space-y-6">
          <div className="max-w-2xl">
            <p className="text-sm font-sans font-light text-stone-500 leading-relaxed">
              Edit homepage sections, informational content blocks, and site-wide copy without code changes. Changes are reflected immediately on the frontend.
            </p>
          </div>
          {sections.map(section => (
            <div key={section.id} className="bg-white border border-stone-200/80 rounded-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-serif text-lg text-stone-800">{section.label}</h3>
                  <p className="text-xs font-sans text-stone-400 mt-0.5">Key: {section.key} · Updated: {new Date(section.updatedAt).toLocaleDateString('en-IN')}</p>
                </div>
                {editing !== section.id ? (
                  <button onClick={() => startEdit(section)} className="btn-ghost text-xs py-2 px-4">
                    <Edit2 size={13} />
                    Edit
                  </button>
                ) : (
                  <button onClick={() => saveEdit(section.id)} className="btn-primary text-xs py-2 px-4">
                    <Save size={13} />
                    Save
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {Object.entries(editing === section.id ? editValues : section.content).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-xs font-sans font-medium text-stone-500 mb-1 capitalize">{key.replace(/_/g, ' ')}</label>
                    {editing === section.id ? (
                      String(value).length > 80 ? (
                        <textarea
                          rows={3}
                          value={editValues[key] || ''}
                          onChange={e => setEditValues(prev => ({ ...prev, [key]: e.target.value }))}
                          className="input-base resize-none text-xs"
                        />
                      ) : (
                        <input
                          type="text"
                          value={editValues[key] || ''}
                          onChange={e => setEditValues(prev => ({ ...prev, [key]: e.target.value }))}
                          className="input-base text-xs"
                        />
                      )
                    ) : (
                      <p className="text-sm font-sans text-stone-600 bg-stone-50 border border-stone-100 rounded-sm px-3 py-2">{String(value)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
