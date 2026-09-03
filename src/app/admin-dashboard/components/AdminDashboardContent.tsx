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
  iconColor: string;
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
        const [
          leadsApiRes,
          studentsApiRes,
          serviceCountRes,
          programCountRes,
          resourceCountRes,
          blogCountRes,
          testimonialCountRes,
          faqCountRes,
          communityCountRes,
          orderCountRes,
          announcementCountRes,
          shipmentCountRes,
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

        const serviceCount = serviceCountRes.count;
        const programCount = programCountRes.count;
        const resourceCount = resourceCountRes.count;
        const blogCount = blogCountRes.count;
        const testimonialCount = testimonialCountRes.count;
        const faqCount = faqCountRes.count;
        const communityCount = communityCountRes.count;
        const orderCount = orderCountRes.count;
        const announcementCount = announcementCountRes.count;
        const shipmentCount = shipmentCountRes.count;
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
          { label: 'Leads', href: '/admin/leads', icon: TrendingUp, count: totalLeads, color: 'rgba(196,160,82,0.1)', iconColor: '#C4A052' },
          { label: 'Students', href: '/admin/students', icon: Users, count: studentCount, color: 'rgba(26,107,107,0.1)', iconColor: '#1A6B6B' },
          { label: 'Services', href: '/admin/services', icon: Globe, count: serviceCount ?? 0, color: 'rgba(58,122,90,0.1)', iconColor: '#3A7A5A' },
          { label: 'Programs', href: '/program-management', icon: Layers, count: programCount ?? 0, color: 'rgba(95,189,189,0.15)', iconColor: '#1A6B6B' },
          { label: 'Resources', href: '/admin/resources', icon: BookOpen, count: resourceCount ?? 0, color: 'rgba(196,160,82,0.1)', iconColor: '#C4A052' },
          { label: 'Blog Posts', href: '/admin/blog', icon: FileText, count: blogCount ?? 0, color: 'rgba(26,107,107,0.1)', iconColor: '#1A6B6B' },
          { label: 'Testimonials', href: '/admin/testimonials', icon: Star, count: testimonialCount ?? 0, color: 'rgba(196,160,82,0.12)', iconColor: '#C4A052' },
          { label: 'FAQs', href: '/admin/faqs', icon: HelpCircle, count: faqCount ?? 0, color: 'rgba(58,122,90,0.1)', iconColor: '#3A7A5A' },
          { label: 'Community', href: '/admin/community', icon: MessageSquare, count: communityCount ?? 0, color: 'rgba(95,189,189,0.15)', iconColor: '#1A6B6B' },
          { label: 'Orders', href: '/admin/orders', icon: ShoppingCart, count: orderCount ?? 0, color: 'rgba(26,107,107,0.1)', iconColor: '#1A6B6B' },
          { label: 'Announcements', href: '/admin/announcements', icon: Bell, count: announcementCount ?? 0, color: 'rgba(196,160,82,0.1)', iconColor: '#C4A052' },
          { label: 'Shipments', href: '/admin/shipments', icon: Package, count: shipmentCount ?? 0, color: 'rgba(168,216,206,0.2)', iconColor: '#3A7A5A' },
        ]);

        setLeads(recentLeads ?? []);
        setOrders((recentOrders ?? []) as unknown as Order[]);
      } catch (err) {
        console.error('Admin dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#F4EFE6' }}>
      {/* Topbar */}
      <div
        className="sticky top-0 z-30 backdrop-blur-sm px-6 xl:px-8 h-16 flex items-center justify-between"
        style={{ background: 'rgba(244,239,230,0.95)', borderBottom: '1px solid rgba(168,216,206,0.4)' }}
      >
        <div>
          <p className="text-xs font-sans uppercase tracking-[0.12em]" style={{ color: '#3A7A5A', fontWeight: 600 }}>Admin</p>
          <p className="font-serif text-lg leading-tight" style={{ color: '#1A6B6B', fontWeight: 300, letterSpacing: '0.04em' }}>Control Panel</p>
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
              <div key={i} className="rounded-sm p-6 animate-pulse" style={{ background: 'rgba(168,216,206,0.15)', border: '1px solid rgba(168,216,206,0.3)', height: 110 }} />
            ))
          ) : (
            kpis.map((kpi) => (
              <div key={kpi.label} className="rounded-sm p-6" style={{ background: '#FFFFFF', border: '1px solid rgba(168,216,206,0.4)' }}>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-sans uppercase tracking-[0.1em]" style={{ color: 'rgba(36,44,44,0.45)', fontWeight: 500 }}>{kpi.label}</p>
                  <kpi.icon size={16} style={{ color: 'rgba(26,107,107,0.3)' }} />
                </div>
                <p className="font-serif text-3xl tabular-nums" style={{ color: '#242C2C', fontWeight: 300 }}>{kpi.value}</p>
                <p className="text-xs font-sans mt-1" style={{ color: 'rgba(36,44,44,0.4)' }}>{kpi.sub}</p>
              </div>
            ))
          )}
        </div>

        {/* Admin Sections Grid */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px" style={{ background: 'rgba(196,160,82,0.5)' }} />
            <h2 className="font-serif text-xl" style={{ color: '#242C2C', fontWeight: 300 }}>Content Management</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-sm p-5 animate-pulse" style={{ background: 'rgba(168,216,206,0.15)', border: '1px solid rgba(168,216,206,0.3)', height: 100 }} />
              ))
            ) : (
              sections.map((section) => (
                <Link
                  key={section.label}
                  href={section.href}
                  className="group rounded-sm p-5 transition-all duration-200"
                  style={{ background: '#FFFFFF', border: '1px solid rgba(168,216,206,0.4)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,160,82,0.4)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(26,107,107,0.08)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(168,216,206,0.4)';
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-sm flex items-center justify-center mb-4"
                    style={{ background: section.color }}
                  >
                    <section.icon size={16} style={{ color: section.iconColor }} />
                  </div>
                  <p className="font-serif text-lg" style={{ color: '#242C2C', fontWeight: 300 }}>{section.label}</p>
                  <p className="text-xs font-sans mt-0.5" style={{ color: 'rgba(36,44,44,0.4)' }}>{section.count} records</p>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="rounded-sm p-6" style={{ background: '#FFFFFF', border: '1px solid rgba(168,216,206,0.4)' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-px" style={{ background: 'rgba(196,160,82,0.5)' }} />
              <h2 className="font-serif text-xl" style={{ color: '#242C2C', fontWeight: 300 }}>Recent Leads</h2>
            </div>
            <Link href="/admin/leads" className="text-xs font-sans transition-colors" style={{ color: '#1A6B6B' }}>View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(168,216,206,0.3)' }}>
                  {['Name', 'Email', 'Source', 'Status', 'Date'].map((h) => (
                    <th key={h} className="text-left text-xs font-sans uppercase tracking-[0.1em] pb-3 pr-6" style={{ color: 'rgba(36,44,44,0.4)', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <td key={j} className="py-3 pr-6">
                          <div className="h-4 rounded animate-pulse" style={{ background: 'rgba(168,216,206,0.2)' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : leads.length === 0 ? (
                  <tr><td colSpan={5} className="py-4 text-center text-xs font-sans" style={{ color: 'rgba(36,44,44,0.4)' }}>No leads yet.</td></tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} style={{ borderBottom: '1px solid rgba(168,216,206,0.15)' }}>
                      <td className="py-3 pr-6 font-sans font-medium" style={{ color: '#242C2C' }}>{lead.name}</td>
                      <td className="py-3 pr-6 font-sans" style={{ color: 'rgba(36,44,44,0.6)' }}>{lead.email}</td>
                      <td className="py-3 pr-6 font-sans" style={{ color: 'rgba(36,44,44,0.6)' }}>{lead.source}</td>
                      <td className="py-3 pr-6">
                        <span
                          className="text-2xs font-sans font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm"
                          style={
                            lead.lead_status === 'new'
                              ? { background: 'rgba(196,160,82,0.1)', color: '#C4A052', border: '1px solid rgba(196,160,82,0.3)' }
                              : lead.lead_status === 'converted'
                              ? { background: 'rgba(26,107,107,0.1)', color: '#1A6B6B', border: '1px solid rgba(26,107,107,0.25)' }
                              : { background: 'rgba(168,216,206,0.15)', color: 'rgba(36,44,44,0.5)', border: '1px solid rgba(168,216,206,0.3)' }
                          }
                        >{lead.lead_status}</span>
                      </td>
                      <td className="py-3 font-sans text-xs" style={{ color: 'rgba(36,44,44,0.4)' }}>{new Date(lead.created_at).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-sm p-6" style={{ background: '#FFFFFF', border: '1px solid rgba(168,216,206,0.4)' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-px" style={{ background: 'rgba(196,160,82,0.5)' }} />
              <h2 className="font-serif text-xl" style={{ color: '#242C2C', fontWeight: 300 }}>Recent Orders</h2>
            </div>
            <Link href="/admin/orders" className="text-xs font-sans transition-colors" style={{ color: '#1A6B6B' }}>View all →</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(168,216,206,0.3)' }}>
                  {['User', 'Program', 'Amount', 'Type', 'Status'].map((h) => (
                    <th key={h} className="text-left text-xs font-sans uppercase tracking-[0.1em] pb-3 pr-6" style={{ color: 'rgba(36,44,44,0.4)', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <td key={j} className="py-3 pr-6">
                          <div className="h-4 rounded animate-pulse" style={{ background: 'rgba(168,216,206,0.2)' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr><td colSpan={5} className="py-4 text-center text-xs font-sans" style={{ color: 'rgba(36,44,44,0.4)' }}>No orders yet.</td></tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(168,216,206,0.15)' }}>
                      <td className="py-3 pr-6 font-sans font-medium" style={{ color: '#242C2C' }}>{order.user_profiles?.full_name ?? '—'}</td>
                      <td className="py-3 pr-6 font-sans" style={{ color: 'rgba(36,44,44,0.6)' }}>{order.programs?.title ?? '—'}</td>
                      <td className="py-3 pr-6 font-sans font-medium" style={{ color: '#242C2C' }}>₹{Number(order.amount).toLocaleString('en-IN')}</td>
                      <td className="py-3 pr-6 font-sans text-xs capitalize" style={{ color: 'rgba(36,44,44,0.6)' }}>{order.payment_type?.replace('_', ' ')}</td>
                      <td className="py-3">
                        <span
                          className="text-2xs font-sans font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm"
                          style={
                            order.order_status === 'paid'
                              ? { background: 'rgba(26,107,107,0.1)', color: '#1A6B6B', border: '1px solid rgba(26,107,107,0.25)' }
                              : { background: 'rgba(168,216,206,0.15)', color: 'rgba(36,44,44,0.5)', border: '1px solid rgba(168,216,206,0.3)' }
                          }
                        >{order.order_status}</span>
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
