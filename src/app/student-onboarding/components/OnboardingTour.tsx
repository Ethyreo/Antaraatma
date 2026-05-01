'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2, X, BookOpen, Users, BarChart2, Sparkles, Calendar, Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface OnboardingTourProps {
  userId: string;
  userName: string;
}

const tourSteps = [
  {
    icon: <Sparkles size={28} className="text-amber-700" />,
    title: 'Welcome to Antaraatma',
    desc: 'Your personal healing journey starts here. This platform is designed to guide you through transformation — body, mind, and energy.',
    highlight: null,
  },
  {
    icon: <BookOpen size={28} className="text-amber-700" />,
    title: 'Your Learning Dashboard',
    desc: 'Access your enrolled programs, track lesson progress, and pick up right where you left off — all from your student dashboard.',
    highlight: '/student-dashboard',
  },
  {
    icon: <BarChart2 size={28} className="text-amber-700" />,
    title: 'Track Your Progress',
    desc: 'Monitor your healing journey with visual progress tracking. See completed lessons, milestones, and your overall transformation score.',
    highlight: '/progress-tracking',
  },
  {
    icon: <Users size={28} className="text-amber-700" />,
    title: 'Join the Community',
    desc: 'Connect with fellow healers. Share gratitude, healing wins, and reflections in our supportive community space.',
    highlight: '/community',
  },
  {
    icon: <Heart size={28} className="text-amber-700" />,
    title: 'Resources & Tools',
    desc: 'Access guided meditations, worksheets, ebooks, and audio resources curated for your program.',
    highlight: '/resource-vault',
  },
];

export default function OnboardingTour({ userId, userName }: OnboardingTourProps) {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [showOptionalForm, setShowOptionalForm] = useState(false);
  const [formData, setFormData] = useState({
    date_of_birth: '',
    city: '',
    bio: '',
    health_goals: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const isLastTourStep = step === tourSteps.length - 1;

  const handleFinishTour = () => {
    setShowOptionalForm(true);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updates: Record<string, any> = { userId, onboarding_completed: true };
      if (formData.date_of_birth) updates.date_of_birth = formData.date_of_birth;
      if (formData.city) updates.city = formData.city;
      if (formData.bio) updates.bio = formData.bio;
      if (formData.health_goals) updates.health_goals = formData.health_goals;

      await fetch('/api/students/update-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      setSaved(true);
      setTimeout(() => router.push('/student-dashboard'), 1500);
    } catch {
      // still redirect
      router.push('/student-dashboard');
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    await fetch('/api/students/update-profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, onboarding_completed: true }),
    });
    router.push('/student-dashboard');
  };

  if (showOptionalForm) {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Calendar size={22} className="text-amber-700" />
          </div>
          <h2 className="font-serif text-2xl text-stone-800 mb-2">Complete Your Profile</h2>
          <p className="text-sm font-sans text-stone-500">These details help us personalise your healing journey. All fields are optional.</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-sm p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans font-medium text-stone-700 mb-1.5">Date of Birth</label>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={e => setFormData(p => ({ ...p, date_of_birth: e.target.value }))}
                className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700"
              />
            </div>
            <div>
              <label className="block text-xs font-sans font-medium text-stone-700 mb-1.5">City / Location</label>
              <input
                type="text"
                value={formData.city}
                onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                placeholder="e.g. Mumbai"
                className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700 placeholder-stone-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-stone-700 mb-1.5">About You</label>
            <textarea
              value={formData.bio}
              onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))}
              placeholder="A short introduction about yourself..."
              rows={2}
              className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700 placeholder-stone-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-medium text-stone-700 mb-1.5">Your Health Goals</label>
            <textarea
              value={formData.health_goals}
              onChange={e => setFormData(p => ({ ...p, health_goals: e.target.value }))}
              placeholder="What do you hope to achieve through this program?"
              rows={3}
              className="w-full px-3 py-2 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700 placeholder-stone-400 resize-none"
            />
          </div>

          {saved && (
            <div className="flex items-center gap-2 text-xs font-sans text-green-700 bg-green-50 border border-green-200 rounded-sm px-3 py-2">
              <CheckCircle2 size={13} />
              Profile saved! Redirecting to your dashboard...
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 py-2.5 text-sm font-sans text-stone-500 border border-stone-200 rounded-sm hover:bg-stone-50 transition-colors"
            >
              Skip for now
            </button>
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-sans font-medium bg-amber-800 text-amber-50 rounded-sm hover:bg-amber-900 transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
              {saving ? 'Saving...' : 'Save & Continue'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const current = tourSteps[step];

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {tourSteps.map((_, i) => (
          <div
            key={i}
            className={`rounded-full transition-all duration-300 ${i === step ? 'w-6 h-2 bg-amber-700' : i < step ? 'w-2 h-2 bg-amber-400' : 'w-2 h-2 bg-stone-200'}`}
          />
        ))}
      </div>

      {/* Card */}
      <div className="bg-white border border-stone-200 rounded-sm p-8 text-center shadow-sm">
        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-5">
          {current.icon}
        </div>

        <h2 className="font-serif text-xl text-stone-800 mb-3">{current.title}</h2>
        <p className="text-sm font-sans text-stone-500 leading-relaxed mb-6">{current.desc}</p>

        {current.highlight && (
          <div className="inline-flex items-center gap-1.5 text-xs font-sans text-amber-700 bg-amber-50 border border-amber-200 rounded-sm px-3 py-1.5 mb-6">
            <ArrowRight size={11} />
            Navigate to <span className="font-medium">{current.highlight}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-sans text-stone-600 border border-stone-200 rounded-sm hover:bg-stone-50 transition-colors"
            >
              <ArrowLeft size={13} /> Back
            </button>
          )}
          <button
            onClick={isLastTourStep ? handleFinishTour : () => setStep(s => s + 1)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-sans font-medium bg-amber-800 text-amber-50 rounded-sm hover:bg-amber-900 transition-colors"
          >
            {isLastTourStep ? (
              <><CheckCircle2 size={13} /> Complete Tour</>
            ) : (
              <>Next <ArrowRight size={13} /></>
            )}
          </button>
        </div>
      </div>

      {/* Skip tour */}
      {!isLastTourStep && (
        <button
          onClick={handleFinishTour}
          className="mt-4 w-full text-xs font-sans text-stone-400 hover:text-stone-600 transition-colors flex items-center justify-center gap-1"
        >
          <X size={11} /> Skip tour
        </button>
      )}
    </div>
  );
}
