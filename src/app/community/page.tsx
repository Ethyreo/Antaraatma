'use client';
import React, { useState, useEffect } from 'react';
import StudentSidebar from '@/components/StudentSidebar';
import { mockCommunityPosts, mockUsers } from '@/lib/data/mockData';
import type { CommunityCategory } from '@/lib/data/types';
import { Heart, MessageCircle, Pin, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const CURRENT_USER_ID = 'user-student-1';
const CATEGORIES: CommunityCategory[] = ['Gratitude', 'Good Karma', 'Reflection', 'Healing Win'];

const categoryColors: Record<CommunityCategory, string> = {
  'Gratitude': 'text-teal-depth bg-pale-mist border-mint-mist',
  'Good Karma': 'text-sage-forest bg-pale-mist border-mint-mist',
  'Reflection': 'text-deep-night bg-warm-pearl border-mint-mist',
  'Healing Win': 'text-teal-depth bg-pale-mist border-aqua-light',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export default function CommunityPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = React.useState(false);
  const [authed, setAuthed] = React.useState(false);
  const [activeCategory, setActiveCategory] = useState<CommunityCategory | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', body: '', category: 'Gratitude' as CommunityCategory });
  const [posts, setPosts] = useState(mockCommunityPosts);
  const [reactions, setReactions] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    import('@/lib/supabase/client').then(({ createClient }) => {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user) {
          router.replace('/sign-up-login?redirectTo=/community');
        } else {
          setAuthed(true);
        }
        setAuthChecked(true);
      });
    });
  }, [router]);

  const filtered = activeCategory ? posts.filter(p => p.category === activeCategory) : posts;
  const pinned = filtered.filter(p => p.isPinned);
  const regular = filtered.filter(p => !p.isPinned);

  const handleReact = (postId: string) => {
    setReactions(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      id: `cp-new-${Date.now()}`,
      userId: CURRENT_USER_ID,
      authorName: mockUsers.find(u => u.id === CURRENT_USER_ID)?.fullName?.split(' ')[0] + ' S.' || 'You',
      category: newPost.category,
      title: newPost.title,
      body: newPost.body,
      reactions: 0,
      commentCount: 0,
      isPinned: false,
      isModerated: false,
      status: 'published' as const,
      createdAt: new Date().toISOString(),
    };
    setPosts(prev => [newEntry, ...prev]);
    setNewPost({ title: '', body: '', category: 'Gratitude' });
    setShowNewPost(false);
  };

  if (!authChecked || !authed) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#F4EFE6' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: '#1A6B6B', borderTopColor: 'transparent' }} />
          <p className="text-sm font-sans text-stone-500">Verifying session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#F4EFE6' }}>
      <StudentSidebar />
      <div className="flex-1 min-w-0">
        {/* Topbar */}
        <div
          className="sticky top-0 z-30 backdrop-blur-sm px-6 xl:px-8 h-16 flex items-center justify-between"
          style={{ background: 'rgba(244,239,230,0.96)', borderBottom: '1px solid rgba(168,216,206,0.3)' }}
        >
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Community</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Talk to Uni</p>
          </div>
          <button onClick={() => setShowNewPost(true)} className="btn-primary text-xs py-2 px-4">
            <Plus size={13} />
            Share
          </button>
        </div>

        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto">
          {/* Intro */}
          <div className="max-w-2xl mb-10">
            <h1 className="font-serif text-display-md text-stone-900 mb-4">A space for healing, together.</h1>
            <p className="text-base font-sans font-light text-stone-500 leading-relaxed">
              Share your reflections, celebrate your wins, express gratitude, and support others on their journey. This is an intimate, moderated space — calm, purposeful, and safe.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory(null)}
              className={`text-xs font-sans font-medium px-3 py-1.5 rounded-sm border transition-colors ${!activeCategory ? 'bg-stone-900 text-stone-100 border-stone-900' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'}`}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                className={`text-xs font-sans font-medium px-3 py-1.5 rounded-sm border transition-colors ${activeCategory === cat ? 'bg-stone-900 text-stone-100 border-stone-900' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* New Post Modal */}
          {showNewPost && (
            <div className="fixed inset-0 z-50 bg-stone-900/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-sm shadow-modal w-full max-w-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-xl text-stone-800">Share with the community</h2>
                  <button onClick={() => setShowNewPost(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleSubmitPost} className="space-y-4">
                  <div>
                    <label className="block text-xs font-sans font-medium text-stone-700 mb-1.5">Category</label>
                    <select
                      value={newPost.category}
                      onChange={e => setNewPost(p => ({ ...p, category: e.target.value as CommunityCategory }))}
                      className="input-base"
                    >
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-medium text-stone-700 mb-1.5">Title</label>
                    <input
                      type="text"
                      required
                      className="input-base"
                      placeholder="A short, meaningful title"
                      value={newPost.title}
                      onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-medium text-stone-700 mb-1.5">Your reflection</label>
                    <textarea
                      required
                      rows={5}
                      className="input-base resize-none"
                      placeholder="Share what's on your heart..."
                      value={newPost.body}
                      onChange={e => setNewPost(p => ({ ...p, body: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="btn-primary flex-1 justify-center">Post</button>
                    <button type="button" onClick={() => setShowNewPost(false)} className="btn-ghost flex-1 justify-center">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Pinned Posts */}
          {pinned.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Pin size={13} className="text-amber-700" />
                <span className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Pinned</span>
              </div>
              <div className="space-y-4">
                {pinned.map(post => <PostCard key={post.id} post={post} reacted={!!reactions[post.id]} onReact={() => handleReact(post.id)} />)}
              </div>
            </div>
          )}

          {/* Regular Posts */}
          <div className="space-y-4">
            {regular.map(post => <PostCard key={post.id} post={post} reacted={!!reactions[post.id]} onReact={() => handleReact(post.id)} />)}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="font-serif text-xl text-stone-400">No posts in this category yet.</p>
              <p className="text-sm font-sans text-stone-400 mt-2">Be the first to share.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PostCard({ post, reacted, onReact }: { post: typeof mockCommunityPosts[0]; reacted: boolean; onReact: () => void }) {
  return (
    <div className="bg-white border border-stone-200/80 rounded-sm p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
            <span className="font-serif text-sm text-amber-800">{post.authorName[0]}</span>
          </div>
          <div>
            <p className="text-sm font-sans font-medium text-stone-700">{post.authorName}</p>
            <p className="text-xs font-sans text-stone-400">{timeAgo(post.createdAt)}</p>
          </div>
        </div>
        <span className={`text-2xs font-sans font-medium px-2.5 py-1 rounded-sm border ${categoryColors[post.category as CommunityCategory]}`}>
          {post.category}
        </span>
      </div>

      <h3 className="font-serif text-lg text-stone-800 mb-3">{post.title}</h3>
      <p className="text-sm font-sans font-light text-stone-500 leading-relaxed mb-5">{post.body}</p>

      <div className="flex items-center gap-5 pt-4 border-t border-stone-100">
        <button
          onClick={onReact}
          className={`flex items-center gap-1.5 text-xs font-sans transition-colors ${reacted ? 'text-amber-700' : 'text-stone-400 hover:text-amber-700'}`}
        >
          <Heart size={14} className={reacted ? 'fill-amber-700' : ''} />
          {post.reactions + (reacted ? 1 : 0)}
        </button>
        <div className="flex items-center gap-1.5 text-xs font-sans text-stone-400">
          <MessageCircle size={14} />
          {post.commentCount}
        </div>
      </div>
    </div>
  );
}
