'use client';
import React, { useEffect, useState } from 'react';
import { MessageSquare, Heart, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface CommunityPost {
  id: string;
  author_name: string;
  author_avatar_url: string | null;
  category: string;
  body: string;
  reactions: number;
  comment_count: number;
  created_at: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export default function CommunityPulse() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchPosts() {
      try {
        const { data } = await supabase
          .from('community_posts')
          .select('id, author_name, author_avatar_url, category, body, reactions, comment_count, created_at')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(4);
        setPosts(data ?? []);
      } catch (err) {
        console.error('CommunityPulse fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <div className="card-base overflow-hidden">
      <div className="p-5 border-b border-stone-100 flex items-center justify-between">
        <div>
          <p className="section-label mb-0.5">Community</p>
          <p className="text-xs font-sans text-stone-500">Recent discussions</p>
        </div>
        <Link href="/community" className="text-xs font-sans font-500 text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-1">
          Join community
          <ArrowRight size={11} />
        </Link>
      </div>
      <div className="divide-y divide-stone-100">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-5 animate-pulse">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-stone-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-stone-200 rounded w-1/3" />
                  <div className="h-3 bg-stone-100 rounded w-full" />
                  <div className="h-3 bg-stone-100 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))
        ) : posts.length === 0 ? (
          <div className="p-5 text-center">
            <p className="text-xs font-sans text-stone-400">No community posts yet. Be the first to share!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="p-5 hover:bg-stone-50/50 transition-colors cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="font-serif text-xs text-amber-800">{post.author_name?.[0] ?? '?'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-sans font-500 text-stone-700">{post.author_name}</span>
                    <span className="status-badge bg-stone-100 text-stone-500 text-2xs">{post.category}</span>
                    <span className="text-2xs font-sans text-stone-400 ml-auto">{timeAgo(post.created_at)}</span>
                  </div>
                  <p className="text-xs font-sans text-stone-600 leading-relaxed line-clamp-2">{post.body}</p>
                  <div className="flex items-center gap-4 mt-2.5">
                    <button className="flex items-center gap-1 text-2xs font-sans text-stone-400 hover:text-red-500 transition-colors">
                      <Heart size={11} />
                      {post.reactions}
                    </button>
                    <button className="flex items-center gap-1 text-2xs font-sans text-stone-400 hover:text-amber-700 transition-colors">
                      <MessageSquare size={11} />
                      {post.comment_count} replies
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}