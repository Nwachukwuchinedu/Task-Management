"use client";

import React, { useEffect, useRef } from "react";
import { ArrowRight, PlayCircle } from "@phosphor-icons/react";
import InteractiveMockup from "./InteractiveMockup";
import MagneticButton from "./MagneticButton";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Hero = () => {
  const wordmarkContainerRef = useRef<HTMLDivElement>(null);
  const wordmarkSharpRef = useRef<HTMLHeadingElement>(null);
  const subtitleContainerRef = useRef<HTMLDivElement>(null);
  const subtitleSharpRef = useRef<HTMLParagraphElement>(null);
  const buttonsContainerRef = useRef<HTMLDivElement>(null);
  const buttonsSharpRef = useRef<HTMLDivElement>(null);

  const cursorRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const idleTextRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  // Store coordinates without causing React state re-renders
  const mouse = useRef({ x: -1000, y: -1000 });
  const lerped = useRef({ x: -1000, y: -1000 });
  const hasMoved = useRef(false);
  const idleTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let frameId: number;

    // Center initial internal coordinates offscreen to prevent flash
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    mouse.current = { x: cx, y: cy };
    lerped.current = { x: cx, y: cy };

    // Set idle timeout: Show hint if no movement after 2s
    idleTimeout.current = setTimeout(() => {
      if (!hasMoved.current && idleTextRef.current) {
        idleTextRef.current.style.opacity = '1';
      }
    }, 2000);

    const handleMouseMove = (e: MouseEvent) => {
      if (!hasMoved.current) {
        hasMoved.current = true;
        if (idleTextRef.current) idleTextRef.current.style.opacity = '0';
        if (cursorRef.current) cursorRef.current.style.opacity = '1';
        if (indicatorRef.current) indicatorRef.current.style.opacity = '1';
      }
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Helper to calculate cursor position relative to an element's bounding box
    const updateMaskPosition = (container: HTMLElement | null, target: HTMLElement | null) => {
      if (!container || !target) return;
      const rect = container.getBoundingClientRect();
      const relativeX = ((lerped.current.x - rect.left) / rect.width) * 100;
      const relativeY = ((lerped.current.y - rect.top) / rect.height) * 100;
      target.style.setProperty('--mask-cx', `${relativeX}%`);
      target.style.setProperty('--mask-cy', `${relativeY}%`);
    };

    const animate = () => {
      if (hasMoved.current) {
        // Lerp equation for smooth heavy following
        lerped.current.x += (mouse.current.x - lerped.current.x) * 0.12;
        lerped.current.y += (mouse.current.y - lerped.current.y) * 0.12;

        // 1. Update Focus Masks
        updateMaskPosition(wordmarkContainerRef.current, wordmarkSharpRef.current);
        updateMaskPosition(subtitleContainerRef.current, subtitleSharpRef.current);
        updateMaskPosition(buttonsContainerRef.current, buttonsSharpRef.current);

        // 2. Update Focus Indicator (Lerped, smooth follow)
        if (indicatorRef.current) {
          indicatorRef.current.style.transform = `translate(${lerped.current.x}px, ${lerped.current.y}px)`;
        }
      }

      // 3. Update Custom Cursor Dot (Instant snapping)
      if (hasMoved.current && cursorRef.current) {
        cursorRef.current.style.transform = `translate(${mouse.current.x}px, ${mouse.current.y}px)`;
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
    };
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full overflow-hidden flex flex-col items-center justify-start select-none font-sans text-text-main pt-32 md:pt-40 bg-background"
    >
      <style>{`
        /* Hide default cursor globally within the hero, but allow normal cursor on buttons */
        .hero-cursor-none {
          cursor: none;
        }
        .hero-cursor-none button, .hero-cursor-none a {
          cursor: pointer !important;
        }

        :root {
          --mask-cx: -100%;
          --mask-cy: -100%;
        }

        .halftone {
          filter: url(#halftone-filter);
        }

        .blurry-base {
          filter: blur(8px) url(#halftone-filter);
          opacity: 0.6;
        }

        .focus-mask {
          mask-image: radial-gradient(
            ellipse 350px 250px at var(--mask-cx) var(--mask-cy),
            black 0%,
            black 35%,
            rgba(0,0,0,0.5) 55%,
            transparent 75%
          );
          -webkit-mask-image: radial-gradient(
            ellipse 350px 250px at var(--mask-cx) var(--mask-cy),
            black 0%,
            black 35%,
            rgba(0,0,0,0.5) 55%,
            transparent 75%
          );
        }

        .animate-spin-slow { animation: spin-slow 6s linear infinite; }
        .animate-spin-reverse-slow { animation: spin-reverse-slow 4s linear infinite; }
        
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spin-reverse-slow { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      `}</style>

      {/* Background Glows (Moved to back layer) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="glow-blob bg-primary w-[500px] h-[500px] top-[-150px] left-[-150px]"></div>
        <div className="glow-blob bg-accent w-[600px] h-[600px] top-[20%] right-[-200px]"></div>
      </div>

      {/* SVG Halftone Filter Definition */}
      <svg className="absolute w-0 h-0 invisible">
        <filter id="halftone-filter">
          <feTurbulence baseFrequency="0.9" numOctaves="1" type="turbulence" result="noise" />
          <feComposite operator="in" in="noise" in2="SourceGraphic" result="composite" />
          <feBlend mode="multiply" in="composite" in2="SourceGraphic" />
        </filter>
      </svg>

      {/* Custom Cursor Dot */}
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 pointer-events-none z-[100] opacity-0 mix-blend-difference hidden md:block"
      >
        <div className="w-[12px] h-[12px] bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Focus Indicator Reticle */}
      <div 
        ref={indicatorRef}
        className="fixed top-0 left-0 pointer-events-none z-[90] opacity-0 transition-opacity duration-500 mix-blend-difference hidden md:block"
      >
        <div className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
          {/* Outer Ring */}
          <div className="absolute w-[90px] h-[90px] rounded-full border-[1.5px] animate-spin-slow" style={{ borderColor: 'rgba(255,255,255,0.4)' }} />
          {/* Inner Ring */}
          <div className="absolute w-[52px] h-[52px] rounded-full border animate-spin-reverse-slow" style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
          {/* Center Dot */}
          <div className="absolute w-[7px] h-[7px] rounded-full bg-white" />
        </div>
      </div>

      {/* Idle Hint Text */}
      <div 
        ref={idleTextRef}
        className="fixed bottom-[15%] left-1/2 -translate-x-1/2 font-sans text-[10px] uppercase tracking-[0.2em] text-text-muted opacity-0 transition-opacity duration-1000 pointer-events-none z-40 hidden md:block"
      >
        Move your cursor
      </div>

      {/* Main Content Containers */}
      <div className="relative flex flex-col items-center z-20 text-center px-4 w-full max-w-5xl hero-cursor-none">
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Taski 2.0 is live
        </div>

        {/* Wordmark Container */}
        <div className="relative mb-6 w-full flex justify-center" ref={wordmarkContainerRef}>
          {/* Base Blurry Layer */}
          <h1 className="font-heading text-[50px] md:text-[80px] lg:text-[96px] font-[800] leading-[1.05] tracking-[-2px] blurry-base text-text-main max-w-4xl">
            Manage Team Work <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-cyan-glow">
              Without Chaos.
            </span>
          </h1>
          {/* Sharp Focal Mask Layer */}
          <h1 
            ref={wordmarkSharpRef}
            className="font-heading text-[50px] md:text-[80px] lg:text-[96px] font-[800] leading-[1.05] tracking-[-2px] absolute top-0 w-full max-w-4xl focus-mask halftone text-text-main"
          >
            Manage Team Work <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-cyan-glow">
              Without Chaos.
            </span>
          </h1>
        </div>

        {/* Subtitle Container */}
        <div className="relative w-full max-w-[650px] mb-12 flex justify-center" ref={subtitleContainerRef}>
          {/* Base Blurry Layer */}
          <p className="text-lg md:text-xl text-text-muted leading-relaxed font-sans blurry-base w-full">
            Plan projects, organize tasks, and collaborate visually with a modern workflow system built for fast-moving teams.
          </p>
          {/* Sharp Focal Mask Layer */}
          <p 
            ref={subtitleSharpRef}
            className="text-lg md:text-xl text-text-muted leading-relaxed font-sans absolute top-0 w-full focus-mask halftone"
          >
            Plan projects, organize tasks, and collaborate visually with a modern workflow system built for fast-moving teams.
          </p>
        </div>

        {/* Buttons */}
        <div className="relative flex flex-wrap items-center justify-center gap-4 z-30 mb-8" ref={buttonsContainerRef}>
          {/* Base Blurry Layer */}
          <div className="flex flex-wrap items-center justify-center gap-4 blurry-base">
            <MagneticButton>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-cyan-glow rounded-full blur opacity-75"></div>
                <button className="relative bg-text-main text-background font-bold px-8 py-4 rounded-full text-base flex items-center gap-2 font-sans tracking-tight pointer-events-none">
                  Start Free Trial
                  <ArrowRight weight="bold" />
                </button>
              </div>
            </MagneticButton>
            <MagneticButton>
              <button className="bg-surface/50 backdrop-blur-md border border-surface-border text-text-main font-medium px-8 py-4 rounded-full text-base flex items-center gap-2 font-sans pointer-events-none">
                <PlayCircle size={24} weight="fill" className="text-text-muted" />
                Watch Demo
              </button>
            </MagneticButton>
          </div>
          
          {/* Sharp Focal Layer (Actual clickable buttons) */}
          <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-4 focus-mask halftone" ref={buttonsSharpRef}>
            <MagneticButton>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-cyan-glow rounded-full blur opacity-75"></div>
                <button className="relative bg-text-main text-background font-bold px-8 py-4 rounded-full text-base hover:scale-[1.02] transition-transform flex items-center gap-2 font-sans tracking-tight">
                  Start Free Trial
                  <ArrowRight weight="bold" />
                </button>
              </div>
            </MagneticButton>
            <MagneticButton>
              <button className="bg-surface/50 backdrop-blur-md border border-surface-border text-text-main font-medium px-8 py-4 rounded-full text-base hover:bg-surface transition-colors flex items-center gap-2 font-sans group">
                <PlayCircle size={24} weight="fill" className="text-text-muted group-hover:text-text-main transition-colors" />
                Watch Demo
              </button>
            </MagneticButton>
          </div>
        </div>

      </div>

      {/* Hero Interactive Mockup - Pushed down, negative margin so it enters hero space behind gradient blur */}
      <div className="relative z-10 w-full max-w-[90rem] px-6 lg:px-12 -mt-16 md:-mt-32 pt-24 md:pt-40">
        {/* Top Fade to blend mockup into hero background naturally */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background to-transparent z-20 pointer-events-none"></div>
        <div className="transition-transform duration-500 hover:rotate-0 [perspective:1000px] [transform:rotateX(5deg)_rotateY(0deg)_scale(0.95)] hover:scale-100 relative">
           <InteractiveMockup />
        </div>
      </div>

    </section>
  );
};

export default Hero;
