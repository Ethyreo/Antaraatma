'use client';
import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { createClient } from '@/lib/supabase/client';
import { Save, Edit2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface SiteSection {
  id: string;
  section_key: string;
  label: string;
  content: Record<string, string>;
  status: string;
  updated_at: string;
}

export default function AdminSiteContentPage() {
  const [sections, setSections] = useState<SiteSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  const fetchSections = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('site_sections')
        .select('*')
        .order('label', { ascending: true });
      if (!error && data) setSections(data as SiteSection[]);
    } catch (err) {
      console.error('Site sections fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSections(); }, [fetchSections]);

  const startEdit = (section: SiteSection) => {
    setEditing(section.id);
    const vals: Record<string, string> = {};
    Object.entries(section.content).forEach(([k, v]) => { vals[k] = String(v); });
    setEditValues(vals);
    setSaveSuccess('');
    setSaveError('');
  };

  const saveEdit = async (section: SiteSection) => {
    setSaving(true);
    setSaveSuccess('');
    setSaveError('');
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('site_sections')
        .update({
          content: editValues,
          updated_at: new Date().toISOString(),
        })
        .eq('id', section.id);

      if (error) {
        setSaveError('Failed to save: ' + error.message);
      } else {
        setSections(prev => prev.map(s => s.id === section.id ? {
          ...s,
          content: editValues,
          updated_at: new Date().toISOString(),
        } : s));
        setSaveSuccess('Saved!');
        setEditing(null);
        setTimeout(() => setSaveSuccess(''), 2000);
      }
    } catch (err) {
      setSaveError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#F4EFE6' }}>
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center justify-between">
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Admin</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Site Content Controls</p>
          </div>
          <div className="flex items-center gap-3">
            {saveSuccess && <span className="flex items-center gap-1.5 text-xs font-sans text-green-700"><CheckCircle size={13} />{saveSuccess}</span>}
            {saveError && <span className="flex items-center gap-1.5 text-xs font-sans text-red-600"><AlertCircle size={13} />{saveError}</span>}
          </div>
        </div>
        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto space-y-6">
          <div className="max-w-2xl">
            <p className="text-sm font-sans font-light text-stone-500 leading-relaxed">
              Edit homepage sections, informational content blocks, and site-wide copy without code changes. Changes are saved to the database and reflected immediately.
            </p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-stone-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm font-sans">Loading…</span>
            </div>
          ) : sections.length === 0 ? (
            <div className="text-center py-16 text-stone-400 font-sans text-sm">No site sections configured yet.</div>
          ) : sections.map(section => (
            <div key={section.id} className="bg-white border border-stone-200/80 rounded-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-serif text-lg text-stone-800">{section.label}</h3>
                  <p className="text-xs font-sans text-stone-400 mt-0.5">
                    Key: {section.section_key} · Updated: {new Date(section.updated_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
                {editing !== section.id ? (
                  <button onClick={() => startEdit(section)} className="btn-ghost text-xs py-2 px-4 flex items-center gap-1.5">
                    <Edit2 size={13} />
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => saveEdit(section)}
                    disabled={saving}
                    className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
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
