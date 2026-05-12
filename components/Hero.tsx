"use client";

import React from "react";
import { ArrowRight, PlayCircle } from "@phosphor-icons/react";
import InteractiveMockup from "./InteractiveMockup";
import MagneticButton from "./MagneticButton";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Hero = () => {
  useGSAP(() => {
    gsap.from(".gs-reveal", {
      opacity: 0,
      scale: 0.95,
      y: 20,
      duration: 1,
      ease: "power2.out",
      stagger: 0.2,
    });
  }, []);

  return (
    <section className="relative pt-40 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-screen flex items-center">
      {/* Background Glows */}
      <div className="glow-blob bg-primary w-[500px] h-[500px] top-[-150px] left-[-150px]"></div>
      <div className="glow-blob bg-accent w-[600px] h-[600px] top-[20%] right-[-200px]"></div>
      <div className="glow-blob bg-cyan-glow w-[700px] h-[700px] bottom-[-200px] left-[10%]"></div>
      <div className="glow-blob bg-purple-600 w-[400px] h-[400px] bottom-[30%] right-[10%]"></div>

      <div className="max-w-[90rem] mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-center">
        {/* Hero Content */}
        <div className="relative z-10 gs-reveal">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Nova 2.0 is live
          </div>

          <h1 className="font-heading text-[50px] md:text-[68px] font-[800] leading-[1.05] tracking-[-2px] mb-6 text-white">
            Manage Team Work <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-cyan-glow">
              Without Chaos.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-text-muted leading-relaxed mb-10 max-w-lg font-sans">
            Plan projects, organize tasks, and collaborate visually with a modern workflow system built for fast-moving
            teams.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-12">
            <MagneticButton>
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-cyan-glow rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                <button className="relative bg-white text-gray-950 font-bold px-8 py-4 rounded-full text-base hover:scale-[1.02] transition-transform flex items-center gap-2 font-sans tracking-tight">
                  Start Free Trial
                  <ArrowRight weight="bold" />
                </button>
              </div>
            </MagneticButton>
            <MagneticButton>
              <button className="bg-surface/50 backdrop-blur-md border border-white/10 text-white font-medium px-8 py-4 rounded-full text-base hover:bg-white/5 transition-colors flex items-center gap-2 font-sans group">
                <PlayCircle size={24} weight="fill" className="text-text-muted group-hover:text-white transition-colors" />
                Watch Demo
              </button>
            </MagneticButton>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[41, 42, 43, 44].map((img) => (
                <img
                  key={img}
                  className="w-10 h-10 rounded-full border-2 border-background object-cover"
                  src={`https://i.pravatar.cc/100?img=${img}`}
                  alt="Avatar"
                />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-background bg-surface-border flex items-center justify-center text-xs font-bold text-white tracking-tighter">
                +2k
              </div>
            </div>
            <div className="text-sm text-text-muted font-sans">
              <span className="text-white font-bold">10M+</span> tasks completed this month.
            </div>
          </div>
        </div>

        {/* Hero Interactive Mockup */}
        <div className="relative z-10 hidden lg:block w-full gs-reveal" id="mockup-container">
          <div className="transition-transform duration-500 hover:rotate-0 [perspective:1000px] [transform:rotateX(5deg)_rotateY(-10deg)_scale(0.95)] hover:scale-100">
             <InteractiveMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
