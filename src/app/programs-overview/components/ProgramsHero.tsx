import React from 'react';

export default function ProgramsHero() {
  return (
    <section className="pt-32 pb-20 bg-[#FAF8F4]">
      <div className="editorial-container">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-amber-700/40" />
            <span className="section-label">Learning Pathways</span>
          </div>
          <h1 className="font-serif text-display-lg text-stone-900 text-balance leading-[1.08] mb-8">
            Healing is not a destination.<br />
            <span className="text-stone-500">It is a structured ascent.</span>
          </h1>
          <p className="text-lg font-sans font-light text-stone-500 leading-relaxed max-w-prose text-balance">
            Each program in the VijayHeals pathway builds on the last — from a single hour of clarity to three months of complete transformation. The curriculum is designed to be experienced in sequence, though each stage stands on its own.
          </p>
        </div>
      </div>
    </section>
  );
}