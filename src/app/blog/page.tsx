'use client';
import React, { useState, useMemo, useEffect } from 'react';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import Link from 'next/link';
import { Search, Clock, Calendar } from 'lucide-react';

interface Category { id: string; name: string; slug: string; }
interface Tag { id: string; name: string; slug: string; }
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url?: string;
  cover_image_alt?: string;
  author_name: string;
  category_id: string;
  published_at?: string;
  status: string;
  featured: boolean;
  read_time_minutes: number;
  blog_categories?: { id: string; name: string; slug: string };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/blog?status=published').then(r => r.json()),
      fetch('/api/blog/categories').then(r => r.json()),
      fetch('/api/blog/tags').then(r => r.json()),
    ]).then(([postsData, catsData, tagsData]) => {
      if (postsData.data) setPosts(postsData.data);
      if (catsData.data) setCategories(catsData.data);
      if (tagsData.data) setTags(tagsData.data);
    }).finally(() => setLoading(false));
  }, []);

  const featuredPost = posts.find(p => p.featured);

  const filtered = useMemo(() => {
    return posts.filter(p => {
      if (p.featured) return false;
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchCat = !activeCategory || p.blog_categories?.slug === activeCategory;
      return matchSearch && matchCat;
    });
  }, [posts, search, activeCategory]);

  return (
    <main style={{ background: '#F4EFE6' }} className="min-h-screen">
      <PublicNav />

      {/* Hero */}
      <section className="pt-32 pb-16" style={{ background: '#F4EFE6' }}>
        <div className="editorial-container">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px" style={{ background: '#1A6B6B', opacity: 0.4 }} />
              <span className="section-label">The Journal</span>
            </div>
            <h1 className="font-serif text-display-lg text-balance leading-[1.08] mb-6" style={{ color: '#1A6B6B', fontWeight: 300, letterSpacing: '0.04em' }}>
              Healing, understood.
            </h1>
            <p className="text-lg font-sans font-light leading-relaxed max-w-prose" style={{ color: 'rgba(36,44,44,0.55)', fontWeight: 300 }}>
              Insights on naturopathy, nutrition, breathwork, emotional healing, and the science of lasting transformation — from Dr. Vijay Singla.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {!loading && featuredPost && (
        <section className="py-12" style={{ background: '#D4EDE8', borderTop: '1px solid rgba(26,107,107,0.1)', borderBottom: '1px solid rgba(26,107,107,0.1)' }}>
          <div className="editorial-container">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px" style={{ background: '#1A6B6B', opacity: 0.4 }} />
              <span className="section-label">Featured Article</span>
            </div>
            <Link href={`/blog/${featuredPost.slug}`} className="group grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-sm overflow-hidden hover:shadow-card-hover transition-all duration-300" style={{ border: '1px solid rgba(168,216,206,0.5)' }}>
              {featuredPost.cover_image_url && (
                <div className="aspect-video lg:aspect-auto overflow-hidden">
                  <img src={featuredPost.cover_image_url} alt={featuredPost.cover_image_alt || featuredPost.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                </div>
              )}
              <div className="p-8 lg:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-sans uppercase tracking-widest" style={{ color: '#3A7A5A', fontWeight: 600 }}>{featuredPost.blog_categories?.name}</span>
                  <span style={{ color: 'rgba(26,107,107,0.2)' }}>·</span>
                  <span className="flex items-center gap-1 text-xs font-sans" style={{ color: 'rgba(36,44,44,0.4)' }}>
                    <Clock size={11} />{featuredPost.read_time_minutes} min read
                  </span>
                </div>
                <h2 className="font-serif text-2xl mb-4 text-balance transition-colors" style={{ color: '#1A6B6B', fontWeight: 300, letterSpacing: '0.04em' }}>{featuredPost.title}</h2>
                <p className="text-sm font-sans font-light leading-relaxed mb-6" style={{ color: 'rgba(36,44,44,0.5)', fontWeight: 300 }}>{featuredPost.excerpt}</p>
                <div className="flex items-center gap-3">
                  <p className="text-xs font-sans" style={{ color: 'rgba(36,44,44,0.6)', fontWeight: 500 }}>{featuredPost.author_name}</p>
                  {featuredPost.published_at && (
                    <>
                      <span style={{ color: 'rgba(26,107,107,0.2)' }}>·</span>
                      <p className="text-xs font-sans" style={{ color: 'rgba(36,44,44,0.4)' }}>{formatDate(featuredPost.published_at)}</p>
                    </>
                  )}
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="py-10" style={{ background: '#F4EFE6', borderBottom: '1px solid rgba(26,107,107,0.08)' }}>
        <div className="editorial-container">
          <div className="relative max-w-md mb-6">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(26,107,107,0.4)' }} />
            <input type="text" placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} className="input-base pl-9" />
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => setActiveCategory(null)}
              className="text-xs font-sans px-3 py-1.5 rounded-sm border transition-colors"
              style={!activeCategory ? { background: '#1A6B6B', color: '#F4EFE6', borderColor: '#1A6B6B', fontWeight: 600 } : { background: 'white', color: 'rgba(36,44,44,0.6)', borderColor: 'rgba(168,216,206,0.5)', fontWeight: 400 }}
            >All Topics</button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.slug ? null : cat.slug)}
                className="text-xs font-sans px-3 py-1.5 rounded-sm border transition-colors"
                style={activeCategory === cat.slug ? { background: '#1A6B6B', color: '#F4EFE6', borderColor: '#1A6B6B', fontWeight: 600 } : { background: 'white', color: 'rgba(36,44,44,0.6)', borderColor: 'rgba(168,216,206,0.5)', fontWeight: 400 }}
              >{cat.name}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => setActiveTag(activeTag === tag.slug ? null : tag.slug)}
                className="text-2xs font-sans px-2.5 py-1 rounded-sm border transition-colors"
                style={activeTag === tag.slug ? { background: '#242C2C', color: '#A8D8CE', borderColor: '#242C2C', fontWeight: 500 } : { background: 'transparent', color: 'rgba(36,44,44,0.45)', borderColor: 'rgba(168,216,206,0.4)', fontWeight: 400 }}
              >#{tag.name}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Post Listing */}
      <section className="py-16" style={{ background: '#F4EFE6' }}>
        <div className="editorial-container">
          {loading ? (
            <div className="text-center py-16">
              <p className="font-serif text-xl" style={{ color: 'rgba(26,107,107,0.4)', fontWeight: 300 }}>Loading articles…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-serif text-xl" style={{ color: 'rgba(26,107,107,0.4)', fontWeight: 300 }}>No articles found.</p>
              <button onClick={() => { setSearch(''); setActiveCategory(null); setActiveTag(null); }} className="mt-4 text-sm font-sans transition-colors" style={{ color: '#1A6B6B', fontWeight: 500 }}>Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white rounded-sm overflow-hidden hover:shadow-card-hover transition-all duration-300 flex flex-col" style={{ border: '1px solid rgba(168,216,206,0.5)' }}>
                  {post.cover_image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img src={post.cover_image_url} alt={post.cover_image_alt || post.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xs font-sans uppercase tracking-widest" style={{ color: '#3A7A5A', fontWeight: 600 }}>{post.blog_categories?.name}</span>
                      <span style={{ color: 'rgba(26,107,107,0.2)' }}>·</span>
                      <span className="flex items-center gap-1 text-2xs font-sans" style={{ color: 'rgba(36,44,44,0.4)' }}><Clock size={10} />{post.read_time_minutes} min</span>
                    </div>
                    <h3 className="font-serif text-lg mb-3 text-balance flex-1" style={{ color: '#1A6B6B', fontWeight: 300, letterSpacing: '0.04em' }}>{post.title}</h3>
                    <p className="text-sm font-sans font-light leading-relaxed mb-5 line-clamp-3" style={{ color: 'rgba(36,44,44,0.5)', fontWeight: 300 }}>{post.excerpt}</p>
                    {post.published_at && (
                      <div className="flex items-center gap-2 pt-4" style={{ borderTop: '1px solid rgba(168,216,206,0.3)' }}>
                        <Calendar size={11} style={{ color: 'rgba(26,107,107,0.35)' }} />
                        <p className="text-xs font-sans" style={{ color: 'rgba(36,44,44,0.4)' }}>{formatDate(post.published_at)}</p>
                      </div>
                    )}
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
