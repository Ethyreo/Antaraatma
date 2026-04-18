'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

// --- Mobile zigzag reveal animation ---
// The reveal window travels in a zigzag (snake) path across the screen,
// revealing the BG image underneath as it moves, then exits and repeats.

function useMobileZigzagReveal(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  containerRef: React.RefObject<HTMLDivElement>,
  imgRef: React.RefObject<HTMLImageElement | null>,
  imgLoadedRef: React.RefObject<boolean>
) {
  const animRef = useRef<number>(0);
  const progressRef = useRef(0); // 0 → 1 across the full path

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Only run on mobile (touch devices / narrow screens)
    const isMobile = () => window.innerWidth < 1024;
    if (!isMobile()) return;

    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    // Build zigzag waypoints: start bottom-left, travel right, then next row left, etc.
    // Each row is a horizontal band; the window zigzags across them.
    const ROWS = 6; // number of horizontal passes
    const WINDOW_W = 160; // reveal window width
    const WINDOW_H = 110; // reveal window height
    const SPEED = 0.0018; // progress per frame (controls overall speed)

    const buildPath = (W: number, H: number) => {
      const points: { x: number; y: number }[] = [];
      const rowH = H / ROWS;
      // Start just off-screen bottom-left
      points.push({ x: -WINDOW_W, y: H + WINDOW_H });
      for (let r = 0; r < ROWS; r++) {
        const y = H - rowH * r - rowH / 2;
        if (r % 2 === 0) {
          // left → right
          points.push({ x: -WINDOW_W, y });
          points.push({ x: W + WINDOW_W, y });
        } else {
          // right → left
          points.push({ x: W + WINDOW_W, y });
          points.push({ x: -WINDOW_W, y });
        }
      }
      // Exit top
      points.push({ x: -WINDOW_W, y: -WINDOW_H * 2 });
      return points;
    };

    // Interpolate along the path given progress 0→1
    const getPos = (path: { x: number; y: number }[], t: number) => {
      if (path.length < 2) return path[0];
      // Compute total length for uniform speed
      const segments: number[] = [];
      let total = 0;
      for (let i = 1; i < path.length; i++) {
        const dx = path[i].x - path[i - 1].x;
        const dy = path[i].y - path[i - 1].y;
        const len = Math.sqrt(dx * dx + dy * dy);
        segments.push(len);
        total += len;
      }
      const target = t * total;
      let acc = 0;
      for (let i = 0; i < segments.length; i++) {
        if (acc + segments[i] >= target) {
          const local = (target - acc) / segments[i];
          return {
            x: path[i].x + (path[i + 1].x - path[i].x) * local,
            y: path[i].y + (path[i + 1].y - path[i].y) * local,
          };
        }
        acc += segments[i];
      }
      return path[path.length - 1];
    };

    let path = buildPath(canvas.width, canvas.height);

    const render = () => {
      if (!isMobile()) {
        animRef.current = requestAnimationFrame(render);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) { animRef.current = requestAnimationFrame(render); return; }

      const W = canvas.width;
      const H = canvas.height;

      // Rebuild path if canvas size changed
      if (path.length === 0 || path[1]?.y !== H - (H / ROWS) / 2) {
        path = buildPath(W, H);
      }

      progressRef.current += SPEED;
      if (progressRef.current > 1) progressRef.current = 0;

      const pos = getPos(path, progressRef.current);
      const cx = pos.x;
      const cy = pos.y;

      ctx.clearRect(0, 0, W, H);

      if (imgLoadedRef.current && imgRef.current) {
        const img = imgRef.current;

        // Draw dark overlay
        ctx.fillStyle = 'rgba(14,13,11,0.88)';
        ctx.fillRect(0, 0, W, H);

        // Clip to rounded reveal window
        const rx = WINDOW_W / 2;
        const ry = WINDOW_H / 2;
        let r = 18; // corner radius

        ctx.save();
        ctx.beginPath();
        // Rounded rect path
        ctx.moveTo(cx - rx + r, cy - ry);
        ctx.lineTo(cx + rx - r, cy - ry);
        ctx.quadraticCurveTo(cx + rx, cy - ry, cx + rx, cy - ry + r);
        ctx.lineTo(cx + rx, cy + ry - r);
        ctx.quadraticCurveTo(cx + rx, cy + ry, cx + rx - r, cy + ry);
        ctx.lineTo(cx - rx + r, cy + ry);
        ctx.quadraticCurveTo(cx - rx, cy + ry, cx - rx, cy + ry - r);
        ctx.lineTo(cx - rx, cy - ry + r);
        ctx.quadraticCurveTo(cx - rx, cy - ry, cx - rx + r, cy - ry);
        ctx.closePath();
        ctx.clip();

        // Draw image inside the clipped window
        const maxW = W * 0.9;
        const maxH = H * 0.9;
        const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
        const drawW = img.naturalWidth * scale;
        const drawH = img.naturalHeight * scale;
        const drawX = (W - drawW) / 2;
        const drawY = (H - drawH) / 2;
        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        // Subtle inner overlay to blend
        ctx.fillStyle = 'rgba(14,13,11,0.18)';
        ctx.fillRect(0, 0, W, H);

        ctx.restore();

        // Soft edge glow around the window
        const edgeGrad = ctx.createRadialGradient(cx, cy, Math.min(rx, ry) * 0.8, cx, cy, Math.max(rx, ry) * 1.4);
        edgeGrad.addColorStop(0, 'rgba(180,130,60,0.0)');
        edgeGrad.addColorStop(0.7, 'rgba(180,130,60,0.04)');
        edgeGrad.addColorStop(1, 'rgba(14,13,11,0.0)');
        ctx.fillStyle = edgeGrad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx * 1.4, ry * 1.4, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animRef.current);
      resizeObserver.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mobileCanvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const animFrameRef = useRef<number>(0);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const imgLoadedRef = useRef(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(timer);
  }, []);

  // Smooth parallax on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Preload the image
  useEffect(() => {
    const img = new window.Image();
    img.src = '/assets/images/Blue_White_Modern_Buy_1_Get_1_Promotion_Instagram_Post-1775409089496.png';
    img.onload = () => {
      imgRef.current = img;
      imgLoadedRef.current = true;
    };
  }, []);

  // Mobile zigzag reveal (uses mobileCanvasRef)
  useMobileZigzagReveal(mobileCanvasRef, containerRef, imgRef, imgLoadedRef);

  // Canvas spotlight render loop (desktop hover — uses canvasRef)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const RADIUS = 90;

    const render = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) { animFrameRef.current = requestAnimationFrame(render); return; }

      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const { x: mx, y: my } = mouseRef.current;
      const isHovering = mx > 0 && my > 0;

      if (imgLoadedRef.current && imgRef.current && isHovering) {
        const img = imgRef.current;

        // Draw image centered, fit to viewport (object-contain style — no stretching)
        const maxW = W * 0.85;
        const maxH = H * 0.85;
        const scale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight, 1);
        const drawW = img.naturalWidth * scale;
        const drawH = img.naturalHeight * scale;
        const drawX = (W - drawW) / 2;
        const drawY = (H - drawH) / 2;

        ctx.fillStyle = 'rgba(14,13,11,0.82)';
        ctx.fillRect(0, 0, W, H);

        ctx.save();
        ctx.beginPath();
        ctx.arc(mx, my, RADIUS, 0, Math.PI * 2);
        ctx.clip();

        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        ctx.fillStyle = 'rgba(14,13,11,0.22)';
        ctx.fillRect(0, 0, W, H);

        ctx.restore();

        const grad = ctx.createRadialGradient(mx, my, RADIUS * 0.72, mx, my, RADIUS);
        grad.addColorStop(0, 'rgba(14,13,11,0)');
        grad.addColorStop(1, 'rgba(14,13,11,0.92)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mx, my, RADIUS, 0, Math.PI * 2);
        ctx.fill();

        const glowGrad = ctx.createRadialGradient(mx, my, 0, mx, my, RADIUS * 0.9);
        glowGrad.addColorStop(0, 'rgba(180,130,60,0.07)');
        glowGrad.addColorStop(1, 'rgba(180,130,60,0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(mx, my, RADIUS * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      containerRef.current.style.setProperty('--mx', `${x * 100}%`);
      containerRef.current.style.setProperty('--my', `${y * 100}%`);
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseLeave = () => {
      mouseRef.current = { x: -999, y: -999 };
    };
    const el = containerRef.current;
    el?.addEventListener('mousemove', handleMouseMove as EventListener);
    el?.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el?.removeEventListener('mousemove', handleMouseMove as EventListener);
      el?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Parallax offset for content (subtle, GPU-accelerated)
  const parallaxOffset = scrollY * 0.18;

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{
        background: '#0e0d0b',
        '--mx': '30%',
        '--my': '40%',
      } as React.CSSProperties}
    >
      {/* Centered background image — always present, revealed by canvas spotlight */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/images/Blue_White_Modern_Buy_1_Get_1_Promotion_Instagram_Post-1775409089496.png"
        alt="Chakra meditation energy visualization"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
        style={{
          opacity: 0.0,
          objectPosition: 'center center',
          transform: `translateY(${parallaxOffset * 0.4}px) translateZ(0)`,
          willChange: 'transform',
        }}
        aria-hidden="true"
      />

      {/* Mobile zigzag reveal canvas — only visible on mobile (lg:hidden) */}
      <canvas
        ref={mobileCanvasRef}
        className="absolute inset-0 pointer-events-none lg:hidden"
        style={{ zIndex: 1 }}
      />

      {/* Desktop Canvas spotlight layer — hidden on mobile */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none hidden lg:block"
        style={{ zIndex: 1 }}
      />

      {/* Cursor-reactive ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: 'radial-gradient(ellipse 55% 45% at var(--mx) var(--my), rgba(180,130,60,0.06) 0%, transparent 70%)',
          transition: 'background 0.15s ease',
        }}
      />

      {/* Static ambient layers */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 55% at 12% 18%, rgba(160,120,50,0.04) 0%, transparent 55%)' }} />
        <div className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 45% 65% at 88% 82%, rgba(90,100,80,0.025) 0%, transparent 55%)' }} />
      </div>

      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{
          zIndex: 3,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* Main content — centered, constrained, staged reveal, parallax */}
      <div
        className="relative flex flex-col flex-1 justify-center items-center text-center pt-32 pb-24 px-6"
        style={{
          zIndex: 10,
          transform: `translateY(${-parallaxOffset}px) translateZ(0)`,
          willChange: 'transform',
        }}
      >
        <div className="max-w-2xl w-full mx-auto">
          {/* Eyebrow */}
          <p
            className="font-sans uppercase tracking-[0.22em] mb-14"
            style={{
              fontSize: '0.62rem',
              color: 'rgba(180,130,55,0.45)',
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s',
            }}
          >
            Naturopathy · Healing · Transformation
          </p>

          {/* Headline */}
          <h1
            className="font-serif leading-[1.0] mb-10 text-balance"
            style={{
              fontSize: 'clamp(3rem, 7vw, 6.5rem)',
              color: '#e8e0d0',
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(18px)',
              transition: 'opacity 1s ease 0.28s, transform 1s ease 0.28s',
            }}
          >
            Enter stillness.<br />
            <span style={{ color: 'rgba(200,155,70,0.55)' }}>Begin healing.</span>
          </h1>

          {/* Subtext */}
          <p
            className="font-sans font-light leading-relaxed mb-20 mx-auto"
            style={{
              fontSize: 'clamp(0.9rem, 1.4vw, 1.05rem)',
              color: 'rgba(220,210,195,0.32)',
              maxWidth: '36ch',
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 1s ease 0.48s, transform 1s ease 0.48s',
            }}
          >
            A guided journey from awareness to complete transformation.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 1s ease 0.65s, transform 1s ease 0.65s',
            }}
          >
            <Link
              href="/awareness-session"
              className="font-sans text-sm tracking-wide transition-all duration-300 group"
              style={{ color: 'rgba(200,155,70,0.85)' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#d4a855'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(200,155,70,0.85)'; }}
            >
              Join the Free Awareness Session
              <span
                className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1"
              >→</span>
            </Link>
            <Link
              href="/programs-overview"
              className="font-sans text-sm tracking-wide transition-all duration-300"
              style={{ color: 'rgba(220,210,195,0.28)' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'rgba(220,210,195,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(220,210,195,0.28)'; }}
            >
              Explore the Journey
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{
          zIndex: 10,
          opacity: loaded ? (scrollY > 50 ? 0 : 0.35) : 0,
          transition: 'opacity 0.6s ease 1.2s',
        }}
      >
        <div
          style={{
            width: '1px',
            height: '40px',
            background: 'linear-gradient(to bottom, rgba(180,130,55,0.5), transparent)',
            animation: 'scrollPulse 2s ease-in-out infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 0.7; transform: scaleY(1.15); }
        }
      `}</style>
    </section>
  );
}
