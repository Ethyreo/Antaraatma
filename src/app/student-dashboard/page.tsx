import React from 'react';
import StudentSidebar from '@/components/StudentSidebar';
import EnhancedStudentDashboard from './components/EnhancedStudentDashboard';

export default function StudentDashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#FAF8F4]">
      <StudentSidebar />
      <div className="flex-1 min-w-0">
        <EnhancedStudentDashboard />
      </div>
    </div>
  );
}