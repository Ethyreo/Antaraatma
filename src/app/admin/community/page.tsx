'use client';
import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { mockCommunityPosts } from '@/lib/data/mockData';
import type { CommunityPost } from '@/lib/data/types';
import { Pin, Trash2, Shield, MessageSquare } from 'lucide-react';

export default function AdminCommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>(mockCommunityPosts);

  const togglePin = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, isPinned: !p.isPinned } : p));
  };

  const removePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center">
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Admin</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Community Moderation</p>
          </div>
        </div>
        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto space-y-4">
          {posts.map(post => (
            <div key={post.id} className={`bg-white border rounded-sm p-6 ${post.isPinned ? 'border-amber-200 bg-amber-50/30' : 'border-stone-200/80'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-sans font-medium text-stone-800">{post.authorName}</p>
                    <span className="text-2xs font-sans font-medium text-stone-500 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-sm">{post.category}</span>
                    {post.isPinned && <span className="text-2xs font-sans font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm">Pinned</span>}
                  </div>
                  <h3 className="font-serif text-base text-stone-800 mb-2">{post.title}</h3>
                  <p className="text-sm font-sans font-light text-stone-500 leading-relaxed mb-3">{post.body}</p>
                  <div className="flex items-center gap-4 text-xs font-sans text-stone-400">
                    <span>❤ {post.reactions}</span>
                    <span className="flex items-center gap-1"><MessageSquare size={11} />{post.commentCount}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => togglePin(post.id)} className={`p-2 rounded-sm border transition-colors ${post.isPinned ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-stone-400 bg-white border-stone-200 hover:border-amber-300'}`}>
                    <Pin size={14} />
                  </button>
                  <button className="p-2 rounded-sm border border-stone-200 text-stone-400 hover:text-amber-700 hover:border-amber-300 transition-colors bg-white">
                    <Shield size={14} />
                  </button>
                  <button onClick={() => removePost(post.id)} className="p-2 rounded-sm border border-stone-200 text-stone-400 hover:text-red-600 hover:border-red-200 transition-colors bg-white">
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
