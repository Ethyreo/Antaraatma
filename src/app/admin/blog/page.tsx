'use client';
import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { mockBlogPosts } from '@/lib/data/mockData';
import type { BlogPost } from '@/lib/data/types';
import { Plus, Search, Edit2, Trash2, Eye, Star } from 'lucide-react';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filtered = posts.filter(p => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleFeatured = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
  };

  const toggleStatus = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'published' ? 'draft' : 'published' } : p));
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center justify-between">
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Admin</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Blog Posts</p>
          </div>
          <button className="btn-primary text-xs py-2 px-4"><Plus size={13} />New Post</button>
        </div>
        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto space-y-6">
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
          <div className="bg-white border border-stone-200/80 rounded-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  {['Title', 'Category', 'Author', 'Read Time', 'Status', 'Featured', 'Published', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-sans font-medium text-stone-400 uppercase tracking-widest px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filtered.map(post => (
                  <tr key={post.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-sans font-medium text-stone-700 max-w-xs truncate">{post.title}</td>
                    <td className="px-5 py-3.5 font-sans text-stone-500 text-xs">{post.categoryName}</td>
                    <td className="px-5 py-3.5 font-sans text-stone-500 text-xs">{post.authorName}</td>
                    <td className="px-5 py-3.5 font-sans text-stone-400 text-xs">{post.readTimeMinutes} min</td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => toggleStatus(post.id)} className={`text-2xs font-sans font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm border transition-colors ${post.status === 'published' ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'}`}>
                        {post.status}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => toggleFeatured(post.id)} className={`transition-colors ${post.featured ? 'text-amber-500' : 'text-stone-300 hover:text-amber-400'}`}>
                        <Star size={15} className={post.featured ? 'fill-amber-500' : ''} />
                      </button>
                    </td>
                    <td className="px-5 py-3.5 font-sans text-stone-400 text-xs">{new Date(post.publishedAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-amber-700 transition-colors"><Eye size={14} /></a>
                        <button className="text-stone-400 hover:text-amber-700 transition-colors"><Edit2 size={14} /></button>
                        <button className="text-stone-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
