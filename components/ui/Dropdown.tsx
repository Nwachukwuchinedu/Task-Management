"use client";

import React, { useState, useRef, useEffect } from "react";
import { DotsThree, PencilSimple, Trash, Copy, Plus } from "@phosphor-icons/react";

interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  variant?: "default" | "danger";
}

interface DropdownProps {
  items: DropdownItem[];
  trigger?: React.ReactNode;
}

export default function Dropdown({ items, trigger }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1.5 rounded-lg hover:bg-white/10 text-text-muted hover:text-white transition-colors"
      >
        {trigger || <DotsThree size={20} weight="bold" />}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[160px] glass-card p-1 animate-in fade-in slide-in-from-top-2 duration-150">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                item.onClick();
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                item.variant === "danger"
                  ? "text-red-400 hover:bg-red-400/10"
                  : "text-white hover:bg-white/5"
              }`}
            >
              {item.icon && <span className="text-base">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
