"use client";

import React from "react";
import { GitBranch, ChartLineUp, Kanban, Users, TrendDown, Plus } from "@phosphor-icons/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Features = () => {
  const containerRef = React.useRef(null);

  useGSAP(() => {
    gsap.utils.toArray(".gs-reveal-up").forEach((elem: any) => {
      gsap.fromTo(elem, 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: elem,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Spotlight effect
    const spotlightCards = gsap.utils.toArray(".spotlight-card") as HTMLElement[];
    spotlightCards.forEach(card => {
      card.addEventListener("mousemove", (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      });
    });

    // Workflow moving dot
    const path = document.querySelector("#workflow-line") as SVGPathElement;
    if (path) {
      const length = path.getTotalLength();
      gsap.set("#workflow-dot", { transformOrigin: "center" });
    }
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="features" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto mb-20 gs-reveal-up">
          <h2 className="text-primary font-bold tracking-widest text-sm uppercase mb-3 font-heading">Powerful Capabilities</h2>
          <h3 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-text-main tracking-tight">Everything you need to ship faster.</h3>
          <p className="text-text-muted text-lg">We stripped away the complexity of traditional project management, leaving a fast, keyboard-first, and highly visual experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6">
          
          {/* Card 1: Automated Workflows */}
          <div className="spotlight-card glass-card p-8 group gs-reveal-up md:col-span-2 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
            <div className="relative z-10 w-2/3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                <GitBranch size={24} className="text-primary" />
              </div>
              <h4 className="text-2xl font-heading font-semibold text-text-main mb-3">Automated Workflows</h4>
              <p className="text-text-muted text-sm leading-relaxed max-w-md">Connect your tools and let Nova handle the repetitive tasks. Our visual workflow builder maps exactly how your team operates.</p>
            </div>
            
            <div className="absolute right-[-10%] bottom-[-10%] w-[60%] h-[80%] pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-500">
              <svg viewBox="0 0 300 200" className="w-full h-full drop-shadow-[0_10px_20px_rgba(59,130,246,0.3)]">
                <path id="workflow-line" d="M 40,150 C 100,150 120,60 180,60 C 230,60 250,110 290,110" fill="none" stroke="var(--color-surface-border)" strokeWidth="3" strokeDasharray="8 8"/>
                <rect x="20" y="130" width="40" height="40" rx="10" fill="var(--color-surface)" stroke="#3B82F6" strokeWidth="2"/>
                <rect x="160" y="40" width="40" height="40" rx="10" fill="var(--color-surface)" stroke="#8B5CF6" strokeWidth="2"/>
                <rect x="260" y="90" width="40" height="40" rx="10" fill="var(--color-surface)" stroke="#06B6D4" strokeWidth="2"/>
                <circle r="6" fill="#3B82F6" filter="drop-shadow(0 0 8px #3B82F6)">
                  <animateMotion dur="4s" repeatCount="indefinite" rotate="auto">
                    <mpath href="#workflow-line"/>
                  </animateMotion>
                </circle>
              </svg>
            </div>
          </div>

          {/* Card 2: Velocity Analytics */}
          <div className="spotlight-card glass-card p-8 group gs-reveal-up md:row-span-2 relative overflow-hidden flex flex-col min-h-[320px]">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 border border-accent/20">
                <ChartLineUp size={24} className="text-accent" />
              </div>
              <h4 className="text-2xl font-heading font-semibold text-text-main mb-3">Velocity Analytics</h4>
              <p className="text-text-muted text-sm leading-relaxed mb-6">Track sprint velocity, cycle times, and team bandwidth in real-time. Make data-driven decisions instantly.</p>
            </div>
            
            <div className="bg-glass-bg border border-glass-border rounded-xl p-4 mb-4 relative z-10 flex justify-between items-end backdrop-blur-sm">
              <div>
                <div className="text-[10px] uppercase text-text-muted font-bold mb-1 tracking-wider">Avg Cycle Time</div>
                <div className="text-2xl font-heading font-bold text-text-main">2.4 <span className="text-sm text-text-muted">Days</span></div>
              </div>
              <div className="text-green-400 text-xs font-bold flex items-center gap-1 bg-green-400/10 px-2 py-1 rounded">
                <TrendDown size={14} weight="bold" /> 14%
              </div>
            </div>

            <div className="mt-auto absolute bottom-0 left-0 right-0 w-full h-40 opacity-70">
              <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent z-0"></div>
              <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="w-full h-full absolute bottom-0">
                <path d="M 0,100 C 20,80 30,90 50,60 C 70,30 80,70 110,40 C 140,10 160,50 200,20" fill="none" stroke="#8B5CF6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
              </svg>
            </div>
          </div>

          {/* Card 3: Limitless Boards */}
          <div className="spotlight-card glass-card p-8 group gs-reveal-up">
            <div className="w-12 h-12 rounded-xl bg-cyan-glow/10 flex items-center justify-center mb-6 border border-cyan-glow/20">
              <Kanban size={24} className="text-cyan-glow" />
            </div>
            <h4 className="text-xl font-heading font-semibold text-text-main mb-3">Limitless Boards</h4>
            <p className="text-text-muted text-sm leading-relaxed">Map out your entire process with fully customizable Kanban boards. See what needs attention at a glance.</p>
          </div>

          {/* Card 4: Multiplayer Native */}
          <div className="spotlight-card glass-card p-8 group gs-reveal-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex -space-x-2">
                <img src="https://i.pravatar.cc/100?img=11" className="w-10 h-10 rounded-full border-2 border-surface" alt="" />
                <img src="https://i.pravatar.cc/100?img=41" className="w-10 h-10 rounded-full border-2 border-surface" alt="" />
              </div>
              <div className="w-10 h-10 rounded-full bg-glass-bg border border-glass-border flex items-center justify-center border-dashed">
                <Plus size={16} className="text-text-muted" />
              </div>
            </div>
            <h4 className="text-xl font-heading font-semibold text-text-main mb-3">Multiplayer Native</h4>
            <p className="text-text-muted text-sm leading-relaxed">See who is viewing a task, collaborate in comments, and get instant live updates without refreshing.</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;
