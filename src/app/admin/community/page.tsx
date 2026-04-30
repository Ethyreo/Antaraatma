'use client';
import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Plus, Pin, Trash2, Shield, MessageSquare, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface CommunityPost {
  id: string;
  user_id: string;
  author_name: string;
  category: string;
  title: string;
  body: string;
  reactions: number;
  comment_count: number;
  is_pinned: boolean;
  is_moderated: boolean;
  status: string;
  created_at: string;
}

interface FormState {
  title: string;
  body: string;
  author_name: string;
  category: string;
  is_pinned: boolean;
  status: 'published' | 'draft';
}

const EMPTY_FORM: FormState = {
  title: '',
  body: '',
  author_name: 'Admin',
  category: 'Gratitude',
  is_pinned: false,
  status: 'published',
};

const CATEGORIES = ['Gratitude', 'Good Karma', 'Reflection', 'Healing Win'];

export default function AdminCommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/community');
      const json = await res.json();
      if (json.data) setPosts(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openNew = () => {
    setForm(EMPTY_FORM);
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
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok || json.error) {
        setSaveError(json.error || 'Failed to save.');
      } else {
        setSaveSuccess('Post created!');
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
      await fetch(`/api/community?id=${id}`, { method: 'DELETE' });
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const togglePin = async (post: CommunityPost) => {
    const res = await fetch('/api/community', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: post.id, is_pinned: !post.is_pinned }),
    });
    if (res.ok) setPosts(prev => prev.map(p => p.id === post.id ? { ...p, is_pinned: !p.is_pinned } : p));
  };

  const toggleModerate = async (post: CommunityPost) => {
    const res = await fetch('/api/community', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: post.id, is_moderated: !post.is_moderated, status: post.is_moderated ? 'published' : 'archived' }),
    });
    if (res.ok) setPosts(prev => prev.map(p => p.id === post.id ? { ...p, is_moderated: !p.is_moderated } : p));
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#F4EFE6' }}>
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center justify-between">
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Admin</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Community Moderation</p>
          </div>
          <button onClick={openNew} className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
            <Plus size={13} />New Post
          </button>
        </div>
        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-stone-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm font-sans">Loading…</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 text-stone-400 font-sans text-sm">No community posts yet.</div>
          ) : posts.map(post => (
            <div key={post.id} className={`bg-white border rounded-sm p-6 ${post.is_pinned ? 'border-amber-200 bg-amber-50/30' : 'border-stone-200/80'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-sans font-medium text-stone-800">{post.author_name}</p>
                    <span className="text-2xs font-sans font-medium text-stone-500 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-sm">{post.category}</span>
                    {post.is_pinned && <span className="text-2xs font-sans font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm">Pinned</span>}
                    {post.is_moderated && <span className="text-2xs font-sans font-medium text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-sm">Moderated</span>}
                  </div>
                  <h3 className="font-serif text-base text-stone-800 mb-2">{post.title}</h3>
                  <p className="text-sm font-sans font-light text-stone-500 leading-relaxed mb-3">{post.body}</p>
                  <div className="flex items-center gap-4 text-xs font-sans text-stone-400">
                    <span>❤ {post.reactions}</span>
                    <span className="flex items-center gap-1"><MessageSquare size={11} />{post.comment_count}</span>
                    <span>{new Date(post.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => togglePin(post)} className={`p-2 rounded-sm border transition-colors ${post.is_pinned ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-stone-400 bg-white border-stone-200 hover:border-amber-300'}`}>
                    <Pin size={14} />
                  </button>
                  <button onClick={() => toggleModerate(post)} className={`p-2 rounded-sm border transition-colors ${post.is_moderated ? 'text-red-600 bg-red-50 border-red-200' : 'text-stone-400 bg-white border-stone-200 hover:border-amber-300'}`}>
                    <Shield size={14} />
                  </button>
                  <button onClick={() => setDeleteId(post.id)} className="p-2 rounded-sm border border-stone-200 text-stone-400 hover:text-red-600 hover:border-red-200 transition-colors bg-white">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Post Modal */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setShowEditor(false)} />
          <div className="relative ml-auto w-full max-w-xl h-full bg-[#FAF8F4] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white">
              <div>
                <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Community</p>
                <p className="font-serif text-lg text-stone-800">New Post</p>
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
                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700" placeholder="Post title" />
              </div>
              <div>
                <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Body *</label>
                <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={5} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700 resize-none" placeholder="Post content…" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Author Name</label>
                  <input type="text" value={form.author_name} onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700" />
                </div>
                <div>
                  <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_pinned} onChange={e => setForm(f => ({ ...f, is_pinned: e.target.checked }))} className="rounded border-stone-300 text-amber-600 focus:ring-amber-500" />
                  <span className="text-sm font-sans text-stone-600">Pin this post</span>
                </label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-stone-200 bg-white flex items-center justify-end gap-3">
              <button onClick={() => setShowEditor(false)} className="text-xs font-sans font-medium px-4 py-2 rounded-sm border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5 disabled:opacity-50">
                {saving && <Loader2 size={12} className="animate-spin" />}
                Publish Post
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
            <h3 className="font-serif text-lg text-stone-800 mb-2">Delete Post?</h3>
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
