'use client';
import React from 'react';
import { Toaster } from 'sonner';
import StudentTopbar from './StudentTopbar';
import ProgressBentoGrid from './ProgressBentoGrid';
import CurrentLesson from './CurrentLesson';
import ResourceQuickAccess from './ResourceQuickAccess';
import CommunityPulse from './CommunityPulse';
import RecentActivity from './RecentActivity';

export default function StudentDashboardContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="bottom-right" richColors />
      <StudentTopbar />
      <div className="flex-1 p-6 xl:p-8 2xl:p-10 max-w-screen-2xl mx-auto w-full space-y-8">
        <ProgressBentoGrid />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <CurrentLesson />
          </div>
          <div>
            <ResourceQuickAccess />
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <CommunityPulse />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}