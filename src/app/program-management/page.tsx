'use client';
import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminGuard from '@/components/AdminGuard';
import ProgramManagementContent from './components/ProgramManagementContent';

export default function ProgramManagementPage() {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#FAF8F4]">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <ProgramManagementContent />
        </main>
      </div>
    </AdminGuard>
  );
}