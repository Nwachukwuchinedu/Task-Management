"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Kanban,
  Users,
  Gear,
  CaretLeft,
  DotsThree,
  PencilSimple,
  Trash,
  Smiley,
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
import { Button, Card, Modal, Input, Dropdown, Avatar } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { useWorkspaceStore } from "@/stores";
import { IBoard, IWorkspace } from "@/lib/types/models";
import { WORKSPACE_ICONS, WORKSPACE_ICON_MAP, WORKSPACE_COLORS, BOARD_COLORS } from "@/lib/constants";

const IconRenderer = ({ iconId, className, style }: { iconId: string, className?: string, style?: React.CSSProperties }) => {
  const IconComponent = WORKSPACE_ICON_MAP[iconId] || Rocket;
  return <IconComponent className={className} style={style} />;
};



export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { workspaces, setCurrentWorkspace, updateWorkspace, removeWorkspace } = useWorkspaceStore();

  const [workspace, setWorkspace] = useState<IWorkspace | null>(null);
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [showEditBoard, setShowEditBoard] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<IBoard | null>(null);

  const [boardForm, setBoardForm] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
  });

  const [inviteEmail, setInviteEmail] = useState("");
  const [settingsForm, setSettingsForm] = useState({
    name: "",
    description: "",
    icon: "",
    color: "",
  });

  useEffect(() => {
    async function fetchData() {
      const workspaceId = params.id as string;

      const workspaceData = workspaces.find((w) => w._id === workspaceId);
      if (workspaceData) {
        setWorkspace(workspaceData);
        setCurrentWorkspace(workspaceData);
        setSettingsForm({
          name: workspaceData.name,
          description: workspaceData.description || "",
          icon: workspaceData.icon,
          color: workspaceData.color,
        });
      } else {
        try {
          const res = await fetch(`/api/workspaces/${workspaceId}`);
          const data = await res.json();
          if (data.success) {
            setWorkspace(data.data);
            setCurrentWorkspace(data.data);
            setSettingsForm({
              name: data.data.name,
              description: data.data.description || "",
              icon: data.data.icon,
              color: data.data.color,
            });
          }
        } catch (error) {
          console.error("Failed to fetch workspace:", error);
        }
      }

      try {
        const res = await fetch(`/api/boards?workspaceId=${workspaceId}`);
        const data = await res.json();
        if (data.success) {
          setBoards(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch boards:", error);
      }

      setIsLoading(false);
    }

    fetchData();
  }, [params.id, workspaces, setCurrentWorkspace]);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardForm.name.trim()) {
      showToast("error", "Board name is required");
      return;
    }

    setIsCreating(true);

    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...boardForm,
          workspaceId: params.id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setBoards((prev) => [data.data, ...prev]);
        setShowCreateBoard(false);
        setBoardForm({ name: "", description: "", color: "#3B82F6" });
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

  const handleUpdateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardForm.name.trim() || !selectedBoard) return;

    setIsCreating(true);

    try {
      const res = await fetch(`/api/boards/${selectedBoard._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(boardForm),
      });

      const data = await res.json();

      if (data.success) {
        setBoards((prev) => prev.map(b => b._id === selectedBoard._id ? data.data : b));
        setShowEditBoard(false);
        setSelectedBoard(null);
        setBoardForm({ name: "", description: "", color: "#3B82F6" });
        showToast("success", "Board updated!");
      } else {
        showToast("error", data.error || "Failed to update board");
      }
    } catch {
      showToast("error", "Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      const res = await fetch(`/api/workspaces/${params.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });

      const data = await res.json();

      if (data.success) {
        setWorkspace(data.data);
        setInviteEmail("");
        setShowInvite(false);
        showToast("success", "Member invited!");
      } else {
        showToast("error", data.error || "Failed to invite member");
      }
    } catch {
      showToast("error", "Something went wrong");
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/workspaces/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm),
      });

      const data = await res.json();

      if (data.success) {
        setWorkspace(data.data);
        updateWorkspace(params.id as string, data.data);
        setShowSettings(false);
        showToast("success", "Workspace updated!");
      } else {
        showToast("error", data.error || "Failed to update workspace");
      }
    } catch {
      showToast("error", "Something went wrong");
    }
  };

  const openEditBoard = (board: IBoard) => {
    setSelectedBoard(board);
    setBoardForm({
      name: board.name,
      description: board.description || "",
      color: board.color,
    });
    setShowEditBoard(true);
  };

  const handleDeleteBoard = async (boardId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!confirm("Are you sure you want to delete this board?")) return;

    try {
      const res = await fetch(`/api/boards/${boardId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBoards(prev => prev.filter(b => b._id !== boardId));
        showToast("success", "Board deleted");
      } else {
        showToast("error", "Failed to delete board");
      }
    } catch {
      showToast("error", "Something went wrong");
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!confirm("Are you sure? This will delete all boards in this workspace.")) return;

    try {
      const res = await fetch(`/api/workspaces/${params.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        removeWorkspace(params.id as string);
        showToast("success", "Workspace deleted");
        router.push("/dashboard");
      } else {
        showToast("error", "Failed to delete workspace");
      }
    } catch {
      showToast("error", "Something went wrong");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-full">
        <TopBar />
        <div className="p-6 max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-white/5 rounded-xl" />
              <div className="h-8 w-48 bg-white/5 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-white/5 rounded-2xl shimmer-container" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <p className="text-text-muted">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <TopBar
        title={
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${workspace.color}20` }}
            >
              <IconRenderer iconId={workspace.icon} className="w-4 h-4" style={{ color: workspace.color }} />
            </div>
            <span>{workspace.name}</span>
          </div>
        }
        showBack
        onBack={() => router.push("/dashboard")}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowInvite(true)}>
              <Users size={16} />
              Invite
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(true)}>
              <Gear size={16} />
            </Button>
          </div>
        }
      />

      <div className="p-6 max-w-7xl mx-auto">
        {workspace.description && (
          <p className="text-text-muted mb-8">{workspace.description}</p>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-bold text-white mb-1">Boards</h2>
            <p className="text-text-muted text-sm">
              {boards.length} board{boards.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button onClick={() => setShowCreateBoard(true)}>
            <Plus size={18} weight="bold" />
            New Board
          </Button>
        </div>

        {boards.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-surface-border flex items-center justify-center">
              <Kanban size={40} className="text-text-muted" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-white mb-2">
              No boards yet
            </h3>
            <p className="text-text-muted mb-6 max-w-md mx-auto">
              Create your first board to start organizing tasks
            </p>
            <Button onClick={() => setShowCreateBoard(true)}>
              <Plus size={18} weight="bold" />
              Create Board
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => (
              <div 
                key={board._id} 
                onClick={() => router.push(`/board/${board._id}`)}
                className="cursor-pointer group"
              >
                <Card hover className="p-5 h-full flex flex-col border-white/5 hover:border-primary/50 transition-all duration-300">
                  <div
                    className="h-1.5 w-12 rounded-full mb-4"
                    style={{ backgroundColor: board.color }}
                  />
                  <h4 className="font-heading font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                    {board.name}
                  </h4>
                  {board.description && (
                    <p className="text-sm text-text-muted line-clamp-2 mb-4">
                      {board.description}
                    </p>
                  )}
                  <div className="flex-1" />
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs text-text-muted bg-white/5 px-2 py-1 rounded-md">
                      {(board as any).columnCount || board.columns?.length || 0} columns
                    </span>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Dropdown
                        items={[
                          {
                            label: "Edit",
                            icon: <PencilSimple size={16} />,
                            onClick: () => openEditBoard(board),
                          },
                          {
                            label: "Delete",
                            icon: <Trash size={16} />,
                            onClick: () => {
                              handleDeleteBoard(board._id);
                            },
                            variant: "danger",
                          },
                        ]}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            ))}

            <Card
              hover
              className="p-5 h-full flex items-center justify-center border-dashed cursor-pointer"
              onClick={() => setShowCreateBoard(true)}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/5 flex items-center justify-center">
                  <Plus size={24} className="text-text-muted" />
                </div>
                <p className="text-sm text-text-muted">New Board</p>
              </div>
            </Card>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-white/5">
          <h3 className="text-lg font-heading font-semibold text-white mb-4">
            Members ({workspace.members?.length || 0})
          </h3>
          <div className="flex flex-wrap gap-3">
            {workspace.members?.map((member) => (
              <div
                key={typeof member === "string" ? member : member._id}
                className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5"
              >
                <Avatar
                  name={typeof member === "string" ? "User" : member.name}
                  src={typeof member === "object" ? member.avatar : undefined}
                  size="sm"
                />
                <span className="text-sm text-white">
                  {typeof member === "string" ? "User" : member.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={showCreateBoard} onClose={() => setShowCreateBoard(false)} title="Create Board">
        <form onSubmit={handleCreateBoard} className="space-y-5">
          <Input
            label="Board Name"
            placeholder="e.g., Website Redesign"
            value={boardForm.name}
            onChange={(e) => setBoardForm({ ...boardForm, name: e.target.value })}
          />

          <Input
            label="Description (optional)"
            placeholder="What's this board about?"
            value={boardForm.description}
            onChange={(e) => setBoardForm({ ...boardForm, description: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {BOARD_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setBoardForm({ ...boardForm, color })}
                  className={`w-8 h-8 rounded-full transition-all ${
                    boardForm.color === color
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
              onClick={() => setShowCreateBoard(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isCreating}>
              Create Board
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showEditBoard} onClose={() => setShowEditBoard(false)} title="Edit Board">
        <form onSubmit={handleUpdateBoard} className="space-y-5">
          <Input
            label="Board Name"
            placeholder="e.g., Website Redesign"
            value={boardForm.name}
            onChange={(e) => setBoardForm({ ...boardForm, name: e.target.value })}
          />

          <Input
            label="Description (optional)"
            placeholder="What's this board about?"
            value={boardForm.description}
            onChange={(e) => setBoardForm({ ...boardForm, description: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {BOARD_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setBoardForm({ ...boardForm, color })}
                  className={`w-8 h-8 rounded-full transition-all ${
                    boardForm.color === color
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
              onClick={() => setShowEditBoard(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isCreating}>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showInvite} onClose={() => setShowInvite(false)} title="Invite Members">
        <form onSubmit={handleInvite} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="colleague@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setShowInvite(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Send Invite
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Workspace Settings">
        <form onSubmit={handleUpdateSettings} className="space-y-5">
          <Input
            label="Workspace Name"
            value={settingsForm.name}
            onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
          />

          <Input
            label="Description"
            value={settingsForm.description}
            onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="danger"
              onClick={handleDeleteWorkspace}
            >
              Delete Workspace
            </Button>
            <div className="flex-1" />
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowSettings(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Workspace Settings">
        <form onSubmit={handleUpdateSettings} className="space-y-5">
          <Input
            label="Workspace Name"
            placeholder="e.g., Marketing Team"
            value={settingsForm.name}
            onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
          />

          <Input
            label="Description (optional)"
            placeholder="What's this workspace about?"
            value={settingsForm.description}
            onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Icon
            </label>
            <div className="flex flex-wrap gap-3">
              {WORKSPACE_ICONS.map(({ id, icon: Icon }: { id: string; icon: any }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSettingsForm({ ...settingsForm, icon: id })}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    settingsForm.icon === id
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
              {WORKSPACE_COLORS.map((color: string) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSettingsForm({ ...settingsForm, color })}
                  className={`w-8 h-8 rounded-full transition-all ${
                    settingsForm.color === color
                      ? "ring-2 ring-offset-2 ring-offset-surface ring-white"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Button type="submit" className="w-full" isLoading={isCreating}>
              Save Changes
            </Button>
            
            <div className="pt-4 border-t border-white/5">
              <h4 className="text-sm font-semibold text-red-400 mb-2">Danger Zone</h4>
              <p className="text-xs text-text-muted mb-4">
                Deleting this workspace will permanently remove all associated boards, tasks, and data. This action cannot be undone.
              </p>
              <Button
                type="button"
                variant="ghost"
                className="w-full text-red-400 hover:bg-red-400/10 border border-red-400/20"
                onClick={handleDeleteWorkspace}
              >
                <Trash size={16} />
                Delete Workspace
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}
