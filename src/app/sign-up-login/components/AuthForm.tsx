'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Check, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from 'sonner';

type LoginFormData = {
  email: string;
  password: string;
  remember: boolean;
};

type SignupFormData = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  terms: boolean;
};

// Mock credentials — Backend integration point: replace with real auth via /api/auth/login
const mockCredentials = [
  { role: 'Student', email: 'priya.student@vijayheals.com', password: 'Heal@2026' },
  { role: 'Admin', email: 'admin@vijayheals.com', password: 'Admin@2026' },
];

export default function AuthForm() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [showPass, setShowPass] = useState(false);
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const loginForm = useForm<LoginFormData>({ defaultValues: { email: '', password: '', remember: false } });
  const signupForm = useForm<SignupFormData>({ defaultValues: { fullName: '', email: '', phone: '', password: '', terms: false } });

  const handleCopy = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    // Backend integration point: POST /api/auth/login
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);

    const valid = mockCredentials.find((c) => c.email === data.email && c.password === data.password);
    if (!valid) {
      loginForm.setError('email', { message: 'Invalid credentials — use the demo accounts below to sign in' });
      return;
    }

    toast.success(`Welcome back! Redirecting to ${valid.role === 'Admin' ? 'admin' : 'student'} dashboard...`);
    setTimeout(() => {
      if (valid.role === 'Admin') window.location.href = '/admin-dashboard';
      else window.location.href = '/student-dashboard';
    }, 1000);
  };

  const handleSignupSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    // Backend integration point: POST /api/auth/register
    await new Promise((r) => setTimeout(r, 1400));
    setIsLoading(false);
    toast.success('Account created! Check your email to verify your address.');
  };

  const fillCredential = (cred: typeof mockCredentials[0]) => {
    loginForm.setValue('email', cred.email);
    loginForm.setValue('password', cred.password);
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
            style={{ minWidth: '100%' }}
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
        </form>
      )}

      {/* Signup Form */}
      {tab === 'signup' && (
        <form onSubmit={signupForm.handleSubmit(handleSignupSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-sans font-500 text-stone-700 mb-1.5" htmlFor="signup-name">
              Full name
            </label>
            <input
              id="signup-name"
              type="text"
              className="input-base"
              placeholder="Your full name"
              {...signupForm.register('fullName', { required: 'Full name is required', minLength: { value: 2, message: 'Name too short' } })}
            />
            {signupForm.formState.errors.fullName && (
              <p className="text-xs text-red-600 mt-1">{signupForm.formState.errors.fullName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-sans font-500 text-stone-700 mb-1.5" htmlFor="signup-email">
              Email address
            </label>
            <input
              id="signup-email"
              type="email"
              className="input-base"
              placeholder="you@example.com"
              {...signupForm.register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
              })}
            />
            {signupForm.formState.errors.email && (
              <p className="text-xs text-red-600 mt-1">{signupForm.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-sans font-500 text-stone-700 mb-1.5" htmlFor="signup-phone">
              Phone number
              <span className="ml-1 text-stone-400 font-400">(optional)</span>
            </label>
            <input
              id="signup-phone"
              type="tel"
              className="input-base"
              placeholder="+91 98765 43210"
              {...signupForm.register('phone')}
            />
          </div>

          <div>
            <label className="block text-xs font-sans font-500 text-stone-700 mb-1.5" htmlFor="signup-password">
              Create password
            </label>
            <p className="text-xs font-sans text-stone-400 mb-1.5">At least 8 characters with one uppercase and one number</p>
            <div className="relative">
              <input
                id="signup-password"
                type={showSignupPass ? 'text' : 'password'}
                className="input-base pr-10"
                placeholder="Create a strong password"
                {...signupForm.register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Minimum 8 characters' },
                  pattern: { value: /^(?=.*[A-Z])(?=.*\d)/, message: 'Must include uppercase and a number' },
                })}
              />
              <button
                type="button"
                onClick={() => setShowSignupPass(!showSignupPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                aria-label={showSignupPass ? 'Hide password' : 'Show password'}
              >
                {showSignupPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {signupForm.formState.errors.password && (
              <p className="text-xs text-red-600 mt-1">{signupForm.formState.errors.password.message}</p>
            )}
          </div>

          <div className="flex items-start gap-2">
            <input
              id="terms"
              type="checkbox"
              className="w-3.5 h-3.5 mt-0.5 rounded-sm border-stone-300 accent-amber-700"
              {...signupForm.register('terms', { required: 'You must accept the terms' })}
            />
            <label htmlFor="terms" className="text-xs font-sans text-stone-600 leading-snug">
              I agree to the{' '}
              <Link href="#" className="text-amber-700 hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="#" className="text-amber-700 hover:underline">Privacy Policy</Link>
            </label>
          </div>
          {signupForm.formState.errors.terms && (
            <p className="text-xs text-red-600">{signupForm.formState.errors.terms.message}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-amber-800 text-amber-50 py-3 text-sm font-sans font-500 tracking-wide rounded-sm transition-all duration-200 hover:bg-amber-900 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>
      )}

      {/* Demo credentials (login tab only) */}
      {tab === 'login' && (
        <div className="mt-8 border border-stone-200 rounded-sm p-4 bg-stone-50">
          <p className="text-xs font-sans font-600 uppercase tracking-wide text-stone-500 mb-3">Demo Accounts</p>
          <div className="space-y-2">
            {mockCredentials.map((cred) => (
              <div key={`demo-${cred.role.toLowerCase()}`} className="flex items-center justify-between gap-3 py-1.5">
                <div className="flex-1 min-w-0">
                  <span className={`status-badge text-2xs mb-1 ${cred.role === 'Admin' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-700'}`}>
                    {cred.role}
                  </span>
                  <p className="text-xs font-sans text-stone-600 truncate">{cred.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => fillCredential(cred)}
                  className="shrink-0 text-xs font-sans font-500 text-amber-700 hover:text-amber-800 border border-amber-200 hover:border-amber-400 px-2.5 py-1 rounded-sm transition-all"
                >
                  Use
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Switch tab link */}
      <p className="mt-6 text-center text-xs font-sans text-stone-500">
        {tab === 'login' ? (
          <>
            New to VijayHeals?{' '}
            <button onClick={() => setTab('signup')} className="text-amber-700 font-500 hover:text-amber-800 transition-colors">
              Create an account
            </button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <button onClick={() => setTab('login')} className="text-amber-700 font-500 hover:text-amber-800 transition-colors">
              Sign in
            </button>
          </>
        )}
      </p>
    </div>
  );
}