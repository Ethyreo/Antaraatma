'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  read_time_minutes: number;
  published_at?: string;
  blog_categories?: { name: string; slug: string };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BlogTeaser() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/api/blog?status=published&limit=3')
      .then(r => r.json())
      .then(json => { if (json.data) setPosts(json.data.slice(0, 3)); })
      .catch(() => {});
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="py-28 bg-[#FAF8F4]">
      <div className="editorial-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-px bg-amber-700/40" />
              <span className="section-label">Healing Intelligence</span>
            </div>
            <h2 className="font-serif text-display-md text-stone-900 text-balance">
              The knowledge behind the practice
            </h2>
          </div>
          <Link href="/blog" className="flex items-center gap-2 text-sm font-sans font-500 text-amber-800 hover:text-amber-900 transition-colors group">
            All articles
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-10">
          {posts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group cursor-pointer">
              <span className="section-label">{post.blog_categories?.name}</span>
              <h3 className="font-serif text-xl text-stone-900 mt-3 mb-3 leading-snug group-hover:text-amber-800 transition-colors text-balance">
                {post.title}
              </h3>
              <p className="text-sm font-sans font-300 text-stone-600 leading-relaxed mb-4 text-balance line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-stone-200">
                <span className="text-xs font-sans text-stone-500">
                  {post.published_at ? formatDate(post.published_at) : ''}
                </span>
                <span className="text-stone-300">·</span>
                <span className="text-xs font-sans text-stone-500">{post.read_time_minutes} min read</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}