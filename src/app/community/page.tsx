'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, Pin, Plus, X } from 'lucide-react';
import StudentSidebar from '@/components/StudentSidebar';
import { createClient } from '@/lib/supabase/client';
import type { CommunityCategory } from '@/lib/data/types';

const CATEGORIES: CommunityCategory[] = [
  'Gratitude',
  'Good Karma',
  'Reflection',
  'Healing Win',
];

const categoryColors: Record<CommunityCategory, string> = {
  Gratitude: 'text-teal-depth bg-pale-mist border-mint-mist',
  'Good Karma': 'text-sage-forest bg-pale-mist border-mint-mist',
  Reflection: 'text-deep-night bg-warm-pearl border-mint-mist',
  'Healing Win': 'text-teal-depth bg-pale-mist border-aqua-light',
};

interface CommunityPostRecord {
  id: string;
  author_name: string;
  category: CommunityCategory;
  title: string;
  body: string;
  reactions: number;
  comment_count: number;
  is_pinned: boolean;
  created_at: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export default function CommunityPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState<CommunityCategory | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    body: '',
    category: 'Gratitude' as CommunityCategory,
  });
  const [submitting, setSubmitting] = useState(false);
  const [posts, setPosts] = useState<CommunityPostRecord[]>([]);
  const [reactions, setReactions] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    async function loadCommunity() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/sign-up-login?redirectTo=/community');
        if (isMounted) {
          setAuthChecked(true);
        }
        return;
      }

      if (isMounted) {
        setAuthed(true);
        setAuthChecked(true);
      }

      try {
        const response = await fetch('/api/community');
        const json = await response.json();

        if (!response.ok || json.error) {
          throw new Error(json.error || 'Failed to load community posts.');
        }

        if (isMounted) {
          setPosts(json.data ?? []);
          setReactions(
            Object.fromEntries(
              ((json.reacted_post_ids ?? []) as string[]).map((postId) => [postId, true])
            )
          );
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load community posts.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCommunity();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const filteredPosts = useMemo(
    () => (activeCategory ? posts.filter((post) => post.category === activeCategory) : posts),
    [activeCategory, posts]
  );
  const pinnedPosts = useMemo(
    () => filteredPosts.filter((post) => post.is_pinned),
    [filteredPosts]
  );
  const regularPosts = useMemo(
    () => filteredPosts.filter((post) => !post.is_pinned),
    [filteredPosts]
  );

  const handleReact = async (postId: string) => {
    try {
      const response = await fetch('/api/community/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId }),
      });
      const json = await response.json();

      if (!response.ok || json.error) {
        throw new Error(json.error || 'Failed to update reaction.');
      }

      setReactions((prev) => ({ ...prev, [postId]: json.data.reacted }));
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, reactions: json.data.reactions }
            : post
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update reaction.');
    }
  };

  const handleSubmitPost = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      const json = await response.json();

      if (!response.ok || json.error) {
        throw new Error(json.error || 'Failed to create post.');
      }

      setPosts((prev) => [json.data, ...prev]);
      setNewPost({ title: '', body: '', category: 'Gratitude' });
      setShowNewPost(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!authChecked || !authed) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#F4EFE6' }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: '#1A6B6B', borderTopColor: 'transparent' }}
          />
          <p className="text-sm font-sans text-stone-500">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#F4EFE6' }}>
      <StudentSidebar />
      <div className="flex-1 min-w-0">
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
          <div className="max-w-2xl mb-10">
            <h1 className="font-serif text-display-md text-stone-900 mb-4">A space for healing, together.</h1>
            <p className="text-base font-sans font-light text-stone-500 leading-relaxed">
              Share your reflections, celebrate your wins, express gratitude, and
              support others on their journey. This is an intimate, moderated space
              - calm, purposeful, and safe.
            </p>
          </div>

          {error && !showNewPost && (
            <div className="mb-6 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm font-sans text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory(null)}
              className={`text-xs font-sans font-medium px-3 py-1.5 rounded-sm border transition-colors ${
                !activeCategory
                  ? 'bg-stone-900 text-stone-100 border-stone-900'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                className={`text-xs font-sans font-medium px-3 py-1.5 rounded-sm border transition-colors ${
                  activeCategory === category
                    ? 'bg-stone-900 text-stone-100 border-stone-900'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {showNewPost && (
            <div className="fixed inset-0 z-50 bg-stone-900/50 flex items-center justify-center p-4">
              <div className="bg-white rounded-sm shadow-modal w-full max-w-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-xl text-stone-800">Share with the community</h2>
                  <button
                    onClick={() => setShowNewPost(false)}
                    className="text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                {error && (
                  <div className="mb-4 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm font-sans text-red-700">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmitPost} className="space-y-4">
                  <div>
                    <label className="block text-xs font-sans font-medium text-stone-700 mb-1.5">Category</label>
                    <select
                      value={newPost.category}
                      onChange={(event) =>
                        setNewPost((prev) => ({
                          ...prev,
                          category: event.target.value as CommunityCategory,
                        }))
                      }
                      className="input-base"
                    >
                      {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
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
                      onChange={(event) =>
                        setNewPost((prev) => ({ ...prev, title: event.target.value }))
                      }
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
                      onChange={(event) =>
                        setNewPost((prev) => ({ ...prev, body: event.target.value }))
                      }
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary flex-1 justify-center disabled:opacity-50"
                    >
                      {submitting ? 'Posting...' : 'Post'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewPost(false)}
                      className="btn-ghost flex-1 justify-center"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white border border-stone-200/80 rounded-sm p-6 animate-pulse"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-stone-100" />
                    <div className="space-y-2">
                      <div className="h-3 w-24 rounded bg-stone-100" />
                      <div className="h-2 w-16 rounded bg-stone-100" />
                    </div>
                  </div>
                  <div className="h-5 w-2/3 rounded bg-stone-100 mb-3" />
                  <div className="space-y-2">
                    <div className="h-3 rounded bg-stone-100" />
                    <div className="h-3 rounded bg-stone-100" />
                    <div className="h-3 w-4/5 rounded bg-stone-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {pinnedPosts.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Pin size={13} className="text-amber-700" />
                    <span className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">
                      Pinned
                    </span>
                  </div>
                  <div className="space-y-4">
                    {pinnedPosts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        reacted={Boolean(reactions[post.id])}
                        onReact={() => handleReact(post.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {regularPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    reacted={Boolean(reactions[post.id])}
                    onReact={() => handleReact(post.id)}
                  />
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-16">
                  <p className="font-serif text-xl text-stone-400">No posts in this category yet.</p>
                  <p className="text-sm font-sans text-stone-400 mt-2">Be the first to share.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function PostCard({
  post,
  reacted,
  onReact,
}: {
  post: CommunityPostRecord;
  reacted: boolean;
  onReact: () => void;
}) {
  return (
    <div className="bg-white border border-stone-200/80 rounded-sm p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
            <span className="font-serif text-sm text-amber-800">{post.author_name[0]}</span>
          </div>
          <div>
            <p className="text-sm font-sans font-medium text-stone-700">{post.author_name}</p>
            <p className="text-xs font-sans text-stone-400">{timeAgo(post.created_at)}</p>
          </div>
        </div>
        <span className={`text-2xs font-sans font-medium px-2.5 py-1 rounded-sm border ${categoryColors[post.category]}`}>
          {post.category}
        </span>
      </div>

      <h3 className="font-serif text-lg text-stone-800 mb-3">{post.title}</h3>
      <p className="text-sm font-sans font-light text-stone-500 leading-relaxed mb-5">{post.body}</p>

      <div className="flex items-center gap-5 pt-4 border-t border-stone-100">
        <button
          onClick={onReact}
          className={`flex items-center gap-1.5 text-xs font-sans transition-colors ${
            reacted ? 'text-amber-700' : 'text-stone-400 hover:text-amber-700'
          }`}
        >
          <Heart size={14} className={reacted ? 'fill-amber-700' : ''} />
          {post.reactions}
        </button>
        <div className="flex items-center gap-1.5 text-xs font-sans text-stone-400">
          <MessageCircle size={14} />
          {post.comment_count}
        </div>
      </div>
    </div>
  );
}
