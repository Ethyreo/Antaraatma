import React from 'react';

const stages = [
  { step: '01', label: 'Awareness', time: '1 hour', description: 'Begin with clarity. Understand why your body holds illness and what your specific healing path looks like.' },
  { step: '02', label: 'Implementation', time: '3 days', description: 'Move from understanding to practice. Reset your physical and energetic body in three focused sessions.' },
  { step: '03', label: 'Transformation', time: '3 months', description: 'Commit to deep, guided healing. Address every dimension — physical, emotional, and energetic — with ongoing support.' },
];

export default function ProgramsJourneyExplainer() {
  return (
    <section className="py-20 bg-stone-50 border-y border-stone-200/60">
      <div className="editorial-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-stone-200/60">
          {stages?.map((stage) => (
            <div key={stage?.step} className="bg-stone-50 p-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="font-serif text-3xl text-stone-300">{stage?.step}</span>
                <div>
                  <p className="text-xs font-sans font-medium text-stone-400 uppercase tracking-widest">{stage?.time}</p>
                  <p className="font-sans font-semibold text-sm text-amber-800 uppercase tracking-wider mt-0.5">{stage?.label}</p>
                </div>
              </div>
              <p className="text-sm font-sans font-light text-stone-500 leading-relaxed">{stage?.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
