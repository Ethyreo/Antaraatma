'use client';
import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Plus, Search, Edit2, Trash2, Eye, Star, X, Bold, Italic, Heading2, Heading3, List, Quote, Link as LinkIcon, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface Category { id: string; name: string; slug: string; }
interface Tag { id: string; name: string; slug: string; }

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image_url?: string;
  cover_image_alt?: string;
  author_name: string;
  category_id: string;
  status: 'draft' | 'published' | 'archived' | 'unpublished';
  featured: boolean;
  read_time_minutes: number;
  published_at?: string;
  created_at: string;
  blog_categories?: { id: string; name: string; slug: string };
}

interface EditorForm {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image_url: string;
  cover_image_alt: string;
  author_name: string;
  category_id: string;
  status: 'draft' | 'published';
  featured: boolean;
  seo_title: string;
  seo_description: string;
  tag_ids: string[];
}

const EMPTY_FORM: EditorForm = {
  title: '', slug: '', excerpt: '', body: '',
  cover_image_url: '', cover_image_alt: '',
  author_name: 'Dr. Vijay Singla', category_id: '',
  status: 'draft', featured: false,
  seo_title: '', seo_description: '', tag_ids: [],
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function insertMarkdown(body: string, before: string, after = '', placeholder = 'text') {
  return body + (body ? '\n\n' : '') + before + placeholder + after;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<EditorForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      let res = await fetch('/api/blog');
      const json = await res.json();
      if (json.data) setPosts(json.data);
    } catch (e) {
      console.error('Failed to fetch posts', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    fetch('/api/blog/categories').then(r => r.json()).then(j => { if (j.data) setCategories(j.data); });
    fetch('/api/blog/tags').then(r => r.json()).then(j => { if (j.data) setTags(j.data); });
  }, [fetchPosts]);

  const filtered = posts.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openNew = () => {
    setEditingPost(null);
    setForm(EMPTY_FORM);
    setSaveError('');
    setSaveSuccess('');
    setActiveTab('content');
    setShowEditor(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      body: post.body,
      cover_image_url: post.cover_image_url || '',
      cover_image_alt: post.cover_image_alt || '',
      author_name: post.author_name,
      category_id: post.category_id,
      status: (post.status === 'published' ? 'published' : 'draft') as 'draft' | 'published',
      featured: post.featured,
      seo_title: '',
      seo_description: '',
      tag_ids: [],
    });
    setSaveError('');
    setSaveSuccess('');
    setActiveTab('content');
    setShowEditor(true);
  };

  const handleTitleChange = (val: string) => {
    setForm(f => ({ ...f, title: val, slug: editingPost ? f.slug : slugify(val) }));
  };

  const handleSave = async (publishNow = false) => {
    if (!form.title.trim()) { setSaveError('Title is required.'); return; }
    if (!form.slug.trim()) { setSaveError('Slug is required.'); return; }
    if (!form.category_id) { setSaveError('Please select a category.'); return; }

    setSaving(true);
    setSaveError('');
    setSaveSuccess('');

    const payload = {
      ...form,
      status: publishNow ? 'published' : form.status,
    };

    try {
      let res: Response;
      if (editingPost) {
        res = await fetch('/api/blog', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingPost.id, ...payload }),
        });
      } else {
        res = await fetch('/api/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const json = await res.json();
      if (!res.ok || json.error) {
        setSaveError(json.error || 'Failed to save post.');
      } else {
        setSaveSuccess(publishNow ? 'Post published successfully!' : 'Post saved as draft.');
        await fetchPosts();
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
      let res = await fetch(`/api/blog?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== id));
      }
    } catch (e) {
      console.error('Delete failed', e);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleToggleFeatured = async (post: BlogPost) => {
    let res = await fetch('/api/blog', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: post.id, featured: !post.featured }),
    });
    if (res.ok) {
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, featured: !p.featured } : p));
    }
  };

  const handleToggleStatus = async (post: BlogPost) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    let res = await fetch('/api/blog', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: post.id, status: newStatus }),
    });
    if (res.ok) {
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, status: newStatus } : p));
    }
  };

  const insertFormat = (type: string) => {
    let newBody = form.body;
    switch (type) {
      case 'bold': newBody = insertMarkdown(form.body, '**', '**', 'bold text'); break;
      case 'italic': newBody = insertMarkdown(form.body, '_', '_', 'italic text'); break;
      case 'h2': newBody = insertMarkdown(form.body, '## ', '', 'Heading'); break;
      case 'h3': newBody = insertMarkdown(form.body, '### ', '', 'Sub-heading'); break;
      case 'list': newBody = form.body + '\n\n- Item 1\n- Item 2\n- Item 3'; break;
      case 'quote': newBody = insertMarkdown(form.body, '> ', '', 'Quote text'); break;
      case 'link': newBody = insertMarkdown(form.body, '[', '](https://)', 'link text'); break;
    }
    setForm(f => ({ ...f, body: newBody }));
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        {/* Topbar */}
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center justify-between">
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Admin</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Blog Posts</p>
          </div>
          <button onClick={openNew} className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
            <Plus size={13} />New Post
          </button>
        </div>

        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input type="text" placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} className="input-base pl-9" />
            </div>
            <div className="flex gap-2">
              {[null, 'published', 'draft', 'archived'].map(s => (
                <button key={String(s)} onClick={() => setStatusFilter(s)} className={`text-xs font-sans font-medium px-3 py-2 rounded-sm border transition-colors capitalize ${statusFilter === s ? 'bg-amber-800 text-amber-50 border-amber-800' : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300'}`}>
                  {s || 'All'}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-stone-200/80 rounded-sm overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-16 gap-2 text-stone-400">
                <Loader2 size={18} className="animate-spin" />
                <span className="text-sm font-sans">Loading posts…</span>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    {['Title', 'Category', 'Author', 'Read Time', 'Status', 'Featured', 'Published', 'Actions'].map(h => (
                      <th key={h} className="text-left text-xs font-sans font-medium text-stone-400 uppercase tracking-widest px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-12 text-stone-400 font-sans text-sm">No posts found. Create your first post!</td></tr>
                  ) : filtered.map(post => (
                    <tr key={post.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-sans font-medium text-stone-700 max-w-xs truncate">{post.title}</td>
                      <td className="px-5 py-3.5 font-sans text-stone-500 text-xs">{post.blog_categories?.name || '—'}</td>
                      <td className="px-5 py-3.5 font-sans text-stone-500 text-xs">{post.author_name}</td>
                      <td className="px-5 py-3.5 font-sans text-stone-400 text-xs">{post.read_time_minutes} min</td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => handleToggleStatus(post)} className={`text-2xs font-sans font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm border transition-colors ${post.status === 'published' ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'}`}>
                          {post.status}
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => handleToggleFeatured(post)} className={`transition-colors ${post.featured ? 'text-amber-500' : 'text-stone-300 hover:text-amber-400'}`}>
                          <Star size={15} className={post.featured ? 'fill-amber-500' : ''} />
                        </button>
                      </td>
                      <td className="px-5 py-3.5 font-sans text-stone-400 text-xs">
                        {post.published_at ? new Date(post.published_at).toLocaleDateString('en-IN') : '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-amber-700 transition-colors"><Eye size={14} /></a>
                          <button onClick={() => openEdit(post)} className="text-stone-400 hover:text-amber-700 transition-colors"><Edit2 size={14} /></button>
                          <button onClick={() => setDeleteId(post.id)} className="text-stone-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
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

      {/* ── EDITOR MODAL ── */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" onClick={() => setShowEditor(false)} />

          {/* Panel */}
          <div className="relative ml-auto w-full max-w-4xl h-full bg-[#FAF8F4] flex flex-col shadow-2xl overflow-hidden">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white">
              <div>
                <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Blog Editor</p>
                <p className="font-serif text-lg text-stone-800">{editingPost ? 'Edit Post' : 'New Post'}</p>
              </div>
              <div className="flex items-center gap-3">
                {saveSuccess && (
                  <span className="flex items-center gap-1.5 text-xs font-sans text-green-700">
                    <CheckCircle size={13} />{saveSuccess}
                  </span>
                )}
                {saveError && (
                  <span className="flex items-center gap-1.5 text-xs font-sans text-red-600">
                    <AlertCircle size={13} />{saveError}
                  </span>
                )}
                <button
                  onClick={() => handleSave(false)}
                  disabled={saving}
                  className="text-xs font-sans font-medium px-4 py-2 rounded-sm border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving && <Loader2 size={12} className="animate-spin" />}
                  Save Draft
                </button>
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 disabled:opacity-50"
                >
                  {saving && <Loader2 size={12} className="animate-spin" />}
                  Publish
                </button>
                <button onClick={() => setShowEditor(false)} className="text-stone-400 hover:text-stone-700 transition-colors ml-1">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-stone-200 bg-white px-6">
              {(['content', 'seo'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-xs font-sans font-medium uppercase tracking-widest px-4 py-3 border-b-2 transition-colors capitalize ${activeTab === tab ? 'border-amber-700 text-amber-800' : 'border-transparent text-stone-400 hover:text-stone-600'}`}
                >
                  {tab === 'content' ? 'Content' : 'SEO & Settings'}
                </button>
              ))}
            </div>

            {/* Editor Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {activeTab === 'content' ? (
                <>
                  {/* Title */}
                  <div>
                    <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Title *</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={e => handleTitleChange(e.target.value)}
                      placeholder="Enter post title…"
                      className="input-base font-serif text-lg"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Slug *</label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                      placeholder="post-url-slug"
                      className="input-base font-mono text-sm"
                    />
                  </div>

                  {/* Category + Author row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Category *</label>
                      <select
                        value={form.category_id}
                        onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                        className="input-base"
                      >
                        <option value="">Select category…</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Author</label>
                      <input
                        type="text"
                        value={form.author_name}
                        onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))}
                        className="input-base"
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Excerpt</label>
                    <textarea
                      value={form.excerpt}
                      onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                      rows={2}
                      placeholder="Short summary shown in listings…"
                      className="input-base resize-none"
                    />
                  </div>

                  {/* Cover Image */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Cover Image URL</label>
                      <input
                        type="text"
                        value={form.cover_image_url}
                        onChange={e => setForm(f => ({ ...f, cover_image_url: e.target.value }))}
                        placeholder="https://…"
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Cover Image Alt</label>
                      <input
                        type="text"
                        value={form.cover_image_alt}
                        onChange={e => setForm(f => ({ ...f, cover_image_alt: e.target.value }))}
                        placeholder="Describe the image…"
                        className="input-base"
                      />
                    </div>
                  </div>

                  {/* Body */}
                  <div>
                    <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Body (Markdown)</label>
                    {/* Formatting toolbar */}
                    <div className="flex items-center gap-1 mb-2 p-2 bg-white border border-stone-200 rounded-t-sm border-b-0">
                      {[
                        { icon: <Bold size={13} />, type: 'bold', title: 'Bold' },
                        { icon: <Italic size={13} />, type: 'italic', title: 'Italic' },
                        { icon: <Heading2 size={13} />, type: 'h2', title: 'Heading 2' },
                        { icon: <Heading3 size={13} />, type: 'h3', title: 'Heading 3' },
                        { icon: <List size={13} />, type: 'list', title: 'List' },
                        { icon: <Quote size={13} />, type: 'quote', title: 'Blockquote' },
                        { icon: <LinkIcon size={13} />, type: 'link', title: 'Link' },
                      ].map(btn => (
                        <button
                          key={btn.type}
                          type="button"
                          title={btn.title}
                          onClick={() => insertFormat(btn.type)}
                          className="p-1.5 rounded text-stone-500 hover:text-amber-800 hover:bg-amber-50 transition-colors"
                        >
                          {btn.icon}
                        </button>
                      ))}
                      <span className="ml-auto text-2xs font-sans text-stone-400">Markdown supported</span>
                    </div>
                    <textarea
                      value={form.body}
                      onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                      rows={18}
                      placeholder="Write your article here using Markdown…&#10;&#10;## Heading&#10;&#10;Paragraph text…&#10;&#10;**Bold**, _italic_, > blockquote"
                      className="input-base resize-none font-mono text-sm rounded-t-none border-t-0"
                    />
                    <p className="text-2xs font-sans text-stone-400 mt-1">
                      {form.body.trim() ? `~${Math.max(1, Math.ceil(form.body.trim().split(/\s+/).length / 200))} min read · ${form.body.trim().split(/\s+/).length} words` : 'Start writing…'}
                    </p>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => setForm(f => ({
                            ...f,
                            tag_ids: f.tag_ids.includes(tag.id)
                              ? f.tag_ids.filter(id => id !== tag.id)
                              : [...f.tag_ids, tag.id]
                          }))}
                          className={`text-xs font-sans font-medium px-2.5 py-1 rounded-sm border transition-colors ${form.tag_ids.includes(tag.id) ? 'bg-stone-800 text-stone-100 border-stone-800' : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400'}`}
                        >
                          #{tag.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status + Featured */}
                  <div className="flex items-center gap-6 pt-2">
                    <div>
                      <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">Status</label>
                      <select
                        value={form.status}
                        onChange={e => setForm(f => ({ ...f, status: e.target.value as 'draft' | 'published' }))}
                        className="input-base"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 mt-5">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={form.featured}
                        onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                        className="w-4 h-4 accent-amber-700"
                      />
                      <label htmlFor="featured" className="text-sm font-sans text-stone-600">Featured post</label>
                    </div>
                  </div>
                </>
              ) : (
                /* SEO Tab */
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">SEO Title</label>
                    <input
                      type="text"
                      value={form.seo_title}
                      onChange={e => setForm(f => ({ ...f, seo_title: e.target.value }))}
                      placeholder="Defaults to post title if empty"
                      className="input-base"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-medium text-stone-500 uppercase tracking-widest mb-1.5">SEO Description</label>
                    <textarea
                      value={form.seo_description}
                      onChange={e => setForm(f => ({ ...f, seo_description: e.target.value }))}
                      rows={3}
                      placeholder="Meta description for search engines (150–160 chars recommended)"
                      className="input-base resize-none"
                    />
                    <p className="text-2xs font-sans text-stone-400 mt-1">{form.seo_description.length} / 160 chars</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-stone-900/50" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-sm border border-stone-200 p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="font-serif text-lg text-stone-900 mb-2">Delete post?</h3>
            <p className="text-sm font-sans text-stone-500 mb-6">This action cannot be undone. The post will be permanently removed.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="text-xs font-sans font-medium px-4 py-2 rounded-sm border border-stone-200 text-stone-600 hover:bg-stone-50">Cancel</button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
                className="text-xs font-sans font-medium px-4 py-2 rounded-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5"
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
