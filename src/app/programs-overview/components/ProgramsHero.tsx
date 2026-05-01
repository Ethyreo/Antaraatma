import React from 'react';

export default function ProgramsHero() {
  return (
    <section className="pt-32 pb-20" style={{ background: '#F4EFE6' }}>
      <div className="editorial-container">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px" style={{ background: '#1A6B6B', opacity: 0.4 }} />
            <span className="section-label">Learning Pathways</span>
          </div>
          <h1 className="font-serif text-display-lg text-balance leading-[1.08] mb-8" style={{ color: '#1A6B6B', fontWeight: 300, letterSpacing: '0.04em' }}>
            Healing is not a destination.<br />
            <span style={{ color: 'rgba(26,107,107,0.35)' }}>It is a structured ascent.</span>
          </h1>
          <p className="text-lg font-sans font-light leading-relaxed max-w-prose text-balance" style={{ color: 'rgba(36,44,44,0.55)', fontWeight: 300 }}>
            Each program in the Antaraatma pathway builds on the last — from a single hour of clarity to three months of complete transformation. The curriculum is designed to be experienced in sequence, though each stage stands on its own.
          </p>
        </div>
      </div>
    </section>
  );
}