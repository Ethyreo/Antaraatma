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
    <div className="flex flex-col min-h-screen" style={{ background: '#F4EFE6' }}>
      {/* Topbar */}
      <div
        className="sticky top-0 z-30 backdrop-blur-sm px-6 xl:px-8 h-16 flex items-center justify-between"
        style={{ background: 'rgba(244,239,230,0.95)', borderBottom: '1px solid rgba(168,216,206,0.4)' }}
      >
        <div>
          <p className="text-xs font-sans uppercase tracking-[0.12em]" style={{ color: '#3A7A5A', fontWeight: 600 }}>Student Dashboard</p>
          <p className="font-serif text-lg leading-tight" style={{ color: '#1A6B6B', fontWeight: 300, letterSpacing: '0.04em' }}>
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
          <div
            className="rounded-sm p-4 flex items-start gap-3"
            style={{ background: 'rgba(196,160,82,0.08)', border: '1px solid rgba(196,160,82,0.3)' }}
          >
            <Bell size={16} style={{ color: '#C4A052' }} className="mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-sans font-medium" style={{ color: '#8B6914' }}>{announcements[0].title}</p>
              <p className="text-xs font-sans mt-0.5" style={{ color: '#A07820' }}>{announcements[0].body}</p>
            </div>
          </div>
        )}

        {/* Active Enrollments */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px" style={{ background: 'rgba(196,160,82,0.5)' }} />
            <h2 className="font-serif text-xl" style={{ color: '#242C2C', fontWeight: 300 }}>Your Programs</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {[1, 2].map(i => (
                <div key={i} className="rounded-sm p-6 animate-pulse" style={{ background: 'rgba(168,216,206,0.15)', border: '1px solid rgba(168,216,206,0.3)', height: 160 }} />
              ))}
            </div>
          ) : enrolledPrograms.length === 0 ? (
            <div className="rounded-sm p-8 text-center" style={{ background: '#FFFFFF', border: '1px solid rgba(168,216,206,0.4)' }}>
              <p className="font-serif text-lg" style={{ color: 'rgba(36,44,44,0.6)', fontWeight: 300 }}>No active programs yet.</p>
              <p className="text-sm font-sans mt-2" style={{ color: 'rgba(36,44,44,0.4)' }}>Enrol in a program to start your learning journey.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {enrolledPrograms.map(ep => (
                <div key={ep.enrollmentId} className="rounded-sm p-6" style={{ background: '#FFFFFF', border: '1px solid rgba(168,216,206,0.4)' }}>
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <p className="text-xs font-sans uppercase tracking-[0.1em] mb-1" style={{ color: 'rgba(36,44,44,0.4)', fontWeight: 500 }}>{ep.programDuration}</p>
                      <h3 className="font-serif text-xl" style={{ color: '#242C2C', fontWeight: 300 }}>{ep.programTitle}</h3>
                    </div>
                    {ep.progressPercent === 100 && (
                      <div
                        className="flex items-center gap-1.5 text-xs font-sans font-medium px-2.5 py-1 rounded-sm shrink-0"
                        style={{ color: '#C4A052', background: 'rgba(196,160,82,0.1)', border: '1px solid rgba(196,160,82,0.3)' }}
                      >
                        <Award size={12} />
                        Completed
                      </div>
                    )}
                  </div>
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-sans" style={{ color: 'rgba(36,44,44,0.5)' }}>Overall Progress</span>
                      <span className="text-xs font-sans font-medium" style={{ color: '#242C2C' }}>{ep.progressPercent}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(168,216,206,0.3)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${ep.progressPercent}%`, background: '#1A6B6B' }}
                      />
                    </div>
                    <p className="text-xs font-sans mt-1.5" style={{ color: 'rgba(36,44,44,0.4)' }}>
                      {ep.completedLessons} of {ep.totalLessons} lessons completed
                    </p>
                  </div>
                  <Link
                    href="/progress-tracking"
                    className="text-sm font-sans font-medium inline-flex items-center gap-1.5 transition-colors"
                    style={{ color: '#1A6B6B' }}
                  >
                    {ep.progressPercent === 0 ? 'Start Learning' : 'Continue Learning'} <ChevronRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Next Recommended Action */}
        <div className="rounded-sm p-8" style={{ background: '#1A6B6B' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-6 h-px" style={{ background: 'rgba(196,160,82,0.6)' }} />
            <h2 className="font-serif text-xl" style={{ color: '#F4EFE6', fontWeight: 300 }}>Next Recommended Action</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-sm p-6" style={{ background: 'rgba(244,239,230,0.08)', border: '1px solid rgba(244,239,230,0.15)' }}>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={16} style={{ color: '#C4A052' }} />
                <span className="text-xs font-sans font-medium uppercase tracking-widest" style={{ color: '#C4A052' }}>Continue Lesson</span>
              </div>
              <h3 className="font-serif text-lg mb-2" style={{ color: '#F4EFE6', fontWeight: 300 }}>Your Learning Journey</h3>
              <p className="text-sm font-sans font-light mb-5" style={{ color: 'rgba(244,239,230,0.6)' }}>Open your program to see your next lesson and mark it complete.</p>
              <Link
                href="/progress-tracking"
                className="inline-flex items-center gap-2 text-sm font-sans font-medium transition-colors"
                style={{ color: '#C4A052' }}
              >
                Go to Progress Tracking <ChevronRight size={14} />
              </Link>
            </div>
            <div className="rounded-sm p-6" style={{ background: 'rgba(244,239,230,0.08)', border: '1px solid rgba(244,239,230,0.15)' }}>
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} style={{ color: '#C4A052' }} />
                <span className="text-xs font-sans font-medium uppercase tracking-widest" style={{ color: '#C4A052' }}>Upcoming</span>
              </div>
              <h3 className="font-serif text-lg mb-2" style={{ color: '#F4EFE6', fontWeight: 300 }}>Live Group Session</h3>
              <p className="text-sm font-sans font-light mb-5" style={{ color: 'rgba(244,239,230,0.6)' }}>Monthly live session with Dr. Vijay — check announcements for the latest schedule.</p>
              <span
                className="text-xs font-sans font-medium px-3 py-1.5 rounded-sm"
                style={{ color: 'rgba(244,239,230,0.5)', background: 'rgba(244,239,230,0.1)' }}
              >
                Link sent via email
              </span>
            </div>
          </div>
        </div>

        {/* Resources + Certificate */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Unlocked Resources */}
          <div className="rounded-sm p-6" style={{ background: '#FFFFFF', border: '1px solid rgba(168,216,206,0.4)' }}>
            <div className="flex items-center gap-2 mb-5">
              <BookOpen size={16} style={{ color: '#C4A052' }} />
              <h3 className="font-serif text-lg" style={{ color: '#242C2C', fontWeight: 300 }}>Resource Vault</h3>
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
                    <CheckCircle size={14} style={{ color: '#1A6B6B' }} className="shrink-0" />
                  ) : (
                    <Lock size={14} style={{ color: 'rgba(168,216,206,0.5)' }} className="shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-sans font-medium" style={{ color: res.unlocked ? '#242C2C' : 'rgba(36,44,44,0.35)' }}>{res.title}</p>
                    <p className="text-2xs font-sans capitalize" style={{ color: 'rgba(36,44,44,0.4)' }}>{res.type}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/resource-vault" className="text-xs font-sans font-medium transition-colors" style={{ color: '#1A6B6B' }}>
              View all resources →
            </Link>
          </div>

          {/* Certificate Status */}
          <div className="rounded-sm p-6" style={{ background: '#FFFFFF', border: '1px solid rgba(168,216,206,0.4)' }}>
            <div className="flex items-center gap-2 mb-5">
              <Award size={16} style={{ color: '#C4A052' }} />
              <h3 className="font-serif text-lg" style={{ color: '#242C2C', fontWeight: 300 }}>Certificates</h3>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="h-8 rounded animate-pulse" style={{ background: 'rgba(168,216,206,0.2)' }} />
                ))}
              </div>
            ) : enrolledPrograms.length === 0 ? (
              <p className="text-sm font-sans" style={{ color: 'rgba(36,44,44,0.4)' }}>Enrol in a program to earn certificates.</p>
            ) : (
              <div className="space-y-4">
                {enrolledPrograms.map(ep => (
                  <div key={ep.programId} className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: ep.progressPercent === 100 ? '#C4A052' : 'rgba(168,216,206,0.5)' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-sans font-medium truncate" style={{ color: '#242C2C' }}>{ep.programTitle}</p>
                      <p className="text-2xs font-sans" style={{ color: 'rgba(36,44,44,0.4)' }}>
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
