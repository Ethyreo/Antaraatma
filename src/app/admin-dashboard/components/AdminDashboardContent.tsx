'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Users, BookOpen, FileText, ShoppingCart, Star, HelpCircle, MessageSquare, Bell, Package, Settings, TrendingUp, BarChart2, UserCheck, Layers, Globe } from 'lucide-react';

interface KPI {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ElementType;
}

interface SectionCount {
  label: string;
  href: string;
  icon: React.ElementType;
  count: number;
  color: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  source: string;
  lead_status: string;
  created_at: string;
}

interface Order {
  id: string;
  amount: number;
  order_status: string;
  payment_type: string;
  user_profiles: { full_name: string } | null;
  programs: { title: string } | null;
}

export default function AdminDashboardContent() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [sections, setSections] = useState<SectionCount[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchDashboard() {
      try {
        // Fetch all counts in parallel
        const [
          leadsApiRes,
          studentsApiRes,
          { count: serviceCount },
          { count: programCount },
          { count: resourceCount },
          { count: blogCount },
          { count: testimonialCount },
          { count: faqCount },
          { count: communityCount },
          { count: orderCount },
          { count: announcementCount },
          { count: shipmentCount },
          { data: paidOrders },
          { count: activeEnrollments },
          { count: newLeads },
          { count: publishedPosts },
          { data: recentLeads },
          { data: recentOrders },
        ] = await Promise.all([
          fetch('/api/leads').then(r => r.json()),
          fetch('/api/students').then(r => r.json()),
          supabase.from('services').select('*', { count: 'exact', head: true }),
          supabase.from('programs').select('*', { count: 'exact', head: true }),
          supabase.from('resources').select('*', { count: 'exact', head: true }),
          supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
          supabase.from('testimonials').select('*', { count: 'exact', head: true }),
          supabase.from('faqs').select('*', { count: 'exact', head: true }),
          supabase.from('community_posts').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('*', { count: 'exact', head: true }),
          supabase.from('announcements').select('*', { count: 'exact', head: true }),
          supabase.from('shipment_statuses').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('amount').eq('order_status', 'paid'),
          supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('enrollment_status', 'active'),
          supabase.from('leads').select('*', { count: 'exact', head: true }).eq('lead_status', 'new'),
          supabase.from('blog_posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
          supabase.from('leads').select('id, name, email, source, lead_status, created_at').order('created_at', { ascending: false }).limit(5),
          supabase.from('orders').select('id, amount, order_status, payment_type, user_profiles(full_name), programs(title)').order('created_at', { ascending: false }).limit(5),
        ] as const);

        const totalLeads = (leadsApiRes.data as any[])?.length ?? 0;
        const studentCount = (studentsApiRes.students as any[])?.length ?? 0;

        const totalRevenue = paidOrders?.reduce((sum, o) => sum + Number(o.amount), 0) ?? 0;

        setKpis([
          { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, sub: 'All paid orders', icon: BarChart2 },
          { label: 'Active Students', value: activeEnrollments ?? 0, sub: 'Active enrollments', icon: UserCheck },
          { label: 'New Leads', value: newLeads ?? 0, sub: 'Awaiting contact', icon: TrendingUp },
          { label: 'Published Posts', value: publishedPosts ?? 0, sub: 'Live blog articles', icon: FileText },
        ]);

        setSections([
          { label: 'Leads', href: '/admin/leads', icon: TrendingUp, count: totalLeads, color: 'text-amber-700 bg-amber-50 border-amber-200' },
          { label: 'Students', href: '/admin/students', icon: Users, count: studentCount, color: 'text-blue-700 bg-blue-50 border-blue-200' },
          { label: 'Services', href: '/admin/services', icon: Globe, count: serviceCount ?? 0, color: 'text-purple-700 bg-purple-50 border-purple-200' },
          { label: 'Programs', href: '/program-management', icon: Layers, count: programCount ?? 0, color: 'text-green-700 bg-green-50 border-green-200' },
          { label: 'Resources', href: '/admin/resources', icon: BookOpen, count: resourceCount ?? 0, color: 'text-orange-700 bg-orange-50 border-orange-200' },
          { label: 'Blog Posts', href: '/admin/blog', icon: FileText, count: blogCount ?? 0, color: 'text-teal-700 bg-teal-50 border-teal-200' },
          { label: 'Testimonials', href: '/admin/testimonials', icon: Star, count: testimonialCount ?? 0, color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
          { label: 'FAQs', href: '/admin/faqs', icon: HelpCircle, count: faqCount ?? 0, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
          { label: 'Community', href: '/admin/community', icon: MessageSquare, count: communityCount ?? 0, color: 'text-pink-700 bg-pink-50 border-pink-200' },
          { label: 'Orders', href: '/admin/orders', icon: ShoppingCart, count: orderCount ?? 0, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
          { label: 'Announcements', href: '/admin/announcements', icon: Bell, count: announcementCount ?? 0, color: 'text-red-700 bg-red-50 border-red-200' },
          { label: 'Shipments', href: '/admin/shipments', icon: Package, count: shipmentCount ?? 0, color: 'text-stone-700 bg-stone-100 border-stone-200' },
        ]);

        setLeads(recentLeads ?? []);
        setOrders((recentOrders ?? []) as Order[]);
      } catch (err) {
        console.error('Admin dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center justify-between">
        <div>
          <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Admin</p>
          <p className="font-serif text-lg text-stone-800 leading-tight">Control Panel</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/site-content" className="btn-ghost text-xs py-2 px-4">
            <Settings size={13} />
            Site Content
          </Link>
        </div>
      </div>
      <div className="flex-1 p-6 xl:p-8 max-w-screen-2xl mx-auto w-full space-y-8">

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-stone-200/80 rounded-sm p-6 animate-pulse">
                <div className="h-4 bg-stone-200 rounded w-1/2 mb-4" />
                <div className="h-8 bg-stone-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-stone-100 rounded w-1/2" />
              </div>
            ))
          ) : (
            kpis.map((kpi) => (
              <div key={kpi.label} className="bg-white border border-stone-200/80 rounded-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">{kpi.label}</p>
                  <kpi.icon size={16} className="text-stone-300" />
                </div>
                <p className="font-serif text-3xl text-stone-900 tabular-nums">{kpi.value}</p>
                <p className="text-xs font-sans text-stone-400 mt-1">{kpi.sub}</p>
              </div>
            ))
          )}
        </div>

        {/* Admin Sections Grid */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px bg-amber-700/40" />
            <h2 className="font-serif text-xl text-stone-800">Content Management</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-white border border-stone-200/80 rounded-sm p-5 animate-pulse">
                  <div className="w-9 h-9 rounded-sm bg-stone-200 mb-4" />
                  <div className="h-5 bg-stone-200 rounded w-2/3 mb-1" />
                  <div className="h-3 bg-stone-100 rounded w-1/2" />
                </div>
              ))
            ) : (
              sections.map((section) => (
                <Link
                  key={section.label}
                  href={section.href}
                  className="group bg-white border border-stone-200/80 rounded-sm p-5 hover:shadow-card-hover hover:border-amber-200 transition-all duration-200"
                >
                  <div className={`w-9 h-9 rounded-sm border flex items-center justify-center mb-4 ${section.color}`}>
                    <section.icon size={16} />
                  </div>
                  <p className="font-serif text-lg text-stone-800 group-hover:text-amber-800 transition-colors">{section.label}</p>
                  <p className="text-xs font-sans text-stone-400 mt-0.5">{section.count} records</p>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white border border-stone-200/80 rounded-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-px bg-amber-700/40" />
              <h2 className="font-serif text-xl text-stone-800">Recent Leads</h2>
            </div>
            <Link href="/admin/leads" className="text-xs font-sans text-amber-700 hover:text-amber-800 transition-colors">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  {['Name', 'Email', 'Source', 'Status', 'Date'].map((h) => (
                    <th key={h} className="text-left text-xs font-sans font-medium text-stone-400 uppercase tracking-widest pb-3 pr-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <td key={j} className="py-3 pr-6"><div className="h-4 bg-stone-100 rounded animate-pulse" /></td>
                      ))}
                    </tr>
                  ))
                ) : leads.length === 0 ? (
                  <tr><td colSpan={5} className="py-4 text-center text-xs font-sans text-stone-400">No leads yet.</td></tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="py-3 pr-6 font-sans font-medium text-stone-700">{lead.name}</td>
                      <td className="py-3 pr-6 font-sans text-stone-500">{lead.email}</td>
                      <td className="py-3 pr-6 font-sans text-stone-500">{lead.source}</td>
                      <td className="py-3 pr-6">
                        <span className={`text-2xs font-sans font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm border ${
                          lead.lead_status === 'new' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          lead.lead_status === 'converted' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}>{lead.lead_status}</span>
                      </td>
                      <td className="py-3 font-sans text-stone-400 text-xs">{new Date(lead.created_at).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white border border-stone-200/80 rounded-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-px bg-amber-700/40" />
              <h2 className="font-serif text-xl text-stone-800">Recent Orders</h2>
            </div>
            <Link href="/admin/orders" className="text-xs font-sans text-amber-700 hover:text-amber-800 transition-colors">View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  {['User', 'Program', 'Amount', 'Type', 'Status'].map((h) => (
                    <th key={h} className="text-left text-xs font-sans font-medium text-stone-400 uppercase tracking-widest pb-3 pr-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <td key={j} className="py-3 pr-6"><div className="h-4 bg-stone-100 rounded animate-pulse" /></td>
                      ))}
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr><td colSpan={5} className="py-4 text-center text-xs font-sans text-stone-400">No orders yet.</td></tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td className="py-3 pr-6 font-sans font-medium text-stone-700">{order.user_profiles?.full_name ?? '—'}</td>
                      <td className="py-3 pr-6 font-sans text-stone-500">{order.programs?.title ?? '—'}</td>
                      <td className="py-3 pr-6 font-sans font-medium text-stone-800">₹{Number(order.amount).toLocaleString('en-IN')}</td>
                      <td className="py-3 pr-6 font-sans text-stone-500 text-xs capitalize">{order.payment_type?.replace('_', ' ')}</td>
                      <td className="py-3">
                        <span className={`text-2xs font-sans font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm border ${
                          order.order_status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}>{order.order_status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}