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
} from "@phosphor-icons/react";
import { TopBar } from "@/components/layout";
import { Button, Card, Modal, Input, Dropdown, Avatar } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { useWorkspaceStore } from "@/stores";
import { IBoard, IWorkspace } from "@/lib/types/models";

const BOARD_COLORS = [
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#06B6D4",
  "#84CC16",
];

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { workspaces, setCurrentWorkspace } = useWorkspaceStore();

  const [workspace, setWorkspace] = useState<IWorkspace | null>(null);
  const [boards, setBoards] = useState<IBoard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

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
        setShowSettings(false);
        showToast("success", "Workspace updated!");
      } else {
        showToast("error", data.error || "Failed to update workspace");
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
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-white/5 rounded" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white/5 rounded-xl" />
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
        title={`${workspace.icon} ${workspace.name}`}
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
              <Link key={board._id} href={`/board/${board._id}`}>
                <Card hover className="p-5 h-full">
                  <div
                    className="h-2 rounded-full mb-4"
                    style={{ backgroundColor: board.color }}
                  />
                  <h4 className="font-heading font-semibold text-white mb-2">
                    {board.name}
                  </h4>
                  {board.description && (
                    <p className="text-sm text-text-muted line-clamp-2">
                      {board.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <span className="text-xs text-text-muted">
                      {(board as unknown as { columnCount?: number }).columnCount || board.columns?.length || 0} columns
                    </span>
                    <Dropdown
                      items={[
                        {
                          label: "Edit",
                          icon: <PencilSimple size={16} />,
                          onClick: () => {},
                        },
                        {
                          label: "Delete",
                          icon: <Trash size={16} />,
                          onClick: handleDeleteWorkspace,
                          variant: "danger",
                        },
                      ]}
                    />
                  </div>
                </Card>
              </Link>
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
    </div>
  );
}
