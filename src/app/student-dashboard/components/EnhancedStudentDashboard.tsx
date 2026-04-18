'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Award, Bell, ChevronRight, Lock, CheckCircle, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface EnrolledProgram {
  enrollmentId: string;
  programId: string;
  programTitle: string;
  programDuration: string;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
}

interface Announcement {
  id: string;
  title: string;
  body: string;
}

export default function EnhancedStudentDashboard() {
  const { user } = useAuth();
  const [enrolledPrograms, setEnrolledPrograms] = useState<EnrolledProgram[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      const supabase = createClient();
      try {
        // Fetch user profile for name
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('full_name')
          .eq('id', user!.id)
          .maybeSingle();
        if (profile?.full_name) setUserName(profile.full_name.split(' ')[0]);

        // Fetch active enrollments with program info
        const { data: enrollments } = await supabase
          .from('enrollments')
          .select('id, program_id, programs(id, title, duration)')
          .eq('user_id', user!.id)
          .eq('enrollment_status', 'active');

        if (!enrollments || enrollments.length === 0) {
          setLoading(false);
          return;
        }

        // For each enrollment, fetch lesson count and completed count
        const programsData: EnrolledProgram[] = await Promise.all(
          enrollments.map(async (enrollment) => {
            const prog = enrollment.programs as any;
            const programId = prog?.id ?? enrollment.program_id;

            const [lessonsRes, progressRes] = await Promise.all([
              supabase
                .from('lessons')
                .select('id', { count: 'exact', head: true })
                .eq('program_id', programId)
                .eq('status', 'published'),
              supabase
                .from('progress_records')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', user!.id)
                .eq('program_id', programId)
                .eq('is_completed', true),
            ]);

            const totalLessons = lessonsRes.count ?? 0;
            const completedLessons = progressRes.count ?? 0;
            const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

            return {
              enrollmentId: enrollment.id,
              programId,
              programTitle: prog?.title ?? 'Program',
              programDuration: prog?.duration ?? '',
              totalLessons,
              completedLessons,
              progressPercent,
            };
          })
        );

        setEnrolledPrograms(programsData);

        // Fetch announcements
        const { data: announcementsData } = await supabase
          .from('announcements')
          .select('id, title, body')
          .eq('status', 'published')
          .in('target_role', ['all', 'student'])
          .order('created_at', { ascending: false })
          .limit(1);

        setAnnouncements(announcementsData ?? []);
      } catch (err) {
        console.error('EnhancedStudentDashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Topbar */}
      <div className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-sm border-b border-stone-200/60 px-6 xl:px-8 h-16 flex items-center justify-between">
        <div>
          <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">Student Dashboard</p>
          <p className="font-serif text-lg text-stone-800 leading-tight">
            {userName ? `Welcome back, ${userName}` : 'Welcome back'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/awareness-session" className="btn-primary text-xs py-2 px-4">
            Join Awareness Session
          </Link>
        </div>
      </div>

      <div className="flex-1 p-6 xl:p-8 max-w-screen-2xl mx-auto w-full space-y-8">

        {/* Announcements */}
        {announcements.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-sm p-4 flex items-start gap-3">
            <Bell size={16} className="text-amber-700 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-sans font-medium text-amber-900">{announcements[0].title}</p>
              <p className="text-xs font-sans text-amber-700 mt-0.5">{announcements[0].body}</p>
            </div>
          </div>
        )}

        {/* Active Enrollments */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px bg-amber-700/40" />
            <h2 className="font-serif text-xl text-stone-800">Your Programs</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {[1, 2].map(i => (
                <div key={i} className="bg-white border border-stone-200/80 rounded-sm p-6 animate-pulse" style={{ height: 160 }} />
              ))}
            </div>
          ) : enrolledPrograms.length === 0 ? (
            <div className="bg-white border border-stone-200/80 rounded-sm p-8 text-center">
              <p className="font-serif text-lg text-stone-600">No active programs yet.</p>
              <p className="text-sm font-sans text-stone-400 mt-2">Enrol in a program to start your learning journey.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {enrolledPrograms.map(ep => (
                <div key={ep.enrollmentId} className="bg-white border border-stone-200/80 rounded-sm p-6">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest mb-1">{ep.programDuration}</p>
                      <h3 className="font-serif text-xl text-stone-800">{ep.programTitle}</h3>
                    </div>
                    {ep.progressPercent === 100 && (
                      <div className="flex items-center gap-1.5 text-xs font-sans font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-sm shrink-0">
                        <Award size={12} />
                        Completed
                      </div>
                    )}
                  </div>
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-sans text-stone-500">Overall Progress</span>
                      <span className="text-xs font-sans font-medium text-stone-700">{ep.progressPercent}%</span>
                    </div>
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-600 rounded-full transition-all duration-500"
                        style={{ width: `${ep.progressPercent}%` }}
                      />
                    </div>
                    <p className="text-xs font-sans text-stone-400 mt-1.5">
                      {ep.completedLessons} of {ep.totalLessons} lessons completed
                    </p>
                  </div>
                  <Link
                    href="/progress-tracking"
                    className="text-sm font-sans font-medium text-amber-800 hover:text-amber-900 transition-colors inline-flex items-center gap-1.5"
                  >
                    {ep.progressPercent === 0 ? 'Start Learning' : 'Continue Learning'} <ChevronRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
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
              <h3 className="font-serif text-lg text-stone-200 mb-2">Your Learning Journey</h3>
              <p className="text-sm font-sans font-light text-stone-400 mb-5">Open your program to see your next lesson and mark it complete.</p>
              <Link href="/progress-tracking" className="inline-flex items-center gap-2 text-sm font-sans font-medium text-amber-400 hover:text-amber-300 transition-colors">
                Go to Progress Tracking <ChevronRight size={14} />
              </Link>
            </div>
            <div className="bg-stone-800/50 border border-stone-700 rounded-sm p-6">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-amber-500" />
                <span className="text-xs font-sans font-medium text-amber-500 uppercase tracking-widest">Upcoming</span>
              </div>
              <h3 className="font-serif text-lg text-stone-200 mb-2">Live Group Session</h3>
              <p className="text-sm font-sans font-light text-stone-400 mb-5">Monthly live session with Dr. Vijay — check announcements for the latest schedule.</p>
              <span className="text-xs font-sans font-medium text-stone-500 bg-stone-700 px-3 py-1.5 rounded-sm">Link sent via email</span>
            </div>
          </div>
        </div>

        {/* Resources + Certificate */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
              ].map(res => (
                <div key={res.title} className="flex items-center gap-3">
                  {res.unlocked ? (
                    <CheckCircle size={14} className="text-amber-600 shrink-0" />
                  ) : (
                    <Lock size={14} className="text-stone-300 shrink-0" />
                  )}
                  <div>
                    <p className={`text-xs font-sans font-medium ${res.unlocked ? 'text-stone-700' : 'text-stone-400'}`}>{res.title}</p>
                    <p className="text-2xs font-sans text-stone-400 capitalize">{res.type}</p>
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
            {loading ? (
              <div className="space-y-3">
                {[1, 2].map(i => <div key={i} className="h-8 bg-stone-100 rounded animate-pulse" />)}
              </div>
            ) : enrolledPrograms.length === 0 ? (
              <p className="text-sm font-sans text-stone-400">Enrol in a program to earn certificates.</p>
            ) : (
              <div className="space-y-4">
                {enrolledPrograms.map(ep => (
                  <div key={ep.programId} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${ep.progressPercent === 100 ? 'bg-amber-500' : 'bg-stone-300'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-sans font-medium text-stone-700 truncate">{ep.programTitle}</p>
                      <p className="text-2xs font-sans text-stone-400">
                        {ep.progressPercent === 100 ? 'Eligible for certificate' : `${ep.progressPercent}% complete`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
