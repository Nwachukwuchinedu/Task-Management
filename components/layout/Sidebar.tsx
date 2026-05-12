"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Gear,
  SignOut,
  Plus,
  CaretRight,
  Kanban,
} from "@phosphor-icons/react";
import { useWorkspaceStore } from "@/stores";
import Avatar from "@/components/ui/Avatar";

interface SidebarProps {
  user: {
    name: string;
    email: string;
    image?: string;
  };
  onSignOut: () => void;
}

export default function Sidebar({ user, onSignOut }: SidebarProps) {
  const pathname = usePathname();
  const { workspaces, currentWorkspace } = useWorkspaceStore();

  const navItems = [
    { href: "/dashboard", icon: House, label: "Dashboard" },
    { href: "/settings", icon: Gear, label: "Settings" },
  ];

  return (
    <aside className="w-64 h-screen bg-surface border-r border-white/5 flex flex-col">
      <div className="p-4 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <span className="text-xl font-heading font-bold text-white">Nova</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="mb-6">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Workspaces
            </span>
            <Link
              href="/dashboard?create=workspace"
              className="p-1 rounded hover:bg-white/5 text-text-muted hover:text-white transition-colors"
            >
              <Plus size={16} />
            </Link>
          </div>

          <div className="space-y-1">
            {workspaces.map((workspace) => (
              <div key={workspace._id}>
                <Link
                  href={`/workspace/${workspace._id}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    currentWorkspace?._id === workspace._id || pathname.includes(workspace._id)
                      ? "bg-primary/10 text-white"
                      : "text-text-secondary hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{workspace.icon}</span>
                  <span className="flex-1 truncate text-sm font-medium">
                    {workspace.name}
                  </span>
                  {workspace.members?.length > 1 && (
                    <span className="text-xs text-text-muted">
                      {workspace.members.length}
                    </span>
                  )}
                </Link>
              </div>
            ))}

            {workspaces.length === 0 && (
              <p className="px-3 py-2 text-sm text-text-muted">No workspaces yet</p>
            )}
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-text-secondary hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <Avatar src={user.image} name={user.name} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-text-muted truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
        >
          <SignOut size={20} />
          <span className="text-sm font-medium">Sign out</span>
        </button>
      </div>
    </aside>
  );
}
