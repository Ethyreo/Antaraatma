'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { mockLeads, mockUsers, mockEnrollments, mockOrders, mockPrograms, mockBlogPosts, mockServices, mockTestimonials, mockFAQs, mockCommunityPosts, mockAnnouncements, mockResources, mockShipments } from '@/lib/data/mockData';
import { Users, BookOpen, FileText, ShoppingCart, Star, HelpCircle, MessageSquare, Bell, Package, Settings, TrendingUp, BarChart2, UserCheck, Layers, Globe } from 'lucide-react';

const adminSections = [
  { label: 'Leads', href: '/admin/leads', icon: TrendingUp, count: mockLeads?.length, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { label: 'Students', href: '/admin/students', icon: Users, count: mockUsers?.filter(u => u?.role === 'student')?.length, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  { label: 'Services', href: '/admin/services', icon: Globe, count: mockServices?.length, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  { label: 'Programs', href: '/program-management', icon: Layers, count: mockPrograms?.length, color: 'text-green-700 bg-green-50 border-green-200' },
  { label: 'Resources', href: '/admin/resources', icon: BookOpen, count: mockResources?.length, color: 'text-orange-700 bg-orange-50 border-orange-200' },
  { label: 'Blog Posts', href: '/admin/blog', icon: FileText, count: mockBlogPosts?.length, color: 'text-teal-700 bg-teal-50 border-teal-200' },
  { label: 'Testimonials', href: '/admin/testimonials', icon: Star, count: mockTestimonials?.length, color: 'text-yellow-700 bg-yellow-50 border-yellow-200' },
  { label: 'FAQs', href: '/admin/faqs', icon: HelpCircle, count: mockFAQs?.length, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  { label: 'Community', href: '/admin/community', icon: MessageSquare, count: mockCommunityPosts?.length, color: 'text-pink-700 bg-pink-50 border-pink-200' },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart, count: mockOrders?.length, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  { label: 'Announcements', href: '/admin/announcements', icon: Bell, count: mockAnnouncements?.length, color: 'text-red-700 bg-red-50 border-red-200' },
  { label: 'Shipments', href: '/admin/shipments', icon: Package, count: mockShipments?.length, color: 'text-stone-700 bg-stone-100 border-stone-200' },
];

export default function AdminDashboardContent() {
  const totalRevenue = mockOrders?.filter(o => o?.status === 'paid')?.reduce((sum, o) => sum + o?.amount, 0);
  const activeStudents = mockEnrollments?.filter(e => e?.status === 'active')?.length;
  const newLeads = mockLeads?.filter(l => l?.status === 'new')?.length;
  const publishedPosts = mockBlogPosts?.filter(p => p?.status === 'published')?.length;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Topbar */}
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
          {[
            { label: 'Total Revenue', value: `₹${totalRevenue?.toLocaleString('en-IN')}`, sub: 'All paid orders', icon: BarChart2 },
            { label: 'Active Students', value: activeStudents, sub: 'Active enrollments', icon: UserCheck },
            { label: 'New Leads', value: newLeads, sub: 'Awaiting contact', icon: TrendingUp },
            { label: 'Published Posts', value: publishedPosts, sub: 'Live blog articles', icon: FileText },
          ]?.map(kpi => (
            <div key={kpi?.label} className="bg-white border border-stone-200/80 rounded-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">{kpi?.label}</p>
                <kpi.icon size={16} className="text-stone-300" />
              </div>
              <p className="font-serif text-3xl text-stone-900 tabular-nums">{kpi?.value}</p>
              <p className="text-xs font-sans text-stone-400 mt-1">{kpi?.sub}</p>
            </div>
          ))}
        </div>

        {/* Admin Sections Grid */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px bg-amber-700/40" />
            <h2 className="font-serif text-xl text-stone-800">Content Management</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {adminSections?.map(section => (
              <Link
                key={section?.label}
                href={section?.href}
                className="group bg-white border border-stone-200/80 rounded-sm p-5 hover:shadow-card-hover hover:border-amber-200 transition-all duration-200"
              >
                <div className={`w-9 h-9 rounded-sm border flex items-center justify-center mb-4 ${section?.color}`}>
                  <section.icon size={16} />
                </div>
                <p className="font-serif text-lg text-stone-800 group-hover:text-amber-800 transition-colors">{section?.label}</p>
                <p className="text-xs font-sans text-stone-400 mt-0.5">{section?.count} records</p>
              </Link>
            ))}
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
                  {['Name', 'Email', 'Source', 'Status', 'Date']?.map(h => (
                    <th key={h} className="text-left text-xs font-sans font-medium text-stone-400 uppercase tracking-widest pb-3 pr-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {mockLeads?.slice(0, 5)?.map(lead => (
                  <tr key={lead?.id}>
                    <td className="py-3 pr-6 font-sans font-medium text-stone-700">{lead?.name}</td>
                    <td className="py-3 pr-6 font-sans text-stone-500">{lead?.email}</td>
                    <td className="py-3 pr-6 font-sans text-stone-500">{lead?.source}</td>
                    <td className="py-3 pr-6">
                      <span className={`text-2xs font-sans font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm border ${
                        lead?.status === 'new' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        lead?.status === 'converted'? 'bg-green-50 text-green-700 border-green-200' : 'bg-stone-100 text-stone-600 border-stone-200'
                      }`}>{lead?.status}</span>
                    </td>
                    <td className="py-3 font-sans text-stone-400 text-xs">{new Date(lead.createdAt)?.toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
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
                  {['User', 'Program', 'Amount', 'Type', 'Status']?.map(h => (
                    <th key={h} className="text-left text-xs font-sans font-medium text-stone-400 uppercase tracking-widest pb-3 pr-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {mockOrders?.map(order => {
                  const user = mockUsers?.find(u => u?.id === order?.userId);
                  const program = mockPrograms?.find(p => p?.id === order?.programId);
                  return (
                    <tr key={order?.id}>
                      <td className="py-3 pr-6 font-sans font-medium text-stone-700">{user?.fullName}</td>
                      <td className="py-3 pr-6 font-sans text-stone-500">{program?.title}</td>
                      <td className="py-3 pr-6 font-sans font-medium text-stone-800">₹{order?.amount?.toLocaleString('en-IN')}</td>
                      <td className="py-3 pr-6 font-sans text-stone-500 text-xs capitalize">{order?.paymentType?.replace('_', ' ')}</td>
                      <td className="py-3">
                        <span className={`text-2xs font-sans font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm border ${
                          order?.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}>{order?.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}