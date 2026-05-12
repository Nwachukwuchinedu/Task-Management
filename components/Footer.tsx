"use client";

import React from "react";
import { ArrowRight, CheckSquareOffset, TwitterLogo, GithubLogo, DiscordLogo, LinkedinLogo } from "@phosphor-icons/react";
import MagneticButton from "./MagneticButton";
import Link from "next/link";

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
  const footerLinks = [
    {
      title: "Product",
      links: ["Features", "Integrations", "Pricing", "Changelog", "Docs"],
    },
    {
      title: "Resources",
      links: ["Community", "Help Center", "Partners", "Blog", "Status"],
    },
    {
      title: "Company",
      links: ["About Us", "Careers", "Legal", "Privacy", "Contact"],
    },
  ];

  return (
    <footer className="border-t border-surface-border bg-surface pt-20 pb-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 md:gap-8 mb-16">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-6 inline-flex">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <CheckSquareOffset weight="fill" className="text-white text-xl" />
              </div>
              <span className="font-logo text-2xl tracking-wide text-text-main">Taski</span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed max-w-sm mb-8">
              The modern standard for visual task management. Built for fast-moving teams that want to ship faster without the chaos.
            </p>
            <div className="flex items-center gap-4 text-text-muted">
              <a href="#" className="hover:text-text-main transition-colors"><TwitterLogo size={24} weight="fill" /></a>
              <a href="#" className="hover:text-text-main transition-colors"><GithubLogo size={24} weight="fill" /></a>
              <a href="#" className="hover:text-text-main transition-colors"><DiscordLogo size={24} weight="fill" /></a>
              <a href="#" className="hover:text-text-main transition-colors"><LinkedinLogo size={24} weight="fill" /></a>
            </div>
          </div>
          
          {footerLinks.map((column, idx) => (
            <div key={idx} className="flex flex-col gap-4">
              <h4 className="font-bold text-text-main mb-2">{column.title}</h4>
              {column.links.map((link, i) => (
                <Link key={i} href="#" className="text-text-muted text-sm hover:text-primary transition-colors w-fit">
                  {link}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-surface-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} Taski Software Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
};
