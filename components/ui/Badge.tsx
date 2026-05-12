"use client";

import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "success" | "warning" | "danger" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

const variants = {
  primary: "bg-primary/20 text-primary border-primary/30",
  success: "bg-green-400/20 text-green-400 border-green-400/30",
  warning: "bg-amber-400/20 text-amber-400 border-amber-400/30",
  danger: "bg-red-400/20 text-red-400 border-red-400/30",
  neutral: "bg-white/10 text-text-secondary border-white/10",
};

const sizes = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
};

export default function Badge({
  children,
  variant = "neutral",
  size = "sm",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
