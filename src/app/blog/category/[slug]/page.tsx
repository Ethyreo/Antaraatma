'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import { getPublishedBlogPosts, mockBlogCategories } from '@/lib/data/mockData';
import Link from 'next/link';
import { Clock, Calendar, ArrowLeft } from 'lucide-react';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BlogCategoryPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : '';
  const category = mockBlogCategories.find(c => c.slug === slug);
  const posts = getPublishedBlogPosts().filter(p => p.categorySlug === slug);

  return (
    <main className="bg-[#FAF8F4] min-h-screen">
      <PublicNav />
      <section className="pt-32 pb-16 bg-[#FAF8F4]">
        <div className="editorial-container">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-sans text-stone-400 hover:text-amber-700 transition-colors mb-10">
            <ArrowLeft size={14} />
            Back to Journal
          </Link>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-amber-700/40" />
              <span className="section-label">Category</span>
            </div>
            <h1 className="font-serif text-display-md text-stone-900 text-balance leading-[1.1] mb-4">
              {category?.name || slug}
            </h1>
            {category?.description && (
              <p className="text-base font-sans font-light text-stone-500 leading-relaxed">{category.description}</p>
            )}
          </div>
        </div>
      </section>
      <section className="py-12 bg-[#FAF8F4]">
        <div className="editorial-container">
          {posts.length === 0 ? (
            <p className="font-serif text-xl text-stone-400">No articles in this category yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-white border border-stone-200/80 rounded-sm overflow-hidden hover:shadow-card-hover transition-all duration-300 flex flex-col">
                  {post.coverImageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img src={post.coverImageUrl} alt={post.coverImageAlt || post.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center gap-1 text-2xs font-sans text-stone-400"><Clock size={10} />{post.readTimeMinutes} min</span>
                      <span className="text-stone-300">·</span>
                      <span className="flex items-center gap-1 text-2xs font-sans text-stone-400"><Calendar size={10} />{formatDate(post.publishedAt)}</span>
                    </div>
                    <h3 className="font-serif text-lg text-stone-900 mb-3 text-balance group-hover:text-amber-800 transition-colors flex-1">{post.title}</h3>
                    <p className="text-sm font-sans font-light text-stone-500 leading-relaxed line-clamp-2">{post.excerpt}</p>
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
