import React from 'react';
import AuthForm from './components/AuthForm';

export default function SignUpLoginPage() {
  return (
    <div className="min-h-screen flex" style={{ background: '#F4EFE6' }}>
      {/* Left brand panel — Style 01 Dark Teal */}
      <div
        className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-between p-12 xl:p-16 relative overflow-hidden"
        style={{ background: '#1A6B6B' }}
      >
        {/* Sacred geometry watermark */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.06]" aria-hidden="true">
          <svg width="500" height="500" viewBox="0 0 500 500" fill="none">
            <circle cx="250" cy="250" r="50" stroke="#F4EFE6" strokeWidth="0.8"/>
            <circle cx="250" cy="250" r="100" stroke="#F4EFE6" strokeWidth="0.8"/>
            <circle cx="250" cy="250" r="150" stroke="#F4EFE6" strokeWidth="0.8"/>
            <circle cx="250" cy="250" r="200" stroke="#F4EFE6" strokeWidth="0.8"/>
            <circle cx="250" cy="250" r="240" stroke="#F4EFE6" strokeWidth="0.8"/>
            <line x1="250" y1="10" x2="250" y2="490" stroke="#F4EFE6" strokeWidth="0.5"/>
            <line x1="10" y1="250" x2="490" y2="250" stroke="#F4EFE6" strokeWidth="0.5"/>
            <circle cx="250" cy="250" r="5" fill="#C4A052"/>
          </svg>
        </div>

        {/* Ambient teal gradient */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 20% 30%, rgba(95,189,189,0.12) 0%, transparent 60%)' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-16">
            <div className="w-8 h-8 rounded-sm flex items-center justify-center" style={{ background: 'rgba(244,239,230,0.15)' }}>
              <span className="font-serif text-sm" style={{ color: '#F4EFE6', fontWeight: 300 }}>A</span>
            </div>
            <span className="font-serif text-xl tracking-[0.08em]" style={{ color: '#F4EFE6', fontWeight: 300 }}>ANTARAATMA</span>
          </div>

          <h2 className="font-serif text-display-md text-balance mb-5 leading-tight" style={{ color: '#F4EFE6', fontWeight: 300, letterSpacing: '0.04em' }}>
            Your healing journey begins with a single step
          </h2>
          <p className="text-sm font-sans font-light leading-relaxed max-w-sm text-balance" style={{ color: 'rgba(244,239,230,0.55)', fontWeight: 300 }}>
            Join 2,400+ students who have already begun their transformation through Dr. Vijay&apos;s structured naturopathy pathway.
          </p>

          {/* Sacred Gold rule */}
          <div className="flex items-center gap-3 mt-10">
            <div className="w-10 h-px" style={{ background: '#C4A052', opacity: 0.6 }} />
            <span className="text-xs font-sans uppercase tracking-[0.15em]" style={{ color: '#C4A052', opacity: 0.8, fontWeight: 600 }}>
              Heal Within · Rise Higher
            </span>
          </div>
        </div>

        {/* Testimonial — pull quote style */}
        <div className="relative z-10">
          <div className="w-8 h-px mb-5" style={{ background: '#C4A052', opacity: 0.5 }} />
          <blockquote className="font-serif text-base italic leading-relaxed mb-5" style={{ color: 'rgba(244,239,230,0.65)', fontWeight: 300 }}>
            &ldquo;I was sceptical. Ninety minutes with Dr. Vijay changed that completely. I enrolled in Foundation the same evening.&rdquo;
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(244,239,230,0.12)' }}>
              <span className="font-serif text-sm" style={{ color: '#A8D8CE', fontWeight: 400 }}>M</span>
            </div>
            <div>
              <p className="text-xs font-sans" style={{ color: 'rgba(244,239,230,0.6)', fontWeight: 500 }}>Meera Krishnan</p>
              <p className="text-xs font-sans" style={{ color: 'rgba(244,239,230,0.3)', fontWeight: 400 }}>Foundation Course · Chennai</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12" style={{ background: '#F4EFE6' }}>
        <AuthForm />
      </div>
    </div>
  );
}