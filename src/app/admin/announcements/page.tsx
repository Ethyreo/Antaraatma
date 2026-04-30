'use client';
import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Plus, Edit2, Trash2, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  body: string;
  target_role: string;
  status: string;
  published_at?: string;
  expires_at?: string;
  created_at: string;
}

interface FormState {
  title: string;
  body: string;
  target_role: string;
  status: 'draft' | 'published';
  expires_at: string;
}

const EMPTY_FORM: FormState = {
  title: '',
  body: '',
  target_role: 'all',
  status: 'published',
  expires_at: '',
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let res = await fetch('/api/announcements');
      const json = await res.json();
      if (json.data) setAnnouncements(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openNew = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setSaveError('');
    setSaveSuccess('');
    setShowEditor(true);
  };

  const openEdit = (item: Announcement) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      body: item.body,
      target_role: item.target_role,
      status: item.status === 'published' ? 'published' : 'draft',
      expires_at: item.expires_at ? item.expires_at.split('T')[0] : '',
    });
    setSaveError('');
    setSaveSuccess('');
    setShowEditor(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setSaveError('Title is required.'); return; }
    if (!form.body.trim()) { setSaveError('Body is required.'); return; }
    setSaving(true);
    setSaveError('');
    setSaveSuccess('');
    try {
      const payload = {
        ...form,
        expires_at: form.expires_at || null,
      };
      let res: Response;
      if (editingItem) {
        res = await fetch('/api/announcements', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingItem.id, ...payload }),
        });
      } else {
        res = await fetch('/api/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      const json = await res.json();
      if (!res.ok || json.error) {
        setSaveError(json.error || 'Failed to save.');
      } else {
        setSaveSuccess(editingItem ? 'Announcement updated!' : 'Announcement created!');
        await fetchData();
        setTimeout(() => { setShowEditor(false); setSaveSuccess(''); }, 1200);
      }
    } catch {
      setSaveError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await fetch(`/api/announcements?id=${id}`, { method: 'DELETE' });
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleToggleStatus = async (item: Announcement) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    let res = await fetch('/api/announcements', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, status: newStatus }),
    });
    if (res.ok) setAnnouncements(prev => prev.map(a => a.id === item.id ? { ...a, status: newStatus } : a));
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#F4EFE6' }}>
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center justify-between">
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Admin</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Announcements</p>
          </div>
          <button onClick={openNew} className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
            <Plus size={13} />New Announcement
          </button>
        </div>
        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-stone-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm font-sans">Loading…</span>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-16 text-stone-400 font-sans text-sm">No announcements yet. Create your first one!</div>
          ) : announcements.map(ann => (
            <div key={ann.id} className="bg-white border border-stone-200/80 rounded-sm p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-sans font-medium text-stone-800">{ann.title}</h3>
                    <button onClick={() => handleToggleStatus(ann)} className={`text-2xs font-sans font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm border transition-colors ${ann.status === 'published' ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'}`}>{ann.status}</button>
                    <span className="text-2xs font-sans text-stone-400 bg-stone-100 px-2 py-0.5 rounded-sm capitalize">Target: {ann.target_role}</span>
                  </div>
                  <p className="text-sm font-sans font-light text-stone-500 leading-relaxed mb-2">{ann.body}</p>
                  <p className="text-xs font-sans text-stone-400">
                    {ann.published_at ? `Published: ${new Date(ann.published_at).toLocaleDateString('en-IN')}` : 'Not published'}
                    {ann.expires_at && ` · Expires: ${new Date(ann.expires_at).toLocaleDateString('en-IN')}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEdit(ann)} className="p-2 rounded-sm border border-stone-200 text-stone-400 hover:text-amber-700 hover:border-amber-300 transition-colors bg-white">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => setDeleteId(ann.id)} className="p-2 rounded-sm border border-stone-200 text-stone-400 hover:text-red-600 hover:border-red-200 transition-colors bg-white">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setShowEditor(false)} />
          <div className="relative ml-auto w-full max-w-xl h-full bg-[#FAF8F4] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white">
              <div>
                <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Announcements</p>
                <p className="font-serif text-lg text-stone-800">{editingItem ? 'Edit Announcement' : 'New Announcement'}</p>
              </div>
              <div className="flex items-center gap-3">
                {saveSuccess && <span className="flex items-center gap-1.5 text-xs font-sans text-green-700"><CheckCircle size={13} />{saveSuccess}</span>}
                {saveError && <span className="flex items-center gap-1.5 text-xs font-sans text-red-600"><AlertCircle size={13} />{saveError}</span>}
                <button onClick={() => setShowEditor(false)} className="p-1.5 rounded-sm text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"><X size={18} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700" placeholder="Announcement title" />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Body *</label>
                <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={5} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700 resize-none" placeholder="Announcement content…" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Target Audience</label>
                  <select value={form.target_role} onChange={e => setForm(f => ({ ...f, target_role: e.target.value }))} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700">
                    <option value="all">All</option>
                    <option value="student">Students</option>
                    <option value="admin">Admins</option>
                    <option value="guest">Guests</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Expires On</label>
                  <input type="date" value={form.expires_at} onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.status === 'published'} onChange={e => setForm(f => ({ ...f, status: e.target.checked ? 'published' : 'draft' }))} className="rounded border-stone-300 text-amber-600 focus:ring-amber-500" />
                <span className="text-sm font-sans text-stone-600">Publish immediately</span>
              </label>
            </div>
            <div className="px-6 py-4 border-t border-stone-200 bg-white flex items-center justify-end gap-3">
              <button onClick={() => setShowEditor(false)} className="text-xs font-sans font-medium px-4 py-2 rounded-sm border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5 disabled:opacity-50">
                {saving && <Loader2 size={12} className="animate-spin" />}
                {editingItem ? 'Update' : 'Save Announcement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-sm border border-stone-200 p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="font-serif text-lg text-stone-800 mb-2">Delete Announcement?</h3>
            <p className="text-sm font-sans text-stone-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="text-xs font-sans font-medium px-4 py-2 rounded-sm border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} disabled={deleting} className="text-xs font-sans font-medium px-4 py-2 rounded-sm bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                {deleting && <Loader2 size={12} className="animate-spin" />}Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
