"use client";

import React, { useEffect, useRef, useState } from "react";
import { Star } from "@phosphor-icons/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const StatCounter = ({ target, decimals = 0, suffix = "" }: { target: number, decimals?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useGSAP(() => {
    gsap.to({ val: 0 }, {
      val: target,
      duration: 2.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 85%",
      },
      onUpdate: function() {
        setCount(this.targets()[0].val);
      }
    });
  }, { scope: ref });

  return (
    <span ref={ref}>
      {count.toFixed(decimals)}{suffix}
    </span>
  );
};

const StatsBar = () => {
  return (
    <section className="py-12 border-b border-white/5 bg-[#0A0C10]/50 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center">
          
          <div className="py-4 md:py-0">
            <div className="text-4xl font-heading font-bold text-white mb-2 flex justify-center items-baseline gap-0.5">
              <StatCounter target={10} />
              <span className="text-primary">M+</span>
            </div>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Tasks Completed</p>
          </div>
          
          <div className="py-4 md:py-0">
            <div className="text-4xl font-heading font-bold text-white mb-2 flex justify-center items-baseline gap-0.5">
              <StatCounter target={98} />
              <span className="text-accent">%</span>
            </div>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Uptime SLA</p>
          </div>
          
          <div className="py-4 md:py-0">
            <div className="text-4xl font-heading font-bold text-white mb-2 flex justify-center items-baseline gap-0.5">
              <StatCounter target={4.9} decimals={1} />
              <span className="text-yellow-400 text-2xl ml-1">★</span>
            </div>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Average Rating</p>
          </div>
          
          <div className="py-4 md:py-0">
            <div className="text-4xl font-heading font-bold text-white mb-2 flex justify-center items-baseline gap-0.5">
              <StatCounter target={140} />
              <span className="text-cyan-glow">+</span>
            </div>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest">Integrations</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default StatsBar;
