'use client';
import React, { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

// Backend integration point: fetch from /api/admin/leads?status=open&limit=8
const leads = [
  { id: 'lead-001', name: 'Ananya Iyer', email: 'ananya.iyer@gmail.com', phone: '+91 98001 23456', source: 'Awareness Session', status: 'hot', lastContact: '2 hours ago', interest: 'Foundation Course' },
  { id: 'lead-002', name: 'Vikram Rao', email: 'vikram.rao@outlook.com', phone: '+91 97654 32109', source: 'Blog', status: 'warm', lastContact: '1 day ago', interest: 'Awareness Session' },
  { id: 'lead-003', name: 'Deepa Nambiar', email: 'd.nambiar@yahoo.com', phone: '+91 99887 76543', source: 'Referral', status: 'hot', lastContact: '3 hours ago', interest: 'Foundation Course' },
  { id: 'lead-004', name: 'Suresh Pillai', email: 'suresh.pillai@gmail.com', phone: '+91 96543 21098', source: 'Instagram', status: 'cold', lastContact: '5 days ago', interest: 'Awareness Session' },
  { id: 'lead-005', name: 'Kavya Menon', email: 'kavya.menon@proton.me', phone: '+91 98765 11223', source: 'Awareness Session', status: 'warm', lastContact: '2 days ago', interest: 'Mastery Program' },
  { id: 'lead-006', name: 'Rahul Tiwari', email: 'rahul.t@gmail.com', phone: '+91 97001 44556', source: 'Google Ads', status: 'cold', lastContact: '7 days ago', interest: 'Foundation Course' },
];

const statusConfig: Record<string, { label: string; classes: string }> = {
  hot: { label: 'Hot', classes: 'bg-red-100 text-red-700' },
  warm: { label: 'Warm', classes: 'bg-amber-100 text-amber-800' },
  cold: { label: 'Cold', classes: 'bg-blue-100 text-blue-700' },
};

export default function LeadPipelineTable() {
  const [filter, setFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all');

  const filtered = filter === 'all' ? leads : leads.filter((l) => l.status === filter);

  return (
    <div className="card-base overflow-hidden">
      <div className="p-5 border-b border-stone-100 flex items-center justify-between gap-3">
        <div>
          <p className="section-label mb-0.5">Lead Pipeline</p>
          <p className="text-xs font-sans text-stone-500">{leads.length} open leads</p>
        </div>
        <div className="flex items-center gap-1">
          {(['all', 'hot', 'warm', 'cold'] as const).map((f) => (
            <button
              key={`lead-filter-${f}`}
              onClick={() => setFilter(f)}
              className={`text-xs font-sans font-500 px-2.5 py-1 rounded-sm transition-all ${
                filter === f ? 'bg-amber-100 text-amber-800' : 'text-stone-500 hover:bg-stone-100'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-stone-100">
        {filtered.map((lead) => {
          const sc = statusConfig[lead.status];
          return (
            <div key={lead.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-stone-50 transition-colors group">
              <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                <span className="font-serif text-xs text-stone-600">{lead.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-sans font-500 text-stone-800">{lead.name}</span>
                  <span className={`status-badge text-2xs ${sc.classes}`}>{sc.label}</span>
                </div>
                <p className="text-xs font-sans text-stone-500 truncate">{lead.interest} · via {lead.source}</p>
                <p className="text-2xs font-sans text-stone-400">{lead.lastContact}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => toast.success(`Opening email to ${lead.name}`)}
                  className="p-1.5 text-stone-400 hover:text-amber-700 hover:bg-amber-50 rounded-sm transition-colors"
                  title={`Email ${lead.name}`}
                >
                  <Mail size={13} />
                </button>
                <button
                  onClick={() => toast.success(`Calling ${lead.phone}`)}
                  className="p-1.5 text-stone-400 hover:text-green-600 hover:bg-green-50 rounded-sm transition-colors"
                  title={`Call ${lead.name}`}
                >
                  <Phone size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-stone-100">
        <button className="w-full text-xs font-sans font-500 text-amber-700 hover:text-amber-800 transition-colors">
          View all leads →
        </button>
      </div>
    </div>
  );
}