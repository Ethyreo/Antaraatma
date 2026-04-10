'use client';
import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Plus, Edit2, Trash2, Star, Eye, EyeOff, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  image_url?: string;
  cta_label: string;
  cta_href: string;
  status: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
}

interface FormState {
  title: string;
  slug: string;
  summary: string;
  description: string;
  cta_label: string;
  cta_href: string;
  status: 'draft' | 'published';
  featured: boolean;
}

const EMPTY_FORM: FormState = {
  title: '',
  slug: '',
  summary: '',
  description: '',
  cta_label: 'Learn More',
  cta_href: '/',
  status: 'published',
  featured: false,
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<Service | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let res = await fetch('/api/services');
      const json = await res.json();
      if (json.data) setServices(json.data);
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

  const openEdit = (item: Service) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      slug: item.slug,
      summary: item.summary,
      description: item.description,
      cta_label: item.cta_label,
      cta_href: item.cta_href,
      status: item.status === 'published' ? 'published' : 'draft',
      featured: item.featured,
    });
    setSaveError('');
    setSaveSuccess('');
    setShowEditor(true);
  };

  const handleTitleChange = (val: string) => {
    setForm(f => ({ ...f, title: val, slug: editingItem ? f.slug : slugify(val) }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) { setSaveError('Title is required.'); return; }
    if (!form.slug.trim()) { setSaveError('Slug is required.'); return; }
    setSaving(true);
    setSaveError('');
    setSaveSuccess('');
    try {
      let res: Response;
      if (editingItem) {
        res = await fetch('/api/services', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingItem.id, ...form }),
        });
      } else {
        res = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      const json = await res.json();
      if (!res.ok || json.error) {
        setSaveError(json.error || 'Failed to save.');
      } else {
        setSaveSuccess(editingItem ? 'Service updated!' : 'Service created!');
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
      await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleToggleFeatured = async (item: Service) => {
    let res = await fetch('/api/services', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, featured: !item.featured }),
    });
    if (res.ok) setServices(prev => prev.map(s => s.id === item.id ? { ...s, featured: !s.featured } : s));
  };

  const handleToggleStatus = async (item: Service) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    let res = await fetch('/api/services', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, status: newStatus }),
    });
    if (res.ok) setServices(prev => prev.map(s => s.id === item.id ? { ...s, status: newStatus } : s));
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center justify-between">
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Admin</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Services</p>
          </div>
          <button onClick={openNew} className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
            <Plus size={13} />New Service
          </button>
        </div>
        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-stone-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm font-sans">Loading…</span>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-16 text-stone-400 font-sans text-sm">No services yet. Create your first one!</div>
          ) : services.map(service => (
            <div key={service.id} className="bg-white border border-stone-200/80 rounded-sm p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-serif text-lg text-stone-800">{service.title}</h3>
                    <button onClick={() => handleToggleStatus(service)} className={`text-2xs font-sans font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm border transition-colors ${service.status === 'published' ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'}`}>{service.status}</button>
                    {service.featured && <span className="text-2xs font-sans font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm">Featured</span>}
                  </div>
                  <p className="text-sm font-sans font-light text-stone-500 leading-relaxed">{service.summary}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleToggleFeatured(service)} className={`p-2 rounded-sm border transition-colors ${service.featured ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-stone-400 bg-white border-stone-200 hover:border-amber-300'}`}>
                    <Star size={14} className={service.featured ? 'fill-amber-500' : ''} />
                  </button>
                  <button onClick={() => handleToggleStatus(service)} className="p-2 rounded-sm border border-stone-200 text-stone-400 hover:text-amber-700 hover:border-amber-300 transition-colors bg-white">
                    {service.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button onClick={() => openEdit(service)} className="p-2 rounded-sm border border-stone-200 text-stone-400 hover:text-amber-700 hover:border-amber-300 transition-colors bg-white">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => setDeleteId(service.id)} className="p-2 rounded-sm border border-stone-200 text-stone-400 hover:text-red-600 hover:border-red-200 transition-colors bg-white">
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
                <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Services</p>
                <p className="font-serif text-lg text-stone-800">{editingItem ? 'Edit Service' : 'New Service'}</p>
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
                <input type="text" value={form.title} onChange={e => handleTitleChange(e.target.value)} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700" placeholder="Service title" />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Slug *</label>
                <input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700" placeholder="service-slug" />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Summary</label>
                <textarea value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} rows={2} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700 resize-none" placeholder="Short summary…" />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Full Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700 resize-none" placeholder="Detailed description…" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">CTA Label</label>
                  <input type="text" value={form.cta_label} onChange={e => setForm(f => ({ ...f, cta_label: e.target.value }))} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700" placeholder="Learn More" />
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">CTA Link</label>
                  <input type="text" value={form.cta_href} onChange={e => setForm(f => ({ ...f, cta_href: e.target.value }))} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700" placeholder="/services/…" />
                </div>
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
                {editingItem ? 'Update' : 'Save Service'}
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
            <h3 className="font-serif text-lg text-stone-800 mb-2">Delete Service?</h3>
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
