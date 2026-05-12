"use client";

import { create } from "zustand";
import { IWorkspace } from "@/lib/types/models";

interface WorkspaceState {
  workspaces: IWorkspace[];
  currentWorkspace: IWorkspace | null;
  isLoading: boolean;
  setWorkspaces: (workspaces: IWorkspace[]) => void;
  setCurrentWorkspace: (workspace: IWorkspace | null) => void;
  setLoading: (loading: boolean) => void;
  addWorkspace: (workspace: IWorkspace) => void;
  updateWorkspace: (id: string, updates: Partial<IWorkspace>) => void;
  removeWorkspace: (id: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaces: [],
  currentWorkspace: null,
  isLoading: true,
  setWorkspaces: (workspaces) => set({ workspaces }),
  setCurrentWorkspace: (currentWorkspace) => set({ currentWorkspace }),
  setLoading: (isLoading) => set({ isLoading }),
  addWorkspace: (workspace) =>
    set((state) => ({ workspaces: [workspace, ...state.workspaces] })),
  updateWorkspace: (id, updates) =>
    set((state) => ({
      workspaces: state.workspaces.map((w) =>
        w._id === id ? { ...w, ...updates } : w
      ),
      currentWorkspace:
        state.currentWorkspace?._id === id
          ? { ...state.currentWorkspace, ...updates }
          : state.currentWorkspace,
    })),
  removeWorkspace: (id) =>
    set((state) => ({
      workspaces: state.workspaces.filter((w) => w._id !== id),
      currentWorkspace:
        state.currentWorkspace?._id === id ? null : state.currentWorkspace,
    })),
}));
