'use client';
import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { mockOrders, mockUsers, mockPrograms } from '@/lib/data/mockData';
import type { Order } from '@/lib/data/types';

export default function AdminOrdersPage() {
  const [orders] = useState<Order[]>(mockOrders);

  const totalRevenue = orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center">
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Admin</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Orders</p>
          </div>
        </div>
        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto space-y-6">
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
              <p className="font-serif text-2xl text-stone-900">{orders.filter(o => o.status === 'paid').length}</p>
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
                {orders.map(order => {
                  const user = mockUsers.find(u => u.id === order.userId);
                  const program = mockPrograms.find(p => p.id === order.programId);
                  return (
                    <tr key={order.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-sans text-stone-400 text-xs">{order.id}</td>
                      <td className="px-5 py-3.5 font-sans font-medium text-stone-700">{user?.fullName}</td>
                      <td className="px-5 py-3.5 font-sans text-stone-500">{program?.title}</td>
                      <td className="px-5 py-3.5 font-sans font-medium text-stone-800">₹{order.amount.toLocaleString('en-IN')}</td>
                      <td className="px-5 py-3.5 font-sans text-stone-500 text-xs capitalize">{order.paymentType.replace('_', ' ')}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-2xs font-sans font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm border ${order.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-stone-100 text-stone-600 border-stone-200'}`}>{order.status}</span>
                      </td>
                      <td className="px-5 py-3.5 font-sans text-stone-400 text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
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
