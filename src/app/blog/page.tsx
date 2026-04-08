'use client';
import React, { useState, useMemo } from 'react';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import { getPublishedBlogPosts, getFeaturedBlogPost, mockBlogCategories, mockBlogTags } from '@/lib/data/mockData';
import Link from 'next/link';
import { Search, Clock, Calendar } from 'lucide-react';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BlogPage() {
  const allPosts = getPublishedBlogPosts();
  const featuredPost = getFeaturedBlogPost();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return allPosts.filter(p => {
      if (p.featured) return false; // featured shown separately
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchCat = !activeCategory || p.categorySlug === activeCategory;
      const matchTag = !activeTag || p.tagSlugs.includes(activeTag);
      return matchSearch && matchCat && matchTag;
    });
  }, [allPosts, search, activeCategory, activeTag]);

  return (
    <main className="bg-[#FAF8F4] min-h-screen">
      <PublicNav />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#FAF8F4]">
        <div className="editorial-container">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-amber-700/40" />
              <span className="section-label">The Journal</span>
            </div>
            <h1 className="font-serif text-display-lg text-stone-900 text-balance leading-[1.08] mb-6">
              Healing, understood.
            </h1>
            <p className="text-lg font-sans font-light text-stone-500 leading-relaxed max-w-prose">
              Insights on naturopathy, nutrition, breathwork, emotional healing, and the science of lasting transformation — from Dr. Vijay Singla.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-12 bg-stone-50 border-y border-stone-200/60">
          <div className="editorial-container">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-amber-700/40" />
              <span className="section-label">Featured Article</span>
            </div>
            <Link href={`/blog/${featuredPost.slug}`} className="group grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white border border-stone-200/80 rounded-sm overflow-hidden hover:shadow-card-hover transition-all duration-300">
              {featuredPost.coverImageUrl && (
                <div className="aspect-video lg:aspect-auto overflow-hidden">
                  <img src={featuredPost.coverImageUrl} alt={featuredPost.coverImageAlt || featuredPost.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                </div>
              )}
              <div className="p-8 lg:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-sans font-medium text-amber-700 uppercase tracking-widest">{featuredPost.categoryName}</span>
                  <span className="text-stone-300">·</span>
                  <span className="flex items-center gap-1 text-xs font-sans text-stone-400">
                    <Clock size={11} />
                    {featuredPost.readTimeMinutes} min read
                  </span>
                </div>
                <h2 className="font-serif text-2xl text-stone-900 mb-4 text-balance group-hover:text-amber-800 transition-colors">{featuredPost.title}</h2>
                <p className="text-sm font-sans font-light text-stone-500 leading-relaxed mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-3">
                  <p className="text-xs font-sans font-medium text-stone-600">{featuredPost.authorName}</p>
                  <span className="text-stone-300">·</span>
                  <p className="text-xs font-sans text-stone-400">{formatDate(featuredPost.publishedAt)}</p>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="py-10 bg-[#FAF8F4] border-b border-stone-200/60">
        <div className="editorial-container">
          {/* Search */}
          <div className="relative max-w-md mb-6">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-base pl-9"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`text-xs font-sans font-medium px-3 py-1.5 rounded-sm border transition-colors ${!activeCategory ? 'bg-amber-800 text-amber-50 border-amber-800' : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300'}`}
            >
              All Topics
            </button>
            {mockBlogCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.slug ? null : cat.slug)}
                className={`text-xs font-sans font-medium px-3 py-1.5 rounded-sm border transition-colors ${activeCategory === cat.slug ? 'bg-amber-800 text-amber-50 border-amber-800' : 'bg-white text-stone-600 border-stone-200 hover:border-amber-300'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {mockBlogTags.map(tag => (
              <button
                key={tag.id}
                onClick={() => setActiveTag(activeTag === tag.slug ? null : tag.slug)}
                className={`text-2xs font-sans font-medium px-2.5 py-1 rounded-sm border transition-colors ${activeTag === tag.slug ? 'bg-stone-800 text-stone-100 border-stone-800' : 'bg-transparent text-stone-500 border-stone-200 hover:border-stone-400'}`}
              >
                #{tag.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Post Listing */}
      <section className="py-16 bg-[#FAF8F4]">
        <div className="editorial-container">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-serif text-xl text-stone-400">No articles found.</p>
              <button onClick={() => { setSearch(''); setActiveCategory(null); setActiveTag(null); }} className="mt-4 text-sm font-sans text-amber-700 hover:text-amber-800">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white border border-stone-200/80 rounded-sm overflow-hidden hover:shadow-card-hover transition-all duration-300 flex flex-col">
                  {post.coverImageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img src={post.coverImageUrl} alt={post.coverImageAlt || post.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xs font-sans font-medium text-amber-700 uppercase tracking-widest">{post.categoryName}</span>
                      <span className="text-stone-300">·</span>
                      <span className="flex items-center gap-1 text-2xs font-sans text-stone-400">
                        <Clock size={10} />
                        {post.readTimeMinutes} min
                      </span>
                    </div>
                    <h3 className="font-serif text-lg text-stone-900 mb-3 text-balance group-hover:text-amber-800 transition-colors flex-1">{post.title}</h3>
                    <p className="text-sm font-sans font-light text-stone-500 leading-relaxed mb-5 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center gap-2 pt-4 border-t border-stone-100">
                      <Calendar size={11} className="text-stone-400" />
                      <p className="text-xs font-sans text-stone-400">{formatDate(post.publishedAt)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
