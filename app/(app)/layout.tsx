"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Sidebar } from "@/components/layout";
import { ToastProvider } from "@/components/ui";
import { useWorkspaceStore } from "@/stores";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { setWorkspaces } = useWorkspaceStore();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchWorkspaces() {
      if (!session?.user) return;

      try {
        const res = await fetch("/api/workspaces");
        const data = await res.json();

        if (data.success) {
          setWorkspaces(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch workspaces:", error);
      }
    }

    fetchWorkspaces();
  }, [session?.user, setWorkspaces]);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-2xl">N</span>
          </div>
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <ToastProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar
          user={{
            name: session.user.name || "",
            email: session.user.email || "",
            image: session.user.image || undefined,
          }}
          onSignOut={handleSignOut}
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </ToastProvider>
  );
}
