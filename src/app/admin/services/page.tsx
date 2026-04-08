'use client';
import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { mockServices } from '@/lib/data/mockData';
import type { Service } from '@/lib/data/types';
import { Plus, Edit2, Trash2, Star, Eye, EyeOff } from 'lucide-react';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>(mockServices);

  const toggleStatus = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'published' ? 'unpublished' : 'published' } : s));
  };

  const toggleFeatured = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, featured: !s.featured } : s));
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center justify-between">
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Admin</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Services</p>
          </div>
          <button className="btn-primary text-xs py-2 px-4"><Plus size={13} />New Service</button>
        </div>
        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto space-y-4">
          {services.map(service => (
            <div key={service.id} className="bg-white border border-stone-200/80 rounded-sm p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-serif text-lg text-stone-800">{service.title}</h3>
                    <span className={`text-2xs font-sans font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm border ${service.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-stone-100 text-stone-600 border-stone-200'}`}>{service.status}</span>
                    {service.featured && <span className="text-2xs font-sans font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-sm">Featured</span>}
                  </div>
                  <p className="text-sm font-sans font-light text-stone-500 leading-relaxed">{service.summary}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleFeatured(service.id)} className={`p-2 rounded-sm border transition-colors ${service.featured ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-stone-400 bg-white border-stone-200 hover:border-amber-300'}`}>
                    <Star size={14} className={service.featured ? 'fill-amber-500' : ''} />
                  </button>
                  <button onClick={() => toggleStatus(service.id)} className="p-2 rounded-sm border border-stone-200 text-stone-400 hover:text-amber-700 hover:border-amber-300 transition-colors bg-white">
                    {service.status === 'published' ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button className="p-2 rounded-sm border border-stone-200 text-stone-400 hover:text-amber-700 hover:border-amber-300 transition-colors bg-white">
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
