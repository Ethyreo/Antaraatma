import React from 'react';

// Backend integration point: fetch testimonials from /api/testimonials?featured=true&limit=4
const testimonials = [
  {
    id: 'testimonial-priya-sharma',
    name: 'Priya Sharma',
    location: 'Mumbai',
    program: 'Transformation Mastery',
    rating: 5,
    quote: 'After six months with Dr. Vijay, my autoimmune markers dropped to normal for the first time in four years. This is not a wellness course. It is a genuine healing education.',
    outcome: 'Autoimmune recovery',
  },
  {
    id: 'testimonial-arjun-mehta',
    name: 'Arjun Mehta',
    location: 'Bangalore',
    program: 'Foundation Course',
    rating: 5,
    quote: 'The Foundation Course changed how I think about food, sleep, and stress entirely. I lost 14kg, but more importantly I understand why it happened and how to sustain it.',
    outcome: '14kg weight release',
  },
  {
    id: 'testimonial-kavitha-nair',
    name: 'Kavitha Nair',
    location: 'Kochi',
    program: 'Foundation Course',
    rating: 5,
    quote: 'I was sceptical of online programs. But the structure here — the lessons, the live sessions, the community — made it feel like being in a real clinic. Deeply grateful.',
    outcome: 'Hormonal balance restored',
  },
  {
    id: 'testimonial-rohan-desai',
    name: 'Rohan Desai',
    location: 'Pune',
    program: 'Awareness Session',
    rating: 5,
    quote: 'I booked the Awareness Session out of curiosity. Within 90 minutes I had a clearer picture of my body than I had from years of doctor visits. Enrolled in Foundation immediately.',
    outcome: 'Enrolled → Foundation Course',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-28 bg-stone-900">
      <div className="editorial-container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-px bg-amber-600/60" />
              <span className="text-xs font-sans font-500 uppercase tracking-[0.12em] text-amber-600/80">
                Student Stories
              </span>
            </div>
            <h2 className="font-serif text-display-md text-stone-100 text-balance">
              What transformation looks like
            </h2>
          </div>
          <p className="text-sm font-sans font-300 text-stone-500 max-w-sm text-balance">
            Real outcomes from real students — shared with their permission, in their own words.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-stone-800">
          {testimonials?.map((t) => (
            <div key={t?.id} className="bg-stone-900 p-8 xl:p-9 flex flex-col gap-6 hover:bg-stone-800/60 transition-colors duration-300">
              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {Array.from({ length: t?.rating })?.map((_, si) => (
                  <span key={`star-${t?.id}-${si + 1}`} className="text-amber-500 text-sm">★</span>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="font-serif text-base text-stone-300 leading-relaxed flex-1 italic">
                &ldquo;{t?.quote}&rdquo;
              </blockquote>

              {/* Outcome badge */}
              <div className="inline-flex items-center self-start gap-1.5 bg-amber-900/30 border border-amber-700/30 px-3 py-1 rounded-sm">
                <span className="w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                <span className="text-xs font-sans font-500 text-amber-400">{t?.outcome}</span>
              </div>

              {/* Author */}
              <div className="border-t border-stone-800 pt-5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-900/50 flex items-center justify-center shrink-0">
                  <span className="font-serif text-sm text-amber-400">{t?.name?.[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-sans font-500 text-stone-300">{t?.name}</p>
                  <p className="text-xs font-sans text-stone-600">{t?.location} · {t?.program}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}