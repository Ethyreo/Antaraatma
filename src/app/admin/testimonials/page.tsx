'use client';
import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { mockTestimonials } from '@/lib/data/mockData';
import type { Testimonial } from '@/lib/data/types';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(mockTestimonials);

  const toggleFeatured = (id: string) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, featured: !t.featured } : t));
  };

  const toggleStatus = (id: string) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'published' ? 'unpublished' : 'published' } : t));
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center justify-between">
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Admin</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Testimonials</p>
          </div>
          <button className="btn-primary text-xs py-2 px-4"><Plus size={13} />Add Testimonial</button>
        </div>
        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto space-y-4">
          {testimonials.map(t => (
            <div key={t.id} className="bg-white border border-stone-200/80 rounded-sm p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-sans font-medium text-stone-800">{t.name}</p>
                    {t.role && <p className="text-xs font-sans text-stone-400">{t.role}</p>}
                    <div className="flex gap-0.5">{Array.from({ length: t.rating }).map((_, i) => <span key={i} className="text-amber-500 text-xs">★</span>)}</div>
                    <span className={`text-2xs font-sans font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm border ${t.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-stone-100 text-stone-600 border-stone-200'}`}>{t.status}</span>
                    {t.featured && <span className="text-2xs font-sans font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm">Featured</span>}
                  </div>
                  <p className="text-sm font-sans font-light text-stone-500 leading-relaxed italic">&ldquo;{t.content}&rdquo;</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleFeatured(t.id)} className={`p-2 rounded-sm border transition-colors ${t.featured ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-stone-400 bg-white border-stone-200 hover:border-amber-300'}`}>
                    <Star size={14} className={t.featured ? 'fill-amber-500' : ''} />
                  </button>
                  <button onClick={() => toggleStatus(t.id)} className="p-2 rounded-sm border border-stone-200 text-stone-400 hover:text-amber-700 hover:border-amber-300 transition-colors bg-white">
                    <Edit2 size={14} />
                  </button>
                  <button className="p-2 rounded-sm border border-stone-200 text-stone-400 hover:text-red-600 hover:border-red-200 transition-colors bg-white">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
