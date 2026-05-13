"use client";

import React from "react";
import Link from "next/link";
import { MagnifyingGlass, Bell, CaretLeft } from "@phosphor-icons/react";

interface TopBarProps {
  title?: React.ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
}

export default function TopBar({ title, showBack, onBack, actions }: TopBarProps) {
  return (
    <header className="h-16 bg-surface border-b border-white/5 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {showBack && (
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-colors"
          >
            <CaretLeft size={20} />
          </button>
        )}
        {title && (
          <div className="text-lg font-heading font-semibold text-white">{title}</div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <MagnifyingGlass
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <button className="relative p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {actions}
      </div>
    </header>
  );
}
