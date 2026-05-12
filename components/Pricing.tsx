"use client";

import React, { useState } from "react";
import { Check, X } from "@phosphor-icons/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individuals and small teams getting started.",
      monthlyPrice: 0,
      annualPrice: 0,
      buttonText: "Get Started Free",
      features: ["Up to 5 users", "Unlimited Kanban boards", "Basic task tracking"],
      unavailable: ["Advanced Analytics"],
    },
    {
      name: "Professional",
      description: "Advanced tools for growing teams that need more power.",
      monthlyPrice: 15,
      annualPrice: 12,
      buttonText: "Start 14-Day Trial",
      features: ["Unlimited users", "Advanced Analytics", "Custom workflows", "24/7 Priority Support"],
      popular: true,
    },
    {
      name: "Enterprise",
      description: "Security and administration for large-scale organizations.",
      monthlyPrice: 39,
      annualPrice: 31,
      buttonText: "Contact Sales",
      features: ["Everything in Pro", "SAML SSO & Provisioning", "Audit logs & Security", "Dedicated Success Manager"],
    },
  ];

  useGSAP(() => {
    gsap.from(".pricing-card", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      scrollTrigger: {
        trigger: "#pricing",
        start: "top 80%",
      }
    });
  }, []);

  return (
    <section id="pricing" className="py-32 relative overflow-hidden border-t border-surface-border bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.05)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-accent font-bold tracking-widest text-sm uppercase mb-3 font-heading">Simple Pricing</h2>
          <h3 className="font-heading text-4xl md:text-5xl font-bold mb-8 text-text-main tracking-tight">Scale without surprises.</h3>
          
          <div className="inline-flex items-center p-1.5 bg-glass-bg border border-glass-border rounded-full">
            <button 
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${!isAnnual ? "text-text-main bg-surface shadow-md border border-surface-border" : "text-text-muted hover:text-text-main"}`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${isAnnual ? "text-text-main bg-surface shadow-md border border-surface-border" : "text-text-muted hover:text-text-main"}`}
            >
              Annual <span className={`text-[10px] bg-green-400/20 text-green-500 font-bold px-2 py-0.5 rounded-full tracking-wider ${!isAnnual ? "hidden" : ""}`}>SAVE 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div 
              key={idx}
              className={`pricing-card glass-card p-8 flex flex-col relative border-surface-border ${plan.popular ? "border-primary/40 bg-primary/5 shadow-[0_0_40px_rgba(59,130,246,0.15)] transform md:-translate-y-4" : ""}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary to-cyan-glow text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">Most Popular</div>
              )}
              <h4 className="text-xl font-heading font-bold text-text-main mb-2">{plan.name}</h4>
              <p className="text-text-muted text-sm mb-6 h-10">{plan.description}</p>
              <div className="mb-8 flex items-baseline">
                <span className="text-4xl font-heading font-extrabold text-text-main">
                  ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span className="text-text-muted text-sm ml-2">/ user / mo</span>
              </div>
              <button className={`w-full py-3 px-6 rounded-lg font-bold transition-colors mb-8 ${plan.popular ? "bg-text-main text-background hover:opacity-90 shadow-lg shadow-text-main/10" : "bg-surface hover:bg-surface-border border border-surface-border text-text-main"}`}>
                {plan.buttonText}
              </button>
              <div className="space-y-4 text-sm text-text-main/80">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check weight="bold" className="text-green-400" /> {f}
                  </div>
                ))}
                {plan.unavailable?.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 opacity-50">
                    <X weight="bold" className="text-text-muted" /> {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
