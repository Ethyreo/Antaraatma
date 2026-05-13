'use client';
import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import StudentSignupForm from '@/app/student-onboarding/components/StudentSignupForm';

type LoginFormData = {
  email: string;
  password: string;
  remember: boolean;
};

export default function AuthForm() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const loginForm = useForm<LoginFormData>({ defaultValues: { email: '', password: '', remember: false } });

  const handleLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        loginForm.setError('email', { message: error.message });
        setIsLoading(false);
        return;
      }

      if (authData.user) {
        // Fetch role from user_profiles
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role, onboarding_completed')
          .eq('id', authData.user.id)
          .single();

        const role = profile?.role || authData.user.user_metadata?.role || 'student';

        toast.success(`Welcome back! Redirecting...`);
        setTimeout(() => {
          if (role === 'admin') {
            router.push('/admin-dashboard');
          } else if (!profile?.onboarding_completed) {
            router.push('/student-onboarding');
          } else {
            router.push('/student-dashboard');
          }
        }, 800);
      }
    } catch (err: any) {
      loginForm.setError('email', { message: err.message || 'Login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm xl:max-w-md">
      <Toaster position="bottom-right" richColors />

      {/* Logo (mobile only) */}
      <div className="flex items-center gap-2 mb-10 lg:hidden">
        <div className="w-7 h-7 rounded-sm flex items-center justify-center" style={{ background: '#1A6B6B' }}>
          <span className="font-serif text-sm" style={{ color: '#F4EFE6', fontWeight: 300 }}>A</span>
        </div>
        <span className="font-serif text-lg tracking-[0.08em]" style={{ color: '#1A6B6B', fontWeight: 300 }}>ANTARAATMA</span>
      </div>

      {/* Tab switcher */}
      <div className="flex rounded-sm p-0.5 mb-8" style={{ border: '1px solid rgba(168,216,206,0.5)', background: 'rgba(212,237,232,0.3)' }}>
        {(['login', 'signup'] as const).map((t) => (
          <button
            key={`tab-${t}`}
            onClick={() => setTab(t)}
            className="flex-1 py-2 text-sm font-sans rounded-sm transition-all duration-200"
            style={tab === t
              ? { background: 'white', color: '#1A6B6B', fontWeight: 600, boxShadow: '0 1px 3px rgba(26,107,107,0.08)' }
              : { color: 'rgba(36,44,44,0.5)', fontWeight: 400 }
            }
          >
            {t === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        ))}
      </div>

      {/* Login Form */}
      {tab === 'login' && (
        <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-sans mb-1.5" style={{ color: '#242C2C', fontWeight: 500 }} htmlFor="login-email">
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              className="input-base"
              placeholder="you@example.com"
              {...loginForm.register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
              })}
            />
            {loginForm.formState.errors.email && (
              <p className="text-xs mt-1" style={{ color: '#c0392b' }}>{loginForm.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-sans" style={{ color: '#242C2C', fontWeight: 500 }} htmlFor="login-password">
                Password
              </label>
              <button type="button" className="text-xs font-sans transition-colors" style={{ color: '#1A6B6B', fontWeight: 500 }}>
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                className="input-base pr-10"
                placeholder="Your password"
                {...loginForm.register('password', { required: 'Password is required' })}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: 'rgba(36,44,44,0.4)' }}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {loginForm.formState.errors.password && (
              <p className="text-xs mt-1" style={{ color: '#c0392b' }}>{loginForm.formState.errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              className="w-3.5 h-3.5 rounded-sm"
              style={{ accentColor: '#1A6B6B' }}
              {...loginForm.register('remember')}
            />
            <label htmlFor="remember" className="text-xs font-sans" style={{ color: 'rgba(36,44,44,0.6)', fontWeight: 400 }}>Remember me for 30 days</label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-sans tracking-wide rounded-sm transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: '#1A6B6B', color: '#F4EFE6', fontWeight: 600 }}
            onMouseEnter={e => { if (!isLoading) (e.currentTarget.style.background = '#155858'); }}
            onMouseLeave={e => { if (!isLoading) (e.currentTarget.style.background = '#1A6B6B'); }}
          >
            {isLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={15} />
              </>
            )}
          </button>

          <p className="text-xs font-sans text-center" style={{ color: 'rgba(36,44,44,0.45)', fontWeight: 400 }}>
            New to Antaraatma?{' '}
            <button type="button" onClick={() => setTab('signup')} className="transition-colors" style={{ color: '#1A6B6B', fontWeight: 600 }}>
              Create an account
            </button>
          </p>
        </form>
      )}

      {/* Signup Form */}
      {tab === 'signup' && (
        <div>
          <StudentSignupForm />
          <p className="mt-5 text-center text-xs font-sans" style={{ color: 'rgba(36,44,44,0.5)', fontWeight: 400 }}>
            Already have an account?{' '}
            <button onClick={() => setTab('login')} className="transition-colors" style={{ color: '#1A6B6B', fontWeight: 600 }}>
              Sign in
            </button>
          </p>
        </div>
      )}
    </div>
  );
}