'use client';
import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Plus, Edit2, Trash2, Search, BookOpen, FileText, Headphones, Video, FileCheck, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  cover_image_url?: string;
  resource_type: string;
  file_url: string;
  access_level: string;
  program_id?: string;
  featured: boolean;
  status: string;
  sort_order: number;
  created_at: string;
}

interface FormState {
  title: string;
  description: string;
  resource_type: string;
  file_url: string;
  access_level: string;
  featured: boolean;
  status: 'draft' | 'published';
}

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  resource_type: 'pdf',
  file_url: '',
  access_level: 'free',
  featured: false,
  status: 'published',
};

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
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<Resource | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let res = await fetch('/api/resources');
      const json = await res.json();
      if (json.data) setResources(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = resources.filter(r => {
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || r.resource_type === typeFilter;
    return matchSearch && matchType;
  });

  const allTypes = Array.from(new Set(resources.map(r => r.resource_type)));

  const openNew = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setSaveError('');
    setSaveSuccess('');
    setShowEditor(true);
  };

  const openEdit = (item: Resource) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      description: item.description,
      resource_type: item.resource_type,
      file_url: item.file_url,
      access_level: item.access_level,
      featured: item.featured,
      status: item.status === 'published' ? 'published' : 'draft',
    });
    setSaveError('');
    setSaveSuccess('');
    setShowEditor(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setSaveError('Title is required.'); return; }
    setSaving(true);
    setSaveError('');
    setSaveSuccess('');
    try {
      let res: Response;
      if (editingItem) {
        res = await fetch('/api/resources', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingItem.id, ...form }),
        });
      } else {
        res = await fetch('/api/resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      const json = await res.json();
      if (!res.ok || json.error) {
        setSaveError(json.error || 'Failed to save.');
      } else {
        setSaveSuccess(editingItem ? 'Resource updated!' : 'Resource added!');
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
      await fetch(`/api/resources?id=${id}`, { method: 'DELETE' });
      setResources(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center justify-between">
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Admin</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Resources</p>
          </div>
          <button onClick={openNew} className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
            <Plus size={13} />Add Resource
          </button>
        </div>
        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto space-y-6">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input type="text" placeholder="Search resources..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700 placeholder-stone-400" />
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setTypeFilter(null)} className={`text-xs font-sans font-medium px-3 py-2 rounded-sm border transition-colors ${typeFilter === null ? 'bg-amber-800 text-amber-50 border-amber-800' : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300'}`}>All</button>
              {allTypes.map(t => (
                <button key={t} onClick={() => setTypeFilter(t)} className={`text-xs font-sans font-medium px-3 py-2 rounded-sm border transition-colors capitalize ${typeFilter === t ? 'bg-amber-800 text-amber-50 border-amber-800' : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300'}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="bg-white border border-stone-200/80 rounded-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-16 gap-2 text-stone-400">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm font-sans">Loading…</span>
              </div>
            ) : (
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
                    <tr><td colSpan={6} className="px-5 py-10 text-center text-sm font-sans text-stone-400">No resources found. Add your first resource!</td></tr>
                  ) : filtered.map(resource => (
                    <tr key={resource.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-sans font-medium text-stone-700 max-w-[200px]"><span className="line-clamp-1">{resource.title}</span></td>
                      <td className="px-5 py-3.5 font-sans text-stone-500 text-xs max-w-[260px]"><span className="line-clamp-2">{resource.description}</span></td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-sans font-medium px-2 py-0.5 rounded-full border capitalize ${typeColors[resource.resource_type] || 'bg-stone-50 text-stone-600 border-stone-200'}`}>
                          {typeIcons[resource.resource_type]}
                          {resource.resource_type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-sans text-stone-500 text-xs capitalize">{resource.access_level}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-sans font-medium px-2 py-0.5 rounded-full border capitalize ${resource.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-stone-50 text-stone-500 border-stone-200'}`}>{resource.status}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(resource)} className="text-stone-400 hover:text-amber-700 transition-colors"><Edit2 size={14} /></button>
                          <button onClick={() => setDeleteId(resource.id)} className="text-stone-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Editor Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setShowEditor(false)} />
          <div className="relative ml-auto w-full max-w-xl h-full bg-[#FAF8F4] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white">
              <div>
                <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Resources</p>
                <p className="font-serif text-lg text-stone-800">{editingItem ? 'Edit Resource' : 'New Resource'}</p>
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
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700" placeholder="Resource title" />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700 resize-none" placeholder="Brief description…" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Type</label>
                  <select value={form.resource_type} onChange={e => setForm(f => ({ ...f, resource_type: e.target.value }))} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700">
                    {['pdf', 'ebook', 'audio', 'video', 'guide', 'worksheet'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Access Level</label>
                  <select value={form.access_level} onChange={e => setForm(f => ({ ...f, access_level: e.target.value }))} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700">
                    {['free', 'enrolled', 'premium', 'admin'].map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">File URL</label>
                <input type="text" value={form.file_url} onChange={e => setForm(f => ({ ...f, file_url: e.target.value }))} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700" placeholder="https://…" />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="rounded border-stone-300 text-amber-600 focus:ring-amber-500" />
                  <span className="text-sm font-sans text-stone-600">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.status === 'published'} onChange={e => setForm(f => ({ ...f, status: e.target.checked ? 'published' : 'draft' }))} className="rounded border-stone-300 text-amber-600 focus:ring-amber-500" />
                  <span className="text-sm font-sans text-stone-600">Published</span>
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-stone-200 bg-white flex items-center justify-end gap-3">
              <button onClick={() => setShowEditor(false)} className="text-xs font-sans font-medium px-4 py-2 rounded-sm border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5 disabled:opacity-50">
                {saving && <Loader2 size={12} className="animate-spin" />}
                {editingItem ? 'Update' : 'Save Resource'}
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
            <h3 className="font-serif text-lg text-stone-800 mb-2">Delete Resource?</h3>
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
