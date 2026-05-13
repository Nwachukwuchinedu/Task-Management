"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Kanban,
  Users,
  ArrowRight,
  Rocket as RocketPhosphor,
  Envelope,
  Check,
  X,
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
  LayoutDashboard,
  LucideIcon
} from "lucide-react";
import { TopBar } from "@/components/layout";
import { Button, Card, Modal, Input, Avatar } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { useWorkspaceStore } from "@/stores";
import { IWorkspace, IBoard, IInvitation } from "@/lib/types/models";
import { WORKSPACE_ICONS, WORKSPACE_ICON_MAP } from "@/lib/constants";

const IconRenderer = ({ iconId, className, style }: { iconId: string, className?: string, style?: React.CSSProperties }) => {
  const IconComponent = WORKSPACE_ICON_MAP[iconId] || Rocket;
  return <IconComponent className={className} style={style} />;
};
const WORKSPACE_COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#84CC16",
];

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { workspaces, setWorkspaces, addWorkspace, isLoading: workspacesLoading } = useWorkspaceStore();

  const [boards, setBoards] = useState<IBoard[]>([]);
  const [invitations, setInvitations] = useState<IInvitation[]>([]);
  const [isLoadingBoards, setIsLoadingBoards] = useState(true);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(true);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<IWorkspace | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [workspaceForm, setWorkspaceForm] = useState({
    name: "",
    description: "",
    icon: "rocket",
    color: "#3B82F6",
  });

  const [boardForm, setBoardForm] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
  });

  useEffect(() => {
    if (searchParams.get("create") === "workspace") {
      setShowCreateWorkspace(true);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchInvitations() {
      try {
        const res = await fetch("/api/invitations");
        const data = await res.json();
        if (data.success) {
          setInvitations(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch invitations:", error);
      } finally {
        setIsLoadingInvitations(false);
      }
    }

    fetchInvitations();
  }, []);

  useEffect(() => {
    async function fetchBoards() {
      try {
        const res = await fetch("/api/boards");
        const data = await res.json();
        if (data.success) {
          setBoards(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch boards:", error);
      } finally {
        setIsLoadingBoards(false);
      }
    }

    if (workspaces.length > 0) {
      fetchBoards();
    } else {
      setIsLoadingBoards(false);
    }
  }, [workspaces.length]);

  const handleAcceptInvitation = async (invitationId: string) => {
    try {
      const res = await fetch(`/api/invitations/${invitationId}/accept`, {
        method: "POST",
      });
      const data = await res.json();

      if (data.success) {
        setInvitations((prev) => prev.filter((i) => i._id !== invitationId));
        showToast("success", "You've joined the workspace!");
        window.location.reload();
      } else {
        showToast("error", data.error || "Failed to accept invitation");
      }
    } catch {
      showToast("error", "Something went wrong");
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      const res = await fetch(`/api/invitations/${invitationId}/decline`, {
        method: "POST",
      });
      const data = await res.json();

      if (data.success) {
        setInvitations((prev) => prev.filter((i) => i._id !== invitationId));
        showToast("info", "Invitation declined");
      } else {
        showToast("error", data.error || "Failed to decline invitation");
      }
    } catch {
      showToast("error", "Something went wrong");
    }
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceForm.name.trim()) {
      showToast("error", "Workspace name is required");
      return;
    }

    setIsCreating(true);

    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workspaceForm),
      });

      const data = await res.json();

      if (data.success) {
        addWorkspace(data.data);
        setShowCreateWorkspace(false);
        setWorkspaceForm({ name: "", description: "", icon: "🚀", color: "#3B82F6" });
        showToast("success", "Workspace created!");
        router.push(`/workspace/${data.data._id}`);
      } else {
        showToast("error", data.error || "Failed to create workspace");
      }
    } catch {
      showToast("error", "Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardForm.name.trim() || !selectedWorkspace) {
      showToast("error", "Board name and workspace are required");
      return;
    }

    setIsCreating(true);

    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...boardForm,
          workspaceId: selectedWorkspace._id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setBoards((prev) => [data.data, ...prev]);
        setShowCreateBoard(false);
        setBoardForm({ name: "", description: "", color: "#3B82F6" });
        setSelectedWorkspace(null);
        showToast("success", "Board created!");
        router.push(`/board/${data.data._id}`);
      } else {
        showToast("error", data.error || "Failed to create board");
      }
    } catch {
      showToast("error", "Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-full">
      <TopBar title="Dashboard" />

      <div className="p-6 max-w-7xl mx-auto">
        {!isLoadingInvitations && invitations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-heading font-semibold text-white mb-4 flex items-center gap-2">
              <Envelope size={20} className="text-primary" />
              Pending Invitations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {invitations.map((invitation) => (
                <Card key={invitation._id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${invitation.workspace?.color || "#3B82F6"}20` }}
                    >
                      <IconRenderer 
                        iconId={invitation.workspace?.icon || "rocket"} 
                        className="w-6 h-6" 
                        style={{ color: invitation.workspace?.color || "#3B82F6" }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-semibold text-white truncate">
                        {invitation.workspace?.name || "Workspace"}
                      </h4>
                      <p className="text-xs text-text-muted mt-1">
                        Invited by {invitation.inviter?.name || "someone"}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() => handleAcceptInvitation(invitation._id)}
                        >
                          <Check size={14} weight="bold" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeclineInvitation(invitation._id)}
                        >
                          <X size={14} />
                          Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-heading font-bold text-white mb-1">
              Your Workspaces
            </h2>
            <p className="text-text-muted">
              Organize your projects into workspaces
            </p>
          </div>
          <Button onClick={() => setShowCreateWorkspace(true)}>
            <Plus size={18} weight="bold" />
            New Workspace
          </Button>
        </div>

        {workspacesLoading || isLoadingBoards ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-40 shimmer-container bg-surface/40 overflow-hidden">
                <div className="p-5 space-y-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-white/5 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
                    <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : workspaces.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
              <RocketPhosphor size={40} className="text-text-muted" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-white mb-2">
              No workspaces yet
            </h3>
            <p className="text-text-muted mb-6 max-w-md mx-auto">
              Create your first workspace to start organizing your team's projects
            </p>
            <Button onClick={() => setShowCreateWorkspace(true)}>
              <Plus size={18} weight="bold" />
              Create Workspace
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {workspaces.map((workspace) => {
              const workspaceBoards = boards.filter(
                (b) => (b.workspace as unknown as { _id: string })?._id === workspace._id ||
                       b.workspace === workspace._id
              );

              return (
                <Link key={workspace._id} href={`/workspace/${workspace._id}`}>
                  <Card hover className="p-5 h-full">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${workspace.color}20` }}
                      >
                        <IconRenderer iconId={workspace.icon} className="w-6 h-6" style={{ color: workspace.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-heading font-semibold text-white truncate">
                          {workspace.name}
                        </h3>
                        {workspace.description && (
                          <p className="text-sm text-text-muted line-clamp-2 mt-1">
                            {workspace.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
                          <span className="flex items-center gap-1">
                            <Kanban size={14} />
                            {workspaceBoards.length} boards
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={14} />
                            {workspace.members?.length || 1}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}

            <Card
              hover
              className="p-5 h-full flex items-center justify-center border-dashed cursor-pointer"
              onClick={() => setShowCreateWorkspace(true)}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/5 flex items-center justify-center">
                  <Plus size={24} className="text-text-muted" />
                </div>
                <p className="text-sm text-text-muted">New Workspace</p>
              </div>
            </Card>
          </div>
        )}

        {boards.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-heading font-bold text-white mb-1">
                  Recent Boards
                </h2>
                <p className="text-text-muted text-sm">
                  Quick access to your recent projects
                </p>
              </div>
              <Button variant="ghost" onClick={() => {}}>
                View All
                <ArrowRight size={16} />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {boards.slice(0, 6).map((board) => {
                const workspace = workspaces.find(
                  (w) => (w._id === board.workspace) ||
                    ((board.workspace as unknown as { _id: string })?.["_id"] === w._id)
                );

                return (
                  <Link key={board._id} href={`/board/${board._id}`}>
                    <Card hover className="p-4">
                      <div
                        className="h-2 rounded-full mb-4"
                        style={{ backgroundColor: board.color }}
                      />
                      <h4 className="font-heading font-semibold text-white mb-1 truncate">
                        {board.name}
                      </h4>
                      {workspace && workspace.icon && (
                        <div className="flex items-center gap-1.5">
                          <IconRenderer iconId={workspace.icon} className="w-3 h-3" style={{ color: workspace.color }} />
                          <span>{workspace.name}</span>
                        </div>
                      )}
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={showCreateWorkspace}
        onClose={() => {
          setShowCreateWorkspace(false);
          setWorkspaceForm({ name: "", description: "", icon: "rocket", color: "#3B82F6" });
        }}
        title="Create Workspace"
      >
        <form onSubmit={handleCreateWorkspace} className="space-y-5">
          <Input
            label="Workspace Name"
            placeholder="e.g., Marketing Team"
            value={workspaceForm.name}
            onChange={(e) => setWorkspaceForm({ ...workspaceForm, name: e.target.value })}
          />

          <Input
            label="Description (optional)"
            placeholder="What's this workspace about?"
            value={workspaceForm.description}
            onChange={(e) => setWorkspaceForm({ ...workspaceForm, description: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Icon
            </label>
            <div className="flex flex-wrap gap-3">
              {WORKSPACE_ICONS.map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setWorkspaceForm({ ...workspaceForm, icon: id })}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    workspaceForm.icon === id
                      ? "bg-primary/20 ring-2 ring-primary text-primary"
                      : "bg-white/5 hover:bg-white/10 text-text-muted"
                  }`}
                >
                  <Icon size={22} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {WORKSPACE_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setWorkspaceForm({ ...workspaceForm, color })}
                  className={`w-8 h-8 rounded-full transition-all ${
                    workspaceForm.color === color
                      ? "ring-2 ring-offset-2 ring-offset-surface ring-white"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setShowCreateWorkspace(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isCreating}>
              Create Workspace
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
