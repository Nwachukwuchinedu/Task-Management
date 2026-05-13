"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Plus,
  Kanban,
  SquaresFour,
  Gear,
  SignOut,
  CaretDown,
  CaretRight,
  CheckSquareOffset,
} from "@phosphor-icons/react";
import { 
  Rocket, 
  Briefcase, 
  Palette, 
  Book, 
  Zap, 
  Lightbulb, 
  Target, 
  Trophy,
  Layout,
  FolderOpen,
  Folder
} from "lucide-react";
import { useWorkspaceStore } from "@/stores";
import Avatar from "@/components/ui/Avatar";
import { useState, useEffect } from "react";
import { IBoard } from "@/lib/types/models";
import { WORKSPACE_ICON_MAP } from "@/lib/constants";

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
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<string[]>([]);
  const [workspaceBoards, setWorkspaceBoards] = useState<Record<string, IBoard[]>>({});

  useEffect(() => {
    if (currentWorkspace?._id && !expandedWorkspaces.includes(currentWorkspace._id)) {
      setExpandedWorkspaces(prev => [...prev, currentWorkspace._id]);
    }
  }, [currentWorkspace?._id]);

  useEffect(() => {
    const fetchBoards = async (workspaceId: string) => {
      try {
        const res = await fetch(`/api/boards?workspaceId=${workspaceId}`);
        const data = await res.json();
        if (data.success) {
          setWorkspaceBoards(prev => ({ ...prev, [workspaceId]: data.data }));
        }
      } catch (err) {
        console.error("Failed to fetch boards for sidebar", err);
      }
    };

    expandedWorkspaces.forEach(id => {
      if (!workspaceBoards[id]) {
        fetchBoards(id);
      }
    });
  }, [expandedWorkspaces]);

  const toggleWorkspace = (id: string) => {
    setExpandedWorkspaces(prev => 
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };

  const IconRenderer = ({ iconId, className, color }: { iconId: string, className?: string, color?: string }) => {
    const IconComponent = WORKSPACE_ICON_MAP[iconId] || Rocket;
    return <IconComponent className={className} style={{ color }} />;
  };

  const navItems = [
    { href: "/dashboard", icon: SquaresFour, label: "Dashboard" },
    { href: "/settings", icon: Gear, label: "Settings" },
  ];

  return (
    <aside className="w-64 h-screen bg-surface border-r border-white/5 flex flex-col">
      <div className="p-4 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2 mb-8 px-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center">
            <CheckSquareOffset weight="fill" className="text-white text-xl" />
          </div>
          <span className="text-xl font-logo text-white">Taski</span>
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
            {workspaces.map((workspace) => {
              const isExpanded = expandedWorkspaces.includes(workspace._id);
              const isActive = currentWorkspace?._id === workspace._id || pathname.includes(workspace._id);
              const boards = workspaceBoards[workspace._id] || [];

              return (
                <div key={workspace._id} className="space-y-1">
                  <div className="group flex items-center gap-1">
                    <button
                      onClick={() => toggleWorkspace(workspace._id)}
                      className={`p-1 rounded hover:bg-white/5 text-text-muted transition-transform duration-200 ${isExpanded ? "rotate-0" : "-rotate-90"}`}
                    >
                      <CaretDown size={14} />
                    </button>
                    <Link
                      href={`/workspace/${workspace._id}`}
                      className={`flex-1 flex items-center gap-3 px-2 py-2 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-primary/10 text-white shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]"
                          : "text-text-secondary hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <IconRenderer iconId={workspace.icon} className="w-4 h-4" color={workspace.color} />
                      <span className="flex-1 truncate text-sm font-medium">
                        {workspace.name}
                      </span>
                    </Link>
                  </div>

                  {isExpanded && (
                    <div className="ml-6 space-y-1 border-l border-white/5 pl-2 py-1">
                      {boards.length > 0 ? (
                        boards.map((board) => (
                          <Link
                            key={board._id}
                            href={`/board/${board._id}`}
                            className={`flex items-center gap-3 px-3 py-1.5 rounded-md text-xs transition-colors ${
                              pathname.includes(board._id)
                                ? "text-white bg-white/5"
                                : "text-text-muted hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: board.color }} />
                            <span className="truncate">{board.name}</span>
                          </Link>
                        ))
                      ) : (
                        <p className="px-3 py-1 text-[10px] text-text-disabled">No boards</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

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
