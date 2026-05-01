'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PublicNav from '@/components/PublicNav';
import PublicFooter from '@/components/PublicFooter';
import Link from 'next/link';
import { Clock, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_image_url?: string;
  cover_image_alt?: string;
  author_name: string;
  published_at?: string;
  read_time_minutes: number;
  blog_categories?: { id: string; name: string; slug: string };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

function renderBody(body: string) {
  return body.split('\n\n').map((para, i) => {
    if (para.startsWith('## ')) return <h2 key={i}>{para.replace('## ', '')}</h2>;
    if (para.startsWith('### ')) return <h3 key={i}>{para.replace('### ', '')}</h3>;
    if (para.startsWith('> ')) return <blockquote key={i}>{para.replace('> ', '')}</blockquote>;
    if (para.startsWith('- ')) {
      const items = para.split('\n').filter(l => l.startsWith('- ')).map(l => l.replace('- ', ''));
      return <ul key={i}>{items.map((item, j) => <li key={j}>{item}</li>)}</ul>;
    }
    const withBold = para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const withItalic = withBold.replace(/_(.*?)_/g, '<em>$1</em>');
    return <p key={i} dangerouslySetInnerHTML={{ __html: withItalic }} />;
  });
}

export default function BlogArticlePage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : '';
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/blog?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(json => {
        if (json.data && json.data.id) {
          setPost(json.data);
          // Fetch related posts from same category
          if (json.data.category_id) {
            fetch(`/api/blog?status=published`)
              .then(r => r.json())
              .then(all => {
                if (all.data) {
                  const rel = (all.data as BlogPost[])
                    .filter((p: BlogPost) => p.id !== json.data.id)
                    .slice(0, 3);
                  setRelated(rel);
                }
              });
          }
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <main className="bg-[#FAF8F4] min-h-screen">
        <PublicNav />
        <div className="editorial-container pt-40 pb-20 text-center">
          <p className="font-serif text-xl text-stone-400">Loading article…</p>
        </div>
        <PublicFooter />
      </main>
    );
  }

  if (notFound || !post) {
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

      <article className="pt-32 pb-20">
        <div className="editorial-container">
          <div className="max-w-3xl mx-auto">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-sans text-stone-400 hover:text-amber-700 transition-colors mb-12">
              <ArrowLeft size={14} />Back to Journal
            </Link>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              {post.blog_categories && (
                <Link href={`/blog/category/${post.blog_categories.slug}`} className="text-xs font-sans font-medium text-amber-700 uppercase tracking-widest hover:text-amber-800 transition-colors">
                  {post.blog_categories.name}
                </Link>
              )}
              {post.published_at && (
                <>
                  <span className="text-stone-300">·</span>
                  <span className="flex items-center gap-1.5 text-xs font-sans text-stone-400">
                    <Calendar size={11} />{formatDate(post.published_at)}
                  </span>
                </>
              )}
              <span className="text-stone-300">·</span>
              <span className="flex items-center gap-1.5 text-xs font-sans text-stone-400">
                <Clock size={11} />{post.read_time_minutes} min read
              </span>
            </div>

            <h1 className="font-serif text-display-md text-stone-900 text-balance leading-[1.08] mb-8">{post.title}</h1>

            <div className="flex items-center gap-3 mb-12 pb-8 border-b border-stone-200/60">
              <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center">
                <span className="font-serif text-sm text-amber-800">{post.author_name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-sm font-sans font-medium text-stone-700">{post.author_name}</p>
                <p className="text-xs font-sans text-stone-400">Naturopath · Healing Guide</p>
              </div>
            </div>

            {post.cover_image_url && (
              <div className="aspect-video rounded-sm overflow-hidden mb-12">
                <img src={post.cover_image_url} alt={post.cover_image_alt || post.title} className="w-full h-full object-cover" />
              </div>
            )}

            <div className="prose prose-stone prose-lg max-w-none
              prose-headings:font-serif prose-headings:font-normal prose-headings:text-stone-900
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-stone-600 prose-p:leading-relaxed prose-p:font-light
              prose-strong:text-stone-800 prose-strong:font-medium
              prose-li:text-stone-600 prose-li:font-light
              prose-a:text-amber-700 prose-a:no-underline hover:prose-a:text-amber-800
              prose-blockquote:border-l-amber-300 prose-blockquote:text-stone-500
            ">
              {renderBody(post.body)}
            </div>
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="py-16 bg-stone-900">
        <div className="editorial-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-2xl text-stone-100 mb-4 text-balance">Ready to begin your healing journey?</h2>
            <p className="text-sm font-sans font-light text-stone-400 mb-8">Join the free Awareness Session and discover what your body has been trying to tell you.</p>
            <Link href="/awareness-session" className="btn-primary">
              Join the Free Session<ArrowRight size={15} />
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
                  {rp.cover_image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img src={rp.cover_image_url} alt={rp.cover_image_alt || rp.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-2xs font-sans font-medium text-amber-700 uppercase tracking-widest mb-3">{rp.blog_categories?.name}</p>
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
