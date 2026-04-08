'use client';
import React, { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { mockShipments, mockUsers } from '@/lib/data/mockData';
import type { ShipmentStatus } from '@/lib/data/types';
import { Edit2 } from 'lucide-react';

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState<ShipmentStatus[]>(mockShipments);

  const updateStatus = (id: string, status: ShipmentStatus['status']) => {
    setShipments(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center">
          <div>
            <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Admin</p>
            <p className="font-serif text-lg text-stone-800 leading-tight">Shipment Tracking</p>
          </div>
        </div>
        <div className="p-6 xl:p-8 max-w-screen-xl mx-auto">
          <div className="bg-white border border-stone-200/80 rounded-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50">
                  {['Student', 'Product', 'Tracking', 'Carrier', 'Status', 'Est. Delivery', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-sans font-medium text-stone-400 uppercase tracking-widest px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {shipments.map(ship => {
                  const user = mockUsers.find(u => u.id === ship.userId);
                  return (
                    <tr key={ship.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-sans font-medium text-stone-700">{user?.fullName}</td>
                      <td className="px-5 py-3.5 font-sans text-stone-500">{ship.productName}</td>
                      <td className="px-5 py-3.5 font-sans text-stone-400 text-xs">{ship.trackingNumber || '—'}</td>
                      <td className="px-5 py-3.5 font-sans text-stone-500 text-xs">{ship.carrier || '—'}</td>
                      <td className="px-5 py-3.5">
                        <select
                          value={ship.status}
                          onChange={e => updateStatus(ship.id, e.target.value as ShipmentStatus['status'])}
                          className="text-xs font-sans border border-stone-200 rounded-sm px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40"
                        >
                          {['processing', 'shipped', 'in_transit', 'delivered', 'returned'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                        </select>
                      </td>
                      <td className="px-5 py-3.5 font-sans text-stone-400 text-xs">{ship.estimatedDelivery || '—'}</td>
                      <td className="px-5 py-3.5">
                        <button className="text-stone-400 hover:text-amber-700 transition-colors"><Edit2 size={14} /></button>
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
