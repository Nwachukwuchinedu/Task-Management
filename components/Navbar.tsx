"use client";

import React, { useEffect, useState } from "react";
import { CheckSquareOffset, List, X, Sun, Moon } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import Link from "next/link";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Product", href: "#showcase" },
    { name: "Pricing", href: "#pricing" },
    { name: "Customers", href: "#testimonials" },
  ];

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-background/85 backdrop-blur-xl border-surface-border py-3"
          : "border-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center relative z-50">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:animate-glow-pulse transition-shadow duration-300">
            <CheckSquareOffset weight="fill" className="text-white text-xl" />
          </div>
          <span className="font-logo text-2xl tracking-wide">Taski</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-muted">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-text-main transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-text-muted hover:text-text-main transition-colors p-2"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
          <Link
            href="/login"
            className="text-sm font-medium text-text-muted hover:text-text-main transition-colors"
          >
            Log in
          </Link>
          <div className="magnetic-btn relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
            <Link 
              href="/register"
              className="relative block bg-surface border border-surface-border text-text-main text-sm font-medium px-5 py-2 rounded-full hover:bg-surface-border transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="md:hidden text-text-muted hover:text-text-main relative z-50"
        >
          <List size={24} />
        </button>
      </div>

      {/* Mobile Full-screen Menu */}
      <div
        className={`fixed inset-0 bg-background/95 backdrop-blur-3xl z-40 transform transition-transform duration-500 flex flex-col items-center justify-center space-y-8 text-2xl font-heading font-bold text-text-main ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsMenuOpen(false)}
          className="absolute top-6 right-6 text-text-muted hover:text-text-main"
        >
          <X size={32} />
        </button>
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={() => setIsMenuOpen(false)}
            className="hover:text-primary transition-colors"
          >
            {link.name}
          </Link>
        ))}
        <Link
          href="/login"
          onClick={() => setIsMenuOpen(false)}
          className="text-lg text-text-muted hover:text-text-main transition-colors mt-8 font-sans"
        >
          Log in
        </Link>
        <Link
          href="/register"
          onClick={() => setIsMenuOpen(false)}
          className="bg-text-main text-background px-8 py-3 rounded-full text-lg mt-4 font-sans shadow-xl shadow-text-main/10 text-center"
        >
          Get Started Free
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
