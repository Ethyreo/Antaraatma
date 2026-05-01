'use client';
import React, { useEffect, useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  source: string;
  lead_status: string;
  notes: string | null;
  created_at: string;
}

const statusConfig: Record<string, { label: string; classes: string }> = {
  new: { label: 'New', classes: 'bg-amber-100 text-amber-800' },
  contacted: { label: 'Contacted', classes: 'bg-blue-100 text-blue-700' },
  converted: { label: 'Converted', classes: 'bg-green-100 text-green-700' },
  lost: { label: 'Lost', classes: 'bg-stone-100 text-stone-600' },
};

export default function LeadPipelineTable() {
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'converted' | 'lost'>('all');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchLeads() {
      try {
        let query = supabase
          .from('leads')
          .select('id, name, email, phone, source, lead_status, notes, created_at')
          .order('created_at', { ascending: false })
          .limit(10);

        if (filter !== 'all') {
          query = query.eq('lead_status', filter);
        }

        const { data } = await query;
        setLeads(data ?? []);
      } catch (err) {
        console.error('LeadPipeline fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeads();
  }, [filter]);

  const filtered = leads;

  return (
    <div className="card-base overflow-hidden">
      <div className="p-5 border-b border-stone-100 flex items-center justify-between gap-3">
        <div>
          <p className="section-label mb-0.5">Lead Pipeline</p>
          <p className="text-xs font-sans text-stone-500">{leads.length} leads</p>
        </div>
        <div className="flex items-center gap-1">
          {(['all', 'new', 'contacted', 'converted', 'lost'] as const).map((f) => (
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
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5 animate-pulse">
              <div className="w-7 h-7 rounded-full bg-stone-200 shrink-0" />
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-stone-200 rounded w-1/3" />
                <div className="h-3 bg-stone-100 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="px-5 py-6 text-center">
            <p className="text-xs font-sans text-stone-400">No leads found.</p>
          </div>
        ) : (
          filtered.map((lead) => {
            const sc = statusConfig[lead.lead_status] ?? { label: lead.lead_status, classes: 'bg-stone-100 text-stone-600' };
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
                  <p className="text-xs font-sans text-stone-500 truncate">via {lead.source}</p>
                  <p className="text-2xs font-sans text-stone-400">{new Date(lead.created_at).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => toast.success(`Opening email to ${lead.name}`)}
                    className="p-1.5 text-stone-400 hover:text-amber-700 hover:bg-amber-50 rounded-sm transition-colors"
                    title={`Email ${lead.name}`}
                  >
                    <Mail size={13} />
                  </button>
                  {lead.phone && (
                    <button
                      onClick={() => toast.success(`Calling ${lead.phone}`)}
                      className="p-1.5 text-stone-400 hover:text-green-600 hover:bg-green-50 rounded-sm transition-colors"
                      title={`Call ${lead.name}`}
                    >
                      <Phone size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="p-4 border-t border-stone-100">
        <button className="w-full text-xs font-sans font-500 text-amber-700 hover:text-amber-800 transition-colors">
          View all leads →
        </button>
      </div>
    </div>
  );
}