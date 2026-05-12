"use client";

import React from "react";
import { ArrowRight, Check } from "@phosphor-icons/react";
import MagneticButton from "./MagneticButton";

export const CTA = () => {
  return (
    <section className="py-32 relative overflow-hidden border-t border-surface-border">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[400px] bg-gradient-to-r from-primary/30 to-accent/30 blur-[120px] rounded-full"></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 gs-reveal-up">
        <h2 className="text-5xl md:text-7xl font-heading font-extrabold text-text-main mb-6 tracking-tight">Your team deserves better.</h2>
        <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto">Stop managing chaotic spreadsheets and clunky tools. Switch to the modern standard for task management today.</p>
        
        <MagneticButton>
          <div className="group relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-cyan-glow rounded-full blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
            <button className="relative bg-text-main text-background font-bold text-lg px-10 py-5 rounded-full hover:scale-[1.02] transition-transform flex items-center gap-3">
              Get Started for Free
              <ArrowRight weight="bold" />
            </button>
          </div>
        </MagneticButton>
      </div>
    </section>
  );
};

export const Footer = () => {
  const tickerItems = [
    "Sarah just created a task",
    "Acme team shipped 12 tasks today",
    "847 tasks completed in the last hour",
    "Nexus team joined Nova",
  ];

  return (
    <footer className="border-t border-surface-border bg-surface pt-12 pb-8 overflow-hidden relative">
      {/* Live Activity Ticker */}
      <div className="w-full overflow-hidden relative mb-12 border-b border-surface-border pb-8 mask-image-linear">
        <div className="flex animate-marquee w-max items-center">
          <div className="flex space-x-12 pr-12 items-center">
            {tickerItems.map((item, idx) => (
              <div key={idx} className="text-sm font-medium text-text-muted flex items-center gap-2 font-sans tracking-wide">
                <Check weight="bold" className="text-green-400" /> {item}
              </div>
            ))}
          </div>
          <div className="flex space-x-12 pr-12 items-center">
            {tickerItems.map((item, idx) => (
              <div key={`copy-${idx}`} className="text-sm font-medium text-text-muted flex items-center gap-2 font-sans tracking-wide">
                <Check weight="bold" className="text-green-400" /> {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center text-xs text-text-muted font-sans">
        <p>&copy; 2026 Nova Software Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};
