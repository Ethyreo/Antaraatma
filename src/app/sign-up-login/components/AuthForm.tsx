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
        <div className="w-7 h-7 rounded-sm bg-amber-700 flex items-center justify-center">
          <span className="font-serif text-amber-100 text-sm">V</span>
        </div>
        <span className="font-serif text-lg text-stone-800 tracking-tight">VijayHeals</span>
      </div>

      {/* Tab switcher */}
      <div className="flex border border-stone-200 rounded-sm p-0.5 mb-8 bg-stone-50">
        {(['login', 'signup'] as const).map((t) => (
          <button
            key={`tab-${t}`}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-sans font-500 rounded-sm transition-all duration-200 ${
              tab === t
                ? 'bg-white text-stone-800 shadow-card'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {t === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        ))}
      </div>

      {/* Login Form */}
      {tab === 'login' && (
        <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-sans font-500 text-stone-700 mb-1.5" htmlFor="login-email">
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
              <p className="text-xs text-red-600 mt-1">{loginForm.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-sans font-500 text-stone-700" htmlFor="login-password">
                Password
              </label>
              <button type="button" className="text-xs font-sans text-amber-700 hover:text-amber-800 transition-colors">
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {loginForm.formState.errors.password && (
              <p className="text-xs text-red-600 mt-1">{loginForm.formState.errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              className="w-3.5 h-3.5 rounded-sm border-stone-300 accent-amber-700"
              {...loginForm.register('remember')}
            />
            <label htmlFor="remember" className="text-xs font-sans text-stone-600">Remember me for 30 days</label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-amber-800 text-amber-50 py-3 text-sm font-sans font-500 tracking-wide rounded-sm transition-all duration-200 hover:bg-amber-900 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
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

          <p className="text-xs font-sans text-stone-400 text-center">
            New to VijayHeals?{' '}
            <button type="button" onClick={() => setTab('signup')} className="text-amber-700 font-500 hover:text-amber-800 transition-colors">
              Create an account
            </button>
          </p>
        </form>
      )}

      {/* Signup Form — Student enrollment flow */}
      {tab === 'signup' && (
        <div>
          <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-sm">
            <p className="text-xs font-sans text-amber-800 leading-relaxed">
              <span className="font-medium">Enrollment required:</span> You can only sign up if your email has been registered by an admin. Contact your program coordinator if you need access.
            </p>
          </div>
          <StudentSignupForm />
          <p className="mt-5 text-center text-xs font-sans text-stone-500">
            Already have an account?{' '}
            <button onClick={() => setTab('login')} className="text-amber-700 font-500 hover:text-amber-800 transition-colors">
              Sign in
            </button>
          </p>
        </div>
      )}
    </div>
  );
}