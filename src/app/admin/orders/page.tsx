'use client';
import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

interface Order {
  id: string;
  amount: number;
  currency: string;
  order_status: string;
  payment_type: string;
  payment_provider: string | null;
  payment_ref: string | null;
  created_at: string;
  user_profiles: { full_name: string; email: string } | null;
  programs: { title: string } | null;
}

const statusColors: Record<string, string> = {
  paid: 'bg-green-50 text-green-700 border-green-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
  refunded: 'bg-stone-100 text-stone-600 border-stone-200',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    async function fetchOrders() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('id, amount, currency, order_status, payment_type, payment_provider, payment_ref, created_at, user_profiles(full_name, email), programs(title)')
          .order('created_at', { ascending: false });
        if (!error) setOrders((data ?? []) as unknown as Order[]);
      } catch (err) {
        console.error('Orders fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const totalRevenue = orders.filter(o => o.order_status === 'paid').reduce((sum, o) => sum + Number(o.amount), 0);
  const paidCount = orders.filter(o => o.order_status === 'paid').length;

  return (
    <div className="flex min-h-screen" style={{ background: '#F4EFE6' }}>
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center">
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Admin</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Orders</p>
          </div>
        </div>
        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-stone-400">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm font-sans">Loading…</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-stone-200/80 rounded-sm p-5">
                  <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest mb-2">Total Revenue</p>
                  <p className="font-serif text-2xl text-stone-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-white border border-stone-200/80 rounded-sm p-5">
                  <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest mb-2">Total Orders</p>
                  <p className="font-serif text-2xl text-stone-900">{orders.length}</p>
                </div>
                <div className="bg-white border border-stone-200/80 rounded-sm p-5">
                  <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest mb-2">Paid Orders</p>
                  <p className="font-serif text-2xl text-stone-900">{paidCount}</p>
                </div>
              </div>
              <div className="bg-white border border-stone-200/80 rounded-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stone-100 bg-stone-50">
                      {['Order ID', 'Student', 'Program', 'Amount', 'Type', 'Status', 'Date'].map(h => (
                        <th key={h} className="text-left text-xs font-sans font-medium text-stone-400 uppercase tracking-widest px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-10 text-center text-sm font-sans text-stone-400">No orders yet.</td>
                      </tr>
                    ) : orders.map(order => (
                      <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="px-5 py-3.5 font-sans text-stone-400 text-xs">{order.id.slice(0, 8)}…</td>
                        <td className="px-5 py-3.5">
                          <p className="font-sans font-medium text-stone-700 text-sm">{order.user_profiles?.full_name ?? '—'}</p>
                          <p className="font-sans text-stone-400 text-xs">{order.user_profiles?.email ?? ''}</p>
                        </td>
                        <td className="px-5 py-3.5 font-sans text-stone-500">{order.programs?.title ?? '—'}</td>
                        <td className="px-5 py-3.5 font-sans font-medium text-stone-800">₹{Number(order.amount).toLocaleString('en-IN')}</td>
                        <td className="px-5 py-3.5 font-sans text-stone-500 text-xs capitalize">{order.payment_type.replace('_', ' ')}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-2xs font-sans font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm border ${statusColors[order.order_status] ?? 'bg-stone-100 text-stone-600 border-stone-200'}`}>
                            {order.order_status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-sans text-stone-400 text-xs">{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
