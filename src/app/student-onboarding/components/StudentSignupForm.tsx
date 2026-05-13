'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle, Phone, User, Mail, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface StudentSignupProps {
  invitedEmail?: string;
  invitedName?: string;
}

export default function StudentSignupForm({ invitedEmail = '', invitedName = '' }: StudentSignupProps) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    fullName: invitedName,
    email: invitedEmail,
    phone: '',
    password: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.fullName.trim()) { setError('Full name is required.'); return; }
    if (!form.email.trim()) { setError('Email is required.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }

    setLoading(true);
    try {
      // Sign up with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          data: {
            full_name: form.fullName.trim(),
            role: 'student',
          },
          emailRedirectTo: `${window.location.origin}/student-onboarding`,
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Complete signup - create profile and lead record
        await fetch('/api/students/complete-signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: data.user.id,
            email: form.email.trim(),
            fullName: form.fullName.trim(),
            phone: form.phone.trim() || null,
          }),
        });

        // Redirect to onboarding
        router.push('/student-onboarding');
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-xs font-sans font-medium text-stone-700 mb-1.5">
          <User size={11} className="inline mr-1" />
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.fullName}
          onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
          placeholder="Your full name"
          className="w-full px-3 py-2.5 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700 placeholder-stone-400"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-sans font-medium text-stone-700 mb-1.5">
          <Mail size={11} className="inline mr-1" />
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={form.email}
          onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          placeholder="you@example.com"
          readOnly={!!invitedEmail}
          className={`w-full px-3 py-2.5 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700 placeholder-stone-400 ${invitedEmail ? 'bg-stone-50 cursor-not-allowed' : ''}`}
          required
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-xs font-sans font-medium text-stone-700 mb-1.5">
          <Phone size={11} className="inline mr-1" />
          Phone Number <span className="text-stone-400 font-normal">(optional)</span>
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
          placeholder="+91 98765 43210"
          className="w-full px-3 py-2.5 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700 placeholder-stone-400"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-xs font-sans font-medium text-stone-700 mb-1.5">
          <Lock size={11} className="inline mr-1" />
          Create Password <span className="text-red-500">*</span>
        </label>
        <p className="text-xs font-sans text-stone-400 mb-1.5">At least 8 characters</p>
        <div className="relative">
          <input
            type={showPass ? 'text' : 'password'}
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            placeholder="Create a strong password"
            className="w-full px-3 py-2.5 pr-10 text-sm font-sans border border-stone-200 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-amber-600/40 text-stone-700 placeholder-stone-400"
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
          >
            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 text-xs font-sans text-red-600 bg-red-50 border border-red-200 rounded-sm px-3 py-2">
          <AlertCircle size={13} className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-amber-800 text-amber-50 py-3 text-sm font-sans font-medium rounded-sm transition-all hover:bg-amber-900 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <><Loader2 size={14} className="animate-spin" /> Creating account...</>
        ) : (
          <>Create Account <ArrowRight size={14} /></>
        )}
      </button>
    </form>
  );
}
