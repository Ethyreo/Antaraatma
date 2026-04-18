'use client';
import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Plus, Edit2, Trash2, GripVertical, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  program_id?: string | null;
  category?: string | null;
  sort_order: number;
  status: string;
  created_at: string;
}

interface FormState {
  question: string;
  answer: string;
  category: string;
  status: 'published' | 'draft';
}

const EMPTY_FORM: FormState = {
  question: '',
  answer: '',
  category: '',
  status: 'published',
};

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState<FAQ | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let res = await fetch('/api/faqs');
      const json = await res.json();
      if (json.data) setFaqs(json.data);
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

  const openEdit = (item: FAQ) => {
    setEditingItem(item);
    setForm({
      question: item.question,
      answer: item.answer,
      category: item.category ?? '',
      status: item.status === 'published' ? 'published' : 'draft',
    });
    setSaveError('');
    setSaveSuccess('');
    setShowEditor(true);
  };

  const handleSave = async () => {
    if (!form.question.trim()) { setSaveError('Question is required.'); return; }
    if (!form.answer.trim()) { setSaveError('Answer is required.'); return; }
    setSaving(true);
    setSaveError('');
    setSaveSuccess('');
    try {
      const payload = { ...form, category: form.category || null };
      let res: Response;
      if (editingItem) {
        res = await fetch('/api/faqs', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingItem.id, ...payload }),
        });
      } else {
        res = await fetch('/api/faqs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      const json = await res.json();
      if (!res.ok || json.error) {
        setSaveError(json.error || 'Failed to save.');
      } else {
        setSaveSuccess(editingItem ? 'FAQ updated!' : 'FAQ created!');
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
      await fetch(`/api/faqs?id=${id}`, { method: 'DELETE' });
      setFaqs(prev => prev.filter(f => f.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleToggleStatus = async (item: FAQ) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    let res = await fetch('/api/faqs', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, status: newStatus }),
    });
    if (res.ok) setFaqs(prev => prev.map(f => f.id === item.id ? { ...f, status: newStatus } : f));
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center justify-between">
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Admin</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">FAQs</p>
          </div>
          <button onClick={openNew} className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
            <Plus size={13} />Add FAQ
          </button>
        </div>
        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-stone-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm font-sans">Loading…</span>
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-16 text-stone-400 font-sans text-sm">No FAQs yet. Add your first one!</div>
          ) : faqs.map(faq => (
            <div key={faq.id} className="bg-white border border-stone-200/80 rounded-sm p-5">
              <div className="flex items-start gap-4">
                <GripVertical size={16} className="text-stone-300 mt-0.5 shrink-0 cursor-grab" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-sans font-medium text-stone-800">{faq.question}</p>
                    <button
                      onClick={() => handleToggleStatus(faq)}
                      className={`text-2xs font-sans font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm border transition-colors ${faq.status === 'published' ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'}`}
                    >
                      {faq.status}
                    </button>
                    {faq.category && <span className="text-2xs font-sans text-stone-400 bg-stone-100 px-2 py-0.5 rounded-sm">{faq.category}</span>}
                  </div>
                  <p className="text-sm font-sans font-light text-stone-500 leading-relaxed">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => openEdit(faq)} className="p-2 rounded-sm border border-stone-200 text-stone-400 hover:text-amber-700 hover:border-amber-300 transition-colors bg-white">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => setDeleteId(faq.id)} className="p-2 rounded-sm border border-stone-200 text-stone-400 hover:text-red-600 hover:border-red-200 transition-colors bg-white">
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
                <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">FAQs</p>
                <p className="font-serif text-lg text-stone-800">{editingItem ? 'Edit FAQ' : 'New FAQ'}</p>
              </div>
              <div className="flex items-center gap-3">
                {saveSuccess && <span className="flex items-center gap-1.5 text-xs font-sans text-green-700"><CheckCircle size={13} />{saveSuccess}</span>}
                {saveError && <span className="flex items-center gap-1.5 text-xs font-sans text-red-600"><AlertCircle size={13} />{saveError}</span>}
                <button onClick={() => setShowEditor(false)} className="p-1.5 rounded-sm text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"><X size={18} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Question *</label>
                <input
                  type="text"
                  value={form.question}
                  onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                  className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700"
                  placeholder="e.g. What is naturopathy?"
                />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Answer *</label>
                <textarea
                  value={form.answer}
                  onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
                  rows={5}
                  className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700 resize-none"
                  placeholder="Write the answer…"
                />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Category (optional)</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700"
                  placeholder="e.g. General, Programs, Payments"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.status === 'published'}
                  onChange={e => setForm(f => ({ ...f, status: e.target.checked ? 'published' : 'draft' }))}
                  className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm font-sans text-stone-600">Publish immediately</span>
              </label>
            </div>
            <div className="px-6 py-4 border-t border-stone-200 bg-white flex items-center justify-end gap-3">
              <button onClick={() => setShowEditor(false)} className="text-xs font-sans font-medium px-4 py-2 rounded-sm border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5 disabled:opacity-50">
                {saving && <Loader2 size={12} className="animate-spin" />}
                {editingItem ? 'Update FAQ' : 'Save FAQ'}
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
            <h3 className="font-serif text-lg text-stone-800 mb-2">Delete FAQ?</h3>
            <p className="text-sm font-sans text-stone-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="text-xs font-sans font-medium px-4 py-2 rounded-sm border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition-colors">Cancel</button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
                className="text-xs font-sans font-medium px-4 py-2 rounded-sm bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                {deleting && <Loader2 size={12} className="animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
