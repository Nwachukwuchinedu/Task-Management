"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, Info, Warning, X } from "@phosphor-icons/react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const icons = {
    success: <CheckCircle size={20} weight="fill" className="text-green-400" />,
    error: <XCircle size={20} weight="fill" className="text-red-400" />,
    info: <Info size={20} weight="fill" className="text-primary" />,
    warning: <Warning size={20} weight="fill" className="text-amber-400" />,
  };

  const borders = {
    success: "border-green-400/20",
    error: "border-red-400/20",
    info: "border-primary/20",
    warning: "border-amber-400/20",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 glass-card px-4 py-3 border ${borders[toast.type]} animate-in slide-in-from-right fade-in duration-300`}
          >
            {icons[toast.type]}
            <p className="text-sm text-white">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-2 text-text-muted hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
