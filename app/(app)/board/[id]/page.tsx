"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  PencilSimple,
  Trash,
  Calendar,
  Users,
  CaretDown,
  X,
} from "@phosphor-icons/react";
import { TopBar } from "@/components/layout";
import {
  Button,
  Modal,
  Input,
  Dropdown,
  Avatar,
  Badge,
  Card,
} from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { useBoardStore } from "@/stores";
import { IColumn, ITask, IUser, IBoardMember } from "@/lib/types/models";

interface TaskCardProps {
  task: ITask;
  onClick: () => void;
  onDelete: () => void;
  canEdit: boolean;
}

function TaskCard({ task, onClick, onDelete, canEdit }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id, data: { type: "task", task }, disabled: !canEdit });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    high: "danger",
    medium: "warning",
    low: "neutral",
  } as const;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`glass-card p-3 transition-all ${canEdit ? "cursor-grab active:cursor-grabbing hover:border-white/10" : "cursor-default"}`}
      onClick={canEdit ? onClick : undefined}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <Badge variant={priorityColors[task.priority]} size="sm">
          {task.priority}
        </Badge>
        {canEdit && (
          <Dropdown
            items={[
              {
                label: "Edit",
                icon: <PencilSimple size={14} />,
                onClick: onClick,
              },
              {
                label: "Delete",
                icon: <Trash size={14} />,
                onClick: onDelete,
                variant: "danger",
              },
            ]}
          />
        )}
      </div>

      <h4 className="text-sm font-medium text-white mb-2 line-clamp-2">
        {task.title}
      </h4>

      {task.description && (
        <p className="text-xs text-text-muted line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-3 text-xs text-text-muted">
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>

        {task.assignee && (
          <Avatar
            src={task.assignee.avatar}
            name={task.assignee.name}
            size="xs"
          />
        )}
      </div>
    </div>
  );
}

interface ColumnProps {
  column: IColumn;
  onAddTask: () => void;
  onEditColumn: () => void;
  onDeleteColumn: () => void;
  onTaskClick: (task: ITask) => void;
  onTaskDelete: (taskId: string) => void;
  canEdit: boolean;
}

function Column({
  column,
  onAddTask,
  onEditColumn,
  onDeleteColumn,
  onTaskClick,
  onTaskDelete,
  canEdit,
}: ColumnProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: column._id,
      data: { type: "column", column },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-[300px] flex-shrink-0 flex flex-col bg-white/[0.02] rounded-xl border border-white/5"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between px-4 py-3 border-b border-white/5 cursor-grab"
      >
        <div className="flex items-center gap-3">
          <h3 className="font-heading font-semibold text-white">
            {column.name}
          </h3>
          <span className="text-xs text-text-muted bg-white/5 px-2 py-0.5 rounded-full">
            {column.tasks?.length || 0}
          </span>
        </div>
        {canEdit && (
          <Dropdown
            items={[
              {
                label: "Edit",
                icon: <PencilSimple size={14} />,
                onClick: onEditColumn,
              },
              {
                label: "Delete",
                icon: <Trash size={14} />,
                onClick: onDeleteColumn,
                variant: "danger",
              },
            ]}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <SortableContext
          items={column.tasks?.map((t) => t._id) || []}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks?.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={() => onTaskClick(task)}
              onDelete={() => onTaskDelete(task._id)}
              canEdit={canEdit}
            />
          ))}
        </SortableContext>
      </div>

      {canEdit && (
        <div className="p-3 border-t border-white/5">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={onAddTask}
          >
            <Plus size={16} />
            Add Task
          </Button>
        </div>
      )}
    </div>
  );
}

export default function BoardPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { showToast } = useToast();
  const {
    currentBoard,
    setCurrentBoard,
    setLoading,
    isLoading,
    addColumn,
    updateColumn,
    removeColumn,
    reorderColumns,
    addTask,
    updateTask,
    removeTask,
    moveTask,
  } = useBoardStore();

  const [showAddColumn, setShowAddColumn] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [showEditColumn, setShowEditColumn] = useState(false);
  const [showManageMembers, setShowManageMembers] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<IColumn | null>(null);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [activeTask, setActiveTask] = useState<ITask | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [workspaceMembers, setWorkspaceMembers] = useState<IUser[]>([]);
  const [boardMembers, setBoardMembers] = useState<IBoardMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");

  const [columnName, setColumnName] = useState("");
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    dueDate: "",
    assigneeId: "",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const isBoardMember = currentBoard?.members?.some(
    (m) => (typeof m.user === "string" ? m.user : m.user?._id) === session?.user?.id
  ) || false;

  const canEditBoard = isBoardMember;

  useEffect(() => {
    async function fetchBoard() {
      setLoading(true);
      try {
        const res = await fetch(`/api/boards/${params.id}`);
        const data = await res.json();

        if (data.success) {
          setCurrentBoard(data.data);
          setBoardMembers(data.data.members || []);
        } else {
          showToast("error", data.error || "Failed to load board");
          router.push("/dashboard");
        }
      } catch {
        showToast("error", "Something went wrong");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchBoard();
  }, [params.id, setCurrentBoard, setLoading, showToast, router]);

  useEffect(() => {
    async function fetchWorkspaceMembers() {
      if (!currentBoard?.workspace) return;

      const workspace = currentBoard.workspace as { _id?: string; name?: string } | string;
      const workspaceId = typeof workspace === 'object'
        ? workspace._id
        : workspace;

      if (!workspaceId) return;

      try {
        const res = await fetch(`/api/workspaces/${workspaceId}`);
        const data = await res.json();

        if (data.success) {
          const members = (data.data.members || []).map((m: unknown) => {
            if (typeof m === "object" && m !== null) {
              return (m as { _id?: string; name?: string; email?: string; avatar?: string })._id
                ? m as IUser
                : { _id: String(m), name: "User", email: "", avatar: "" };
            }
            return { _id: String(m), name: "User", email: "", avatar: "" };
          });
          setWorkspaceMembers(members);
        }
      } catch (error) {
        console.error("Failed to fetch workspace members:", error);
      }
    }

    fetchWorkspaceMembers();
  }, [currentBoard?.workspace]);

  const handleAddBoardMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    try {
      const res = await fetch(`/api/boards/${params.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });

      const data = await res.json();

      if (data.success) {
        setBoardMembers(data.data);
        setInviteEmail("");
        showToast("success", "Member added to board!");
      } else {
        showToast("error", data.error || "Failed to add member");
      }
    } catch {
      showToast("error", "Something went wrong");
    }
  };

  const handleRemoveBoardMember = async (userId: string) => {
    try {
      const res = await fetch(`/api/boards/${params.id}/members`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (data.success) {
        setBoardMembers((prev) =>
          prev.filter((m) => (typeof m.user === "string" ? m.user : m.user?._id) !== userId)
        );
        showToast("success", "Member removed from board");
      } else {
        showToast("error", data.error || "Failed to remove member");
      }
    } catch {
      showToast("error", "Something went wrong");
    }
  };

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === "task") {
      setActiveTask(active.data.current.task);
    }
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over || !currentBoard) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      const activeColumn = currentBoard.columns.find((c) =>
        c.tasks?.some((t) => t._id === activeId)
      );
      const overColumn = currentBoard.columns.find(
        (c) => c._id === overId || c.tasks?.some((t) => t._id === overId)
      );

      if (!activeColumn || !overColumn || activeColumn._id === overColumn._id) {
        return;
      }

      const overIndex = overColumn.tasks?.findIndex((t) => t._id === overId) ?? 0;
      const newPosition = overIndex >= 0 ? overIndex : (overColumn.tasks?.length || 0);

      moveTask(activeId, activeColumn._id, overColumn._id, newPosition);
    },
    [currentBoard, moveTask]
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);

      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      if (activeId === overId) return;

      const activeColumn = currentBoard?.columns.find((c) =>
        c.tasks?.some((t) => t._id === activeId)
      );
      const overColumn = currentBoard?.columns.find(
        (c) => c._id === overId || c.tasks?.some((t) => t._id === overId)
      );

      if (active.data.current?.type === "task" && activeColumn && overColumn) {
        if (activeColumn._id === overColumn._id) {
          const tasks = activeColumn.tasks || [];
          const oldIndex = tasks.findIndex((t) => t._id === activeId);
          const newIndex = tasks.findIndex((t) => t._id === overId);

          if (oldIndex !== newIndex) {
            try {
              await fetch(`/api/tasks/${activeId}/move`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  columnId: overColumn._id,
                  position: newIndex,
                }),
              });
            } catch {
              showToast("error", "Failed to save task position");
            }
          }
        }
      }

      if (active.data.current?.type === "column" && currentBoard) {
        const oldIndex = currentBoard.columns.findIndex((c) => c._id === activeId);
        const newIndex = currentBoard.columns.findIndex((c) => c._id === overId);

        if (oldIndex !== newIndex) {
          const newColumns = [...currentBoard.columns];
          const [removed] = newColumns.splice(oldIndex, 1);
          newColumns.splice(newIndex, 0, removed);

          reorderColumns(newColumns);

          try {
            await fetch("/api/columns/reorder", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderedIds: newColumns.map((c) => c._id),
              }),
            });
          } catch {
            showToast("error", "Failed to save column order");
          }
        }
      }
    },
    [currentBoard, reorderColumns, showToast]
  );

  const handleAddColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!columnName.trim() || !currentBoard) return;

    setIsCreating(true);

    try {
      const res = await fetch("/api/columns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: columnName,
          boardId: currentBoard._id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        addColumn({ ...data.data, tasks: [] });
        setColumnName("");
        setShowAddColumn(false);
        showToast("success", "Column created!");
      } else {
        showToast("error", data.error || "Failed to create column");
      }
    } catch {
      showToast("error", "Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!columnName.trim() || !selectedColumn) return;

    try {
      const res = await fetch(`/api/columns/${selectedColumn._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: columnName }),
      });

      const data = await res.json();

      if (data.success) {
        updateColumn(selectedColumn._id, { name: columnName });
        setShowEditColumn(false);
        setSelectedColumn(null);
        setColumnName("");
        showToast("success", "Column updated!");
      } else {
        showToast("error", data.error || "Failed to update column");
      }
    } catch {
      showToast("error", "Something went wrong");
    }
  };

  const handleDeleteColumn = async (column: IColumn) => {
    if (!confirm(`Delete "${column.name}"? All tasks will be deleted.`)) return;

    try {
      const res = await fetch(`/api/columns/${column._id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        removeColumn(column._id);
        showToast("success", "Column deleted");
      } else {
        showToast("error", "Failed to delete column");
      }
    } catch {
      showToast("error", "Something went wrong");
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim() || !selectedColumn || !currentBoard) return;

    setIsCreating(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: taskForm.title,
          description: taskForm.description,
          priority: taskForm.priority,
          dueDate: taskForm.dueDate || undefined,
          assignee: taskForm.assigneeId || undefined,
          columnId: selectedColumn._id,
          boardId: currentBoard._id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        addTask(selectedColumn._id, data.data);
        setTaskForm({ title: "", description: "", priority: "medium", dueDate: "", assigneeId: "" });
        setShowCreateTask(false);
        setSelectedColumn(null);
        showToast("success", "Task created!");
      } else {
        showToast("error", data.error || "Failed to create task");
      }
    } catch {
      showToast("error", "Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskForm.title.trim() || !selectedTask) return;

    try {
      const res = await fetch(`/api/tasks/${selectedTask._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: taskForm.title,
          description: taskForm.description,
          priority: taskForm.priority,
          dueDate: taskForm.dueDate || undefined,
          assignee: taskForm.assigneeId || undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        updateTask(selectedTask._id, data.data);
        setShowEditTask(false);
        setSelectedTask(null);
        setTaskForm({ title: "", description: "", priority: "medium", dueDate: "", assigneeId: "" });
        showToast("success", "Task updated!");
      } else {
        showToast("error", data.error || "Failed to update task");
      }
    } catch {
      showToast("error", "Something went wrong");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Delete this task?")) return;

    const column = currentBoard?.columns.find((c) =>
      c.tasks?.some((t) => t._id === taskId)
    );

    if (!column) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        removeTask(column._id, taskId);
        showToast("success", "Task deleted");
      } else {
        showToast("error", "Failed to delete task");
      }
    } catch {
      showToast("error", "Something went wrong");
    }
  };

  const openCreateTask = (column: IColumn) => {
    setSelectedColumn(column);
    setTaskForm({ title: "", description: "", priority: "medium", dueDate: "", assigneeId: "" });
    setShowCreateTask(true);
  };

  const openEditTask = (task: ITask) => {
    setSelectedTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      assigneeId: task.assignee?._id || "",
    });
    setShowEditTask(true);
  };

  const openEditColumn = (column: IColumn) => {
    setSelectedColumn(column);
    setColumnName(column.name);
    setShowEditColumn(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-full">
        <TopBar />
        <div className="p-6 flex gap-4 overflow-x-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-[300px] h-96 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <p className="text-text-muted">Board not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col">
      <TopBar
        title={currentBoard.name}
        showBack
        onBack={() => router.push(`/workspace/${currentBoard.workspace}`)}
        actions={
          <Button variant="secondary" size="sm" onClick={() => setShowManageMembers(true)}>
            <Users size={16} />
            Members ({boardMembers.length})
          </Button>
        }
      />

      <div className="flex-1 overflow-x-auto p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 h-full min-h-[calc(100vh-180px)]">
            <SortableContext
              items={currentBoard.columns.map((c) => c._id)}
              strategy={horizontalListSortingStrategy}
            >
              {currentBoard.columns.map((column) => (
                <Column
                  key={column._id}
                  column={column}
                  onAddTask={() => openCreateTask(column)}
                  onEditColumn={() => openEditColumn(column)}
                  onDeleteColumn={() => handleDeleteColumn(column)}
                  onTaskClick={openEditTask}
                  onTaskDelete={handleDeleteTask}
                  canEdit={canEditBoard}
                />
              ))}
            </SortableContext>

            {canEditBoard && (
              <div className="w-[300px] flex-shrink-0">
                <Button
                  variant="secondary"
                  className="w-full h-12 border-dashed"
                  onClick={() => setShowAddColumn(true)}
                >
                  <Plus size={18} />
                  Add Column
                </Button>
              </div>
            )}
          </div>

          <DragOverlay>
            {activeTask && (
              <div className="glass-card p-3 w-[284px] shadow-2xl rotate-3">
                <h4 className="text-sm font-medium text-white">
                  {activeTask.title}
                </h4>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      <Modal isOpen={showManageMembers} onClose={() => setShowManageMembers(false)} title="Board Members" size="lg">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-text-secondary mb-3">Current Members</h3>
            <div className="space-y-2">
              {boardMembers.map((member) => {
                const userId = typeof member.user === "string" ? member.user : member.user?._id;
                const userName = typeof member.user === "string" ? "User" : member.user?.name || "User";
                const userAvatar = typeof member.user === "object" ? member.user?.avatar : undefined;

                return (
                  <div key={userId} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3">
                      <Avatar src={userAvatar} name={userName} size="sm" />
                      <div>
                        <p className="text-sm text-white">{userName}</p>
                        <p className="text-xs text-text-muted capitalize">{member.role}</p>
                      </div>
                    </div>
                    {userId !== session?.user?.id && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveBoardMember(userId!)}
                      >
                        <X size={14} />
                      </Button>
                    )}
                  </div>
                );
              })}
              {boardMembers.length === 0 && (
                <p className="text-sm text-text-muted">No board members yet</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-text-secondary mb-3">Add Workspace Member</h3>
            <form onSubmit={handleAddBoardMember} className="flex gap-2">
              <Input
                placeholder="Member email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <Button type="submit">Add</Button>
            </form>
            <p className="text-xs text-text-muted mt-2">
              Only workspace members can be added to the board
            </p>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showAddColumn}
        onClose={() => {
          setShowAddColumn(false);
          setColumnName("");
        }}
        title="Add Column"
        size="sm"
      >
        <form onSubmit={handleAddColumn} className="space-y-5">
          <Input
            label="Column Name"
            placeholder="e.g., In Review"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
          />
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setShowAddColumn(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isCreating}>
              Add Column
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showEditColumn}
        onClose={() => {
          setShowEditColumn(false);
          setSelectedColumn(null);
          setColumnName("");
        }}
        title="Edit Column"
        size="sm"
      >
        <form onSubmit={handleEditColumn} className="space-y-5">
          <Input
            label="Column Name"
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
          />
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setShowEditColumn(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showCreateTask}
        onClose={() => {
          setShowCreateTask(false);
          setSelectedColumn(null);
          setTaskForm({ title: "", description: "", priority: "medium", dueDate: "", assigneeId: "" });
        }}
        title={`Add Task to ${selectedColumn?.name}`}
      >
        <form onSubmit={handleCreateTask} className="space-y-5">
          <Input
            label="Task Title"
            placeholder="What needs to be done?"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Description
            </label>
            <textarea
              className="w-full h-24 px-4 py-3 bg-surface border border-surface-border rounded-lg text-white placeholder:text-text-muted focus:outline-none focus:border-primary resize-none"
              placeholder="Add more details..."
              value={taskForm.description}
              onChange={(e) =>
                setTaskForm({ ...taskForm, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Priority
            </label>
            <div className="flex gap-2">
              {(["low", "medium", "high"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setTaskForm({ ...taskForm, priority: p })}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    taskForm.priority === p
                      ? p === "high"
                        ? "bg-red-400/20 text-red-400 border border-red-400/30"
                        : p === "medium"
                          ? "bg-amber-400/20 text-amber-400 border border-amber-400/30"
                          : "bg-white/10 text-text-secondary border border-white/10"
                      : "bg-white/5 text-text-muted border border-transparent hover:bg-white/10"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Assignee
            </label>
            <select
              className="w-full h-11 px-4 bg-surface border border-surface-border rounded-lg text-white focus:outline-none focus:border-primary"
              value={taskForm.assigneeId}
              onChange={(e) => setTaskForm({ ...taskForm, assigneeId: e.target.value })}
            >
              <option value="">Unassigned</option>
              {workspaceMembers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Due Date (optional)"
            type="date"
            value={taskForm.dueDate}
            onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setShowCreateTask(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isCreating}>
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showEditTask}
        onClose={() => {
          setShowEditTask(false);
          setSelectedTask(null);
          setTaskForm({ title: "", description: "", priority: "medium", dueDate: "", assigneeId: "" });
        }}
        title="Edit Task"
      >
        <form onSubmit={handleUpdateTask} className="space-y-5">
          <Input
            label="Task Title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Description
            </label>
            <textarea
              className="w-full h-24 px-4 py-3 bg-surface border border-surface-border rounded-lg text-white placeholder:text-text-muted focus:outline-none focus:border-primary resize-none"
              placeholder="Add more details..."
              value={taskForm.description}
              onChange={(e) =>
                setTaskForm({ ...taskForm, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Priority
            </label>
            <div className="flex gap-2">
              {(["low", "medium", "high"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setTaskForm({ ...taskForm, priority: p })}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                    taskForm.priority === p
                      ? p === "high"
                        ? "bg-red-400/20 text-red-400 border border-red-400/30"
                        : p === "medium"
                          ? "bg-amber-400/20 text-amber-400 border border-amber-400/30"
                          : "bg-white/10 text-text-secondary border border-white/10"
                      : "bg-white/5 text-text-muted border border-transparent hover:bg-white/10"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Assignee
            </label>
            <select
              className="w-full h-11 px-4 bg-surface border border-surface-border rounded-lg text-white focus:outline-none focus:border-primary"
              value={taskForm.assigneeId}
              onChange={(e) => setTaskForm({ ...taskForm, assigneeId: e.target.value })}
            >
              <option value="">Unassigned</option>
              {workspaceMembers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Due Date"
            type="date"
            value={taskForm.dueDate}
            onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
          />

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setShowEditTask(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
