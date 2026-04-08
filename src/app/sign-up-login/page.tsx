import React from 'react';
import AuthForm from './components/AuthForm';

export default function SignUpLoginPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F4] flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 bg-stone-900 flex-col justify-between p-12 xl:p-16 relative overflow-hidden">
        {/* Subtle background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(201,168,76,0.08)_0%,transparent_60%),radial-gradient(ellipse_at_80%_80%,rgba(122,140,110,0.06)_0%,transparent_50%)]" />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-16">
            <div className="w-8 h-8 rounded-sm bg-amber-700 flex items-center justify-center">
              <span className="font-serif text-amber-100 text-sm">V</span>
            </div>
            <span className="font-serif text-xl text-stone-200 tracking-tight">VijayHeals</span>
          </div>

          <h2 className="font-serif text-display-md text-stone-100 text-balance mb-5 leading-tight">
            Your healing journey begins with a single step
          </h2>
          <p className="text-sm font-sans font-300 text-stone-500 leading-relaxed max-w-sm text-balance">
            Join 2,400+ students who have already begun their transformation through Dr. Vijay&apos;s structured naturopathy pathway.
          </p>
        </div>

        {/* Testimonial */}
        <div className="relative z-10">
          <blockquote className="font-serif text-base text-stone-400 italic leading-relaxed mb-5">
            &ldquo;I was sceptical. Ninety minutes with Dr. Vijay changed that completely. I enrolled in Foundation the same evening.&rdquo;
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-900/50 flex items-center justify-center">
              <span className="font-serif text-sm text-amber-400">M</span>
            </div>
            <div>
              <p className="text-xs font-sans font-500 text-stone-400">Meera Krishnan</p>
              <p className="text-xs font-sans text-stone-600">Foundation Course · Chennai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12">
        <AuthForm />
      </div>
    </div>
  );
}