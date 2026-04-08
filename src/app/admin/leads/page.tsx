'use client';
import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { createClient } from '@/lib/supabase/client';
import { Search, Edit2, Trash2 } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  source: string;
  lead_status: 'new' | 'contacted' | 'converted' | 'lost';
  notes?: string | null;
  created_at: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();

    const supabase = createClient();
    const channel = supabase
      .channel('leads_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setLeads((prev) => [payload.new as Lead, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setLeads((prev) =>
            prev.map((l) => (l.id === (payload.new as Lead).id ? (payload.new as Lead) : l))
          );
        } else if (payload.eventType === 'DELETE') {
          setLeads((prev) => prev.filter((l) => l.id !== (payload.old as Lead).id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const supabase = createClient();

    console.log('[AdminLeads] Fetching leads from Supabase...');

    const { data, error, status, statusText } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('[AdminLeads] Fetch response — status:', status, statusText);
    console.log('[AdminLeads] Fetch response — data:', data);
    console.log('[AdminLeads] Fetch response — error:', error);

    if (error) {
      console.error('[AdminLeads] Leads fetch FAILED:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
    }

    if (!error && data) {
      console.log('[AdminLeads] Loaded', data.length, 'leads');
      setLeads(data as Lead[]);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: Lead['lead_status']) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('leads')
      .update({ lead_status: status })
      .eq('id', id);
    if (!error) {
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, lead_status: status } : l)));
    }
  };

  const filtered = leads.filter((l) => {
    const matchSearch =
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || l.lead_status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center justify-between">
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Admin</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Leads</p>
          </div>
        </div>
        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto space-y-6">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-base pl-9"
              />
            </div>
            <div className="flex gap-2">
              {[null, 'new', 'contacted', 'converted', 'lost'].map((s) => (
                <button
                  key={String(s)}
                  onClick={() => setStatusFilter(s)}
                  className={`text-xs font-sans font-medium px-3 py-2 rounded-sm border transition-colors capitalize ${
                    statusFilter === s
                      ? 'bg-amber-800 text-amber-50 border-amber-800' :'bg-white text-stone-600 border-stone-200 hover:border-amber-300'
                  }`}
                >
                  {s || 'All'}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white border border-stone-200/80 rounded-sm overflow-hidden">
            {loading ? (
              <div className="px-5 py-10 text-center text-sm font-sans text-stone-400">Loading leads...</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50">
                    {['Name', 'Email', 'Phone', 'Source', 'Status', 'Date', 'Actions'].map((h) => (
                      <th
                        key={h}
                        className="text-left text-xs font-sans font-medium text-stone-400 uppercase tracking-widest px-5 py-3"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-sm font-sans text-stone-400">
                        No leads found.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((lead) => (
                      <tr key={lead.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="px-5 py-3.5 font-sans font-medium text-stone-700">{lead.name}</td>
                        <td className="px-5 py-3.5 font-sans text-stone-500">{lead.email}</td>
                        <td className="px-5 py-3.5 font-sans text-stone-400 text-xs">{lead.phone || '—'}</td>
                        <td className="px-5 py-3.5 font-sans text-stone-500">{lead.source}</td>
                        <td className="px-5 py-3.5">
                          <select
                            value={lead.lead_status}
                            onChange={(e) => updateStatus(lead.id, e.target.value as Lead['lead_status'])}
                            className="text-xs font-sans border border-stone-200 rounded-sm px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40"
                          >
                            {['new', 'contacted', 'converted', 'lost'].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-5 py-3.5 font-sans text-stone-400 text-xs">
                          {new Date(lead.created_at).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button className="text-stone-400 hover:text-amber-700 transition-colors">
                              <Edit2 size={14} />
                            </button>
                            <button className="text-stone-400 hover:text-red-600 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
