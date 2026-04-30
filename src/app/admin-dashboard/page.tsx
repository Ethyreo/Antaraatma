import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminDashboardContent from './components/AdminDashboardContent';

export default function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen" style={{ background: '#2A3434' }}>
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <AdminDashboardContent />
      </div>
    </div>
  );
}