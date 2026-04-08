import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Backend integration point: fetch from /api/blog?featured=true&limit=3
const posts = [
  {
    id: 'blog-why-detox-fails',
    category: 'Detoxification',
    title: 'Why most detox programs fail — and what to do instead',
    excerpt: 'The detox industry is built on misunderstanding. Here is what the body actually needs to clear metabolic waste, and why it cannot be rushed.',
    readTime: '7 min read',
    date: '28 Mar 2026',
  },
  {
    id: 'blog-sleep-healing',
    category: 'Sleep & Recovery',
    title: 'The healing window: what happens to your body between 10pm and 2am',
    excerpt: 'Naturopathy has long recognised the regenerative importance of early sleep. Modern research is now confirming exactly why — and the mechanisms are remarkable.',
    readTime: '9 min read',
    date: '19 Mar 2026',
  },
  {
    id: 'blog-gut-brain',
    category: 'Gut Health',
    title: 'The gut-brain axis: how your microbiome shapes your mood and mind',
    excerpt: 'Over 90% of serotonin is produced in the gut. Understanding this connection is not optional — it is foundational to mental and physical healing.',
    readTime: '11 min read',
    date: '8 Mar 2026',
  },
];

export default function BlogTeaser() {
  return (
    <section className="py-28 bg-[#FAF8F4]">
      <div className="editorial-container">
        {/* Header */}
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
          <Link
            href="/homepage"
            className="flex items-center gap-2 text-sm font-sans font-500 text-amber-800 hover:text-amber-900 transition-colors group"
          >
            All articles
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Posts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-10">
          {posts?.map((post) => (
            <article key={post?.id} className="group cursor-pointer">
              {/* Category */}
              <span className="section-label">{post?.category}</span>

              {/* Title */}
              <h3 className="font-serif text-xl text-stone-900 mt-3 mb-3 leading-snug group-hover:text-amber-800 transition-colors text-balance">
                {post?.title}
              </h3>

              {/* Excerpt */}
              <p className="text-sm font-sans font-300 text-stone-600 leading-relaxed mb-4 text-balance">
                {post?.excerpt}
              </p>

              {/* Meta */}
              <div className="flex items-center gap-3 pt-4 border-t border-stone-200">
                <span className="text-xs font-sans text-stone-500">{post?.date}</span>
                <span className="text-stone-300">·</span>
                <span className="text-xs font-sans text-stone-500">{post?.readTime}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}