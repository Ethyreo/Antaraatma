'use client';
import React, { useEffect, useRef, useState } from 'react';

export default function InterruptionScene() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [blockVisible, setBlockVisible] = useState([false, false, false]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(true);
            [0, 1, 2].forEach(i => {
              setTimeout(() => {
                setBlockVisible(prev => {
                  const next = [...prev];
                  next[i] = true;
                  return next;
                });
              }, 200 + i * 180);
            });
          }
        });
      },
      { threshold: 0.08 }
    );
    if (sectionRef?.current) observer?.observe(sectionRef?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: '#0e0d0b',
        paddingTop: 'clamp(6rem, 14vw, 11rem)',
        paddingBottom: 'clamp(6rem, 14vw, 11rem)',
      }}
    >
      {/* Subtle ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(180,130,55,0.03) 0%, transparent 65%)',
        }}
      />

      <div className="editorial-container relative z-10">
        {/* Opening statement */}
        <div
          className="text-center mb-20 lg:mb-28"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 1s ease, transform 1s ease',
          }}
        >
          <p
            className="text-xs font-sans uppercase tracking-[0.2em] mb-10 inline-block"
            style={{ color: 'rgba(180,130,55,0.4)' }}
          >
            Why healing stalls
          </p>
          <h2
            className="font-serif text-balance mx-auto"
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 4.8rem)',
              color: 'rgba(232,224,208,0.9)',
              lineHeight: 1.0,
              maxWidth: '14ch',
            }}
          >
            Most people are not unwell.
          </h2>
          <h2
            className="font-serif text-balance mt-1 mx-auto"
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 4.8rem)',
              color: 'rgba(232,224,208,0.18)',
              lineHeight: 1.0,
              maxWidth: '14ch',
            }}
          >
            They are blocked.
          </h2>
        </div>

        {/* Three dimensions */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {[
            {
              number: '01',
              dimension: 'Physical',
              heading: 'The body carries what the mind cannot process.',
              body: 'Chronic pain, fatigue, digestive dysfunction — these are the body\'s language for unresolved patterns.',
              indent: 0,
            },
            {
              number: '02',
              dimension: 'Emotional',
              heading: 'Unprocessed emotions become physical symptoms.',
              body: 'Grief lives in the chest. Fear in the gut. The body keeps the score — and waits to be heard.',
              indent: 1,
            },
            {
              number: '03',
              dimension: 'Energetic',
              heading: 'Depletion is not a lifestyle problem. It is a signal.',
              body: 'When the body\'s energetic field is disrupted, no supplement or willpower restores vitality.',
              indent: 2,
            },
          ]?.map((block, idx) => (
            <div
              key={block?.number}
              className="py-10 lg:py-14 group"
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                opacity: blockVisible?.[idx] ? 1 : 0,
                transform: blockVisible?.[idx] ? 'translateY(0)' : 'translateY(18px)',
                transition: `opacity 0.8s ease, transform 0.8s ease`,
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
                <div className="lg:col-span-2 flex items-center gap-3 lg:pt-1">
                  <span
                    className="font-serif text-xs"
                    style={{ color: 'rgba(180,130,55,0.35)' }}
                  >
                    {block?.number}
                  </span>
                  <span
                    className="text-xs font-sans uppercase tracking-widest"
                    style={{ color: 'rgba(232,224,208,0.2)' }}
                  >
                    {block?.dimension}
                  </span>
                </div>
                <div className="lg:col-span-10">
                  <h3
                    className="font-serif mb-3 text-balance"
                    style={{
                      fontSize: 'clamp(1rem, 1.8vw, 1.4rem)',
                      color: 'rgba(232,224,208,0.72)',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {block?.heading}
                  </h3>
                  <p
                    className="font-sans font-light leading-relaxed max-w-[52ch]"
                    style={{ fontSize: '0.875rem', color: 'rgba(232,224,208,0.28)' }}
                  >
                    {block?.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resolution */}
        <div
          className="mt-16 lg:mt-24 text-center"
          style={{
            opacity: blockVisible?.[2] ? 1 : 0,
            transition: 'opacity 1s ease 0.4s',
          }}
        >
          <p
            className="font-serif text-balance leading-relaxed mx-auto"
            style={{
              fontSize: 'clamp(1rem, 1.8vw, 1.45rem)',
              color: 'rgba(232,224,208,0.4)',
              maxWidth: '44ch',
            }}
          >
            Naturopathy does not suppress these signals.{' '}
            <span style={{ color: 'rgba(232,224,208,0.78)' }}>
              It listens — and addresses what is actually causing them.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
