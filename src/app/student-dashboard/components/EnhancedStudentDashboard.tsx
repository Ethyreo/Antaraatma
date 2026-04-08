'use client';
import React from 'react';
import Link from 'next/link';
import { mockUsers, mockEnrollments, mockPrograms, mockProgressRecords, mockCertificates, mockShipments, mockAnnouncements, calculateProgramProgress, mockLessons } from '@/lib/data/mockData';
import { BookOpen, Award, Package, Bell, ChevronRight, Lock, CheckCircle, Clock } from 'lucide-react';

const CURRENT_USER_ID = 'user-student-1';

export default function EnhancedStudentDashboard() {
  const user = mockUsers?.find(u => u?.id === CURRENT_USER_ID);
  const enrollments = mockEnrollments?.filter(e => e?.userId === CURRENT_USER_ID && e?.status === 'active');
  const certificates = mockCertificates?.filter(c => c?.userId === CURRENT_USER_ID);
  const shipments = mockShipments?.filter(s => s?.userId === CURRENT_USER_ID);
  const announcements = mockAnnouncements?.filter(a => a?.status === 'published' && (a?.targetRole === 'all' || a?.targetRole === 'student'));

  return (
    <div className="flex flex-col min-h-screen">
      {/* Topbar */}
      <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center justify-between">
        <div>
          <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Student Dashboard</p>
          <p className="font-serif text-lg text-stone-800 leading-tight">Welcome back, {user?.fullName?.split(' ')?.[0]}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/awareness-session" className="btn-primary text-xs py-2 px-4">
            Join Awareness Session
          </Link>
        </div>
      </div>
      <div className="flex-1 p-6 xl:p-8 max-w-screen-2xl mx-auto w-full space-y-8">

        {/* Announcements */}
        {announcements?.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-sm p-4 flex items-start gap-3">
            <Bell size={16} className="text-amber-700 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-sans font-medium text-amber-900">{announcements?.[0]?.title}</p>
              <p className="text-xs font-sans text-amber-700 mt-0.5">{announcements?.[0]?.body}</p>
            </div>
          </div>
        )}

        {/* Active Enrollments */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px bg-amber-700/40" />
            <h2 className="font-serif text-xl text-stone-800">Your Programs</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {enrollments?.map(enrollment => {
              const program = mockPrograms?.find(p => p?.id === enrollment?.programId);
              if (!program) return null;
              const progress = calculateProgramProgress(CURRENT_USER_ID, program?.id);
              const programLessons = mockLessons?.filter(l => l?.programId === program?.id);
              const completedLessons = mockProgressRecords?.filter(p => p?.userId === CURRENT_USER_ID && p?.programId === program?.id && p?.isCompleted)?.length;
              const cert = certificates?.find(c => c?.programId === program?.id);

              return (
                <div key={enrollment?.id} className="bg-white border border-stone-200/80 rounded-sm p-6">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest mb-1">{program?.duration}</p>
                      <h3 className="font-serif text-xl text-stone-800">{program?.title}</h3>
                    </div>
                    {cert?.isEligible && (
                      <div className="flex items-center gap-1.5 text-xs font-sans font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-sm shrink-0">
                        <Award size={12} />
                        Certified
                      </div>
                    )}
                  </div>
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-sans text-stone-500">Overall Progress</span>
                      <span className="text-xs font-sans font-medium text-stone-700">{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-600 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-xs font-sans text-stone-400 mt-1.5">{completedLessons} of {programLessons?.length} lessons completed</p>
                  </div>
                  <Link href="/progress-tracking" className="text-sm font-sans font-medium text-amber-800 hover:text-amber-900 transition-colors inline-flex items-center gap-1.5">
                    Continue Learning <ChevronRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Recommended Action */}
        <div className="bg-stone-900 rounded-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px bg-amber-700/40" />
            <h2 className="font-serif text-xl text-stone-100">Next Recommended Action</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-stone-800/50 border border-stone-700 rounded-sm p-6">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={16} className="text-amber-500" />
                <span className="text-xs font-sans font-medium text-amber-500 uppercase tracking-widest">Continue Lesson</span>
              </div>
              <h3 className="font-serif text-lg text-stone-200 mb-2">The Healing Kitchen</h3>
              <p className="text-sm font-sans font-light text-stone-400 mb-5">Building your naturopathic food environment — Month 1, Module 2</p>
              <Link href="/progress-tracking" className="inline-flex items-center gap-2 text-sm font-sans font-medium text-amber-400 hover:text-amber-300 transition-colors">
                Resume Lesson <ChevronRight size={14} />
              </Link>
            </div>
            <div className="bg-stone-800/50 border border-stone-700 rounded-sm p-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-amber-500" />
                <span className="text-xs font-sans font-medium text-amber-500 uppercase tracking-widest">Upcoming</span>
              </div>
              <h3 className="font-serif text-lg text-stone-200 mb-2">Live Group Session</h3>
              <p className="text-sm font-sans font-light text-stone-400 mb-5">Monthly live session with Dr. Vijay — April 15, 2026 · 7:00 PM IST</p>
              <span className="text-xs font-sans font-medium text-stone-500 bg-stone-700 px-3 py-1.5 rounded-sm">Link sent via email</span>
            </div>
          </div>
        </div>

        {/* Resources + Certificate + Shipment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Unlocked Resources */}
          <div className="bg-white border border-stone-200/80 rounded-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <BookOpen size={16} className="text-amber-700" />
              <h3 className="font-serif text-lg text-stone-800">Resource Vault</h3>
            </div>
            <div className="space-y-3 mb-5">
              {[
                { title: 'The Healing Kitchen Guide', type: 'ebook', unlocked: true },
                { title: 'Daily Breathwork Sequences', type: 'audio', unlocked: true },
                { title: 'Emotional Body Map', type: 'worksheet', unlocked: true },
                { title: 'Mastery Video Series', type: 'video', unlocked: false },
              ]?.map(res => (
                <div key={res?.title} className="flex items-center gap-3">
                  {res?.unlocked ? (
                    <CheckCircle size={14} className="text-amber-600 shrink-0" />
                  ) : (
                    <Lock size={14} className="text-stone-300 shrink-0" />
                  )}
                  <div>
                    <p className={`text-xs font-sans font-medium ${res?.unlocked ? 'text-stone-700' : 'text-stone-400'}`}>{res?.title}</p>
                    <p className="text-2xs font-sans text-stone-400 capitalize">{res?.type}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/resource-vault" className="text-xs font-sans font-medium text-amber-800 hover:text-amber-900 transition-colors">
              View all resources →
            </Link>
          </div>

          {/* Certificate Status */}
          <div className="bg-white border border-stone-200/80 rounded-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Award size={16} className="text-amber-700" />
              <h3 className="font-serif text-lg text-stone-800">Certificates</h3>
            </div>
            <div className="space-y-4">
              {mockPrograms?.filter(p => p?.status === 'published')?.map(program => {
                const cert = certificates?.find(c => c?.programId === program?.id);
                const enrolled = enrollments?.find(e => e?.programId === program?.id);
                const progress = calculateProgramProgress(CURRENT_USER_ID, program?.id);
                return (
                  <div key={program?.id} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${cert?.isEligible ? 'bg-amber-500' : enrolled ? 'bg-stone-300' : 'bg-stone-200'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-sans font-medium text-stone-700 truncate">{program?.title}</p>
                      <p className="text-2xs font-sans text-stone-400">
                        {cert?.isEligible ? 'Issued' : enrolled ? `${progress}% complete` : 'Not enrolled'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipment Status */}
          <div className="bg-white border border-stone-200/80 rounded-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Package size={16} className="text-amber-700" />
              <h3 className="font-serif text-lg text-stone-800">Shipments</h3>
            </div>
            {shipments?.length === 0 ? (
              <p className="text-sm font-sans font-light text-stone-400">No active shipments.</p>
            ) : (
              <div className="space-y-4">
                {shipments?.map(ship => (
                  <div key={ship?.id}>
                    <p className="text-sm font-sans font-medium text-stone-700 mb-1">{ship?.productName}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-2xs font-sans font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                        ship?.status === 'delivered' ? 'bg-green-50 text-green-700 border border-green-200' :
                        ship?.status === 'in_transit'? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-stone-100 text-stone-600 border border-stone-200'
                      }`}>{ship?.status?.replace('_', ' ')}</span>
                    </div>
                    {ship?.trackingNumber && <p className="text-2xs font-sans text-stone-400">Tracking: {ship?.trackingNumber}</p>}
                    {ship?.estimatedDelivery && <p className="text-2xs font-sans text-stone-400 mt-0.5">Est. delivery: {ship?.estimatedDelivery}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-white border border-stone-200/80 rounded-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px bg-amber-700/40" />
            <h2 className="font-serif text-xl text-stone-800">Billing History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left text-xs font-sans font-medium text-stone-400 uppercase tracking-widest pb-3 pr-6">Program</th>
                  <th className="text-left text-xs font-sans font-medium text-stone-400 uppercase tracking-widest pb-3 pr-6">Amount</th>
                  <th className="text-left text-xs font-sans font-medium text-stone-400 uppercase tracking-widest pb-3 pr-6">Type</th>
                  <th className="text-left text-xs font-sans font-medium text-stone-400 uppercase tracking-widest pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {[
                  { program: 'Transformation Mastery', amount: '₹2,499', type: 'Monthly', status: 'Active', date: 'Jan 15, 2026' },
                  { program: 'Foundation Course', amount: '₹999', type: 'One-time', status: 'Paid', date: 'Dec 1, 2025' },
                ]?.map((order, i) => (
                  <tr key={i}>
                    <td className="py-3 pr-6 font-sans text-stone-700">{order?.program}</td>
                    <td className="py-3 pr-6 font-sans font-medium text-stone-800">{order?.amount}</td>
                    <td className="py-3 pr-6 font-sans text-stone-500 text-xs">{order?.type}</td>
                    <td className="py-3">
                      <span className={`text-2xs font-sans font-medium uppercase tracking-widest px-2 py-0.5 rounded-sm ${order?.status === 'Active' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                        {order?.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
