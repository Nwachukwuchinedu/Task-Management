"use client";

import React from "react";
import { Hexagon, Triangle } from "@phosphor-icons/react";

const LogosMarquee = () => {
  const logos = [
    { name: "AcmeCorp", icon: null },
    { name: "GlobalTech", icon: null },
    { name: "Quantum.", icon: null },
    { name: "Nexus", icon: <Hexagon weight="fill" /> },
    { name: "Aero", icon: null },
    { name: "Vertex", icon: <Triangle weight="fill" /> },
  ];

  return (
    <section className="py-10 border-y border-white/5 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-6 overflow-hidden flex flex-col items-center">
        <p className="text-sm text-text-muted uppercase tracking-widest mb-8 font-bold font-heading">
          Trusted by innovative teams worldwide
        </p>

        <div className="w-full flex overflow-hidden relative mask-image-linear">
          {/* Fading Edges */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, #040509 0%, transparent 15%, transparent 85%, #040509 100%)",
            }}
          ></div>

          <div className="flex animate-marquee w-max items-center py-2">
            {/* Set 1 */}
            <div className="flex space-x-16 pr-16 items-center">
              {logos.map((logo, idx) => (
                <div
                  key={idx}
                  className="text-2xl font-heading font-bold text-white/40 hover:text-white/80 transition-colors cursor-default flex items-center gap-1"
                >
                  {logo.icon} {logo.name}
                </div>
              ))}
            </div>
            {/* Set 2 */}
            <div className="flex space-x-16 pr-16 items-center">
              {logos.map((logo, idx) => (
                <div
                  key={`copy-${idx}`}
                  className="text-2xl font-heading font-bold text-white/40 hover:text-white/80 transition-colors cursor-default flex items-center gap-1"
                >
                  {logo.icon} {logo.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogosMarquee;
