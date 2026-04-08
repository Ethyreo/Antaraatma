'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import { getBlogPostBySlug, getRelatedPosts } from '@/lib/data/mockData';
import Link from 'next/link';
import { Clock, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BlogArticlePage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : '';
  const post = getBlogPostBySlug(slug);
  const related = post ? getRelatedPosts(post) : [];

  if (!post) {
    return (
      <main className="bg-[#FAF8F4] min-h-screen">
        <PublicNav />
        <div className="editorial-container pt-40 pb-20 text-center">
          <h1 className="font-serif text-display-md text-stone-900 mb-6">Article not found</h1>
          <Link href="/blog" className="btn-primary">← Back to Journal</Link>
        </div>
        <PublicFooter />
      </main>
    );
  }

  return (
    <main className="bg-[#FAF8F4] min-h-screen">
      <PublicNav />

      {/* Article Header */}
      <article className="pt-32 pb-20">
        <div className="editorial-container">
          <div className="max-w-3xl mx-auto">
            {/* Back */}
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-sans text-stone-400 hover:text-amber-700 transition-colors mb-12">
              <ArrowLeft size={14} />
              Back to Journal
            </Link>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link href={`/blog/category/${post.categorySlug}`} className="text-xs font-sans font-medium text-amber-700 uppercase tracking-widest hover:text-amber-800 transition-colors">
                {post.categoryName}
              </Link>
              <span className="text-stone-300">·</span>
              <span className="flex items-center gap-1.5 text-xs font-sans text-stone-400">
                <Calendar size={11} />
                {formatDate(post.publishedAt)}
              </span>
              <span className="text-stone-300">·</span>
              <span className="flex items-center gap-1.5 text-xs font-sans text-stone-400">
                <Clock size={11} />
                {post.readTimeMinutes} min read
              </span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-display-md text-stone-900 text-balance leading-[1.08] mb-8">{post.title}</h1>

            {/* Author */}
            <div className="flex items-center gap-3 mb-12 pb-8 border-b border-stone-200/60">
              <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center">
                <span className="font-serif text-sm text-amber-800">V</span>
              </div>
              <div>
                <p className="text-sm font-sans font-medium text-stone-700">{post.authorName}</p>
                <p className="text-xs font-sans text-stone-400">Naturopath · Healing Guide</p>
              </div>
            </div>

            {/* Cover Image */}
            {post.coverImageUrl && (
              <div className="aspect-video rounded-sm overflow-hidden mb-12">
                <img src={post.coverImageUrl} alt={post.coverImageAlt || post.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Body */}
            <div className="prose prose-stone prose-lg max-w-none
              prose-headings:font-serif prose-headings:font-normal prose-headings:text-stone-900
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-stone-600 prose-p:leading-relaxed prose-p:font-light
              prose-strong:text-stone-800 prose-strong:font-medium
              prose-li:text-stone-600 prose-li:font-light
              prose-a:text-amber-700 prose-a:no-underline hover:prose-a:text-amber-800
            ">
              {post.body.split('\n\n').map((para, i) => {
                if (para.startsWith('## ')) {
                  return <h2 key={i}>{para.replace('## ', '')}</h2>;
                }
                if (para.startsWith('### ')) {
                  return <h3 key={i}>{para.replace('### ', '')}</h3>;
                }
                if (para.startsWith('**') && para.endsWith('**')) {
                  return <p key={i}><strong>{para.replace(/\*\*/g, '')}</strong></p>;
                }
                return <p key={i}>{para}</p>;
              })}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-stone-200/60">
              {post.tags.map(tag => (
                <Link key={tag} href={`/blog/tag/${post.tagSlugs[post.tags.indexOf(tag)]}`} className="text-xs font-sans font-medium text-stone-500 bg-stone-100 hover:bg-amber-50 hover:text-amber-700 border border-stone-200 hover:border-amber-200 px-3 py-1.5 rounded-sm transition-colors">
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>

      {/* CTA Block */}
      <section className="py-16 bg-stone-900">
        <div className="editorial-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-2xl text-stone-100 mb-4 text-balance">Ready to begin your healing journey?</h2>
            <p className="text-sm font-sans font-light text-stone-400 mb-8">Join the free Awareness Session and discover what your body has been trying to tell you.</p>
            <Link href="/awareness-session" className="btn-primary">
              Join the Free Session
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="py-16 bg-[#FAF8F4] border-t border-stone-200/60">
          <div className="editorial-container">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-px bg-amber-700/40" />
              <span className="section-label">Related Articles</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map(rp => (
                <Link key={rp.id} href={`/blog/${rp.slug}`} className="group bg-white border border-stone-200/80 rounded-sm overflow-hidden hover:shadow-card-hover transition-all duration-300">
                  {rp.coverImageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img src={rp.coverImageUrl} alt={rp.coverImageAlt || rp.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-2xs font-sans font-medium text-amber-700 uppercase tracking-widest mb-3">{rp.categoryName}</p>
                    <h3 className="font-serif text-base text-stone-900 group-hover:text-amber-800 transition-colors text-balance">{rp.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <PublicFooter />
    </main>
  );
}
