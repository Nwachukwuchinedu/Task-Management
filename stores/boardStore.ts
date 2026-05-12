"use client";

import { create } from "zustand";
import { IBoard, IColumn, ITask } from "@/lib/types/models";

interface BoardState {
  boards: IBoard[];
  currentBoard: IBoard | null;
  isLoading: boolean;
  setBoards: (boards: IBoard[]) => void;
  setCurrentBoard: (board: IBoard | null) => void;
  setLoading: (loading: boolean) => void;
  addBoard: (board: IBoard) => void;
  updateBoard: (id: string, updates: Partial<IBoard>) => void;
  removeBoard: (id: string) => void;
  addColumn: (column: IColumn) => void;
  updateColumn: (columnId: string, updates: Partial<IColumn>) => void;
  removeColumn: (columnId: string) => void;
  reorderColumns: (columns: IColumn[]) => void;
  addTask: (columnId: string, task: ITask) => void;
  updateTask: (taskId: string, updates: Partial<ITask>) => void;
  removeTask: (columnId: string, taskId: string) => void;
  moveTask: (taskId: string, fromColumnId: string, toColumnId: string, newPosition: number) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  boards: [],
  currentBoard: null,
  isLoading: true,
  setBoards: (boards) => set({ boards }),
  setCurrentBoard: (currentBoard) => set({ currentBoard }),
  setLoading: (isLoading) => set({ isLoading }),
  addBoard: (board) => set((state) => ({ boards: [board, ...state.boards] })),
  updateBoard: (id, updates) =>
    set((state) => ({
      boards: state.boards.map((b) => (b._id === id ? { ...b, ...updates } : b)),
      currentBoard:
        state.currentBoard?._id === id
          ? { ...state.currentBoard, ...updates }
          : state.currentBoard,
    })),
  removeBoard: (id) =>
    set((state) => ({
      boards: state.boards.filter((b) => b._id !== id),
      currentBoard: state.currentBoard?._id === id ? null : state.currentBoard,
    })),
  addColumn: (column) =>
    set((state) => {
      if (!state.currentBoard) return state;
      return {
        currentBoard: {
          ...state.currentBoard,
          columns: [...state.currentBoard.columns, column],
        },
      };
    }),
  updateColumn: (columnId, updates) =>
    set((state) => {
      if (!state.currentBoard) return state;
      return {
        currentBoard: {
          ...state.currentBoard,
          columns: state.currentBoard.columns.map((c) =>
            c._id === columnId ? { ...c, ...updates } : c
          ),
        },
      };
    }),
  removeColumn: (columnId) =>
    set((state) => {
      if (!state.currentBoard) return state;
      return {
        currentBoard: {
          ...state.currentBoard,
          columns: state.currentBoard.columns.filter((c) => c._id !== columnId),
        },
      };
    }),
  reorderColumns: (columns) =>
    set((state) => {
      if (!state.currentBoard) return state;
      return {
        currentBoard: { ...state.currentBoard, columns },
      };
    }),
  addTask: (columnId, task) =>
    set((state) => {
      if (!state.currentBoard) return state;
      return {
        currentBoard: {
          ...state.currentBoard,
          columns: state.currentBoard.columns.map((c) =>
            c._id === columnId
              ? { ...c, tasks: [...(c.tasks || []), task] }
              : c
          ),
        },
      };
    }),
  updateTask: (taskId, updates) =>
    set((state) => {
      if (!state.currentBoard) return state;
      return {
        currentBoard: {
          ...state.currentBoard,
          columns: state.currentBoard.columns.map((c) => ({
            ...c,
            tasks: (c.tasks || []).map((t) =>
              t._id === taskId ? { ...t, ...updates } : t
            ),
          })),
        },
      };
    }),
  removeTask: (columnId, taskId) =>
    set((state) => {
      if (!state.currentBoard) return state;
      return {
        currentBoard: {
          ...state.currentBoard,
          columns: state.currentBoard.columns.map((c) =>
            c._id === columnId
              ? { ...c, tasks: (c.tasks || []).filter((t) => t._id !== taskId) }
              : c
          ),
        },
      };
    }),
  moveTask: (taskId, fromColumnId, toColumnId, newPosition) =>
    set((state) => {
      if (!state.currentBoard) return state;

      let taskToMove: ITask | undefined;

      const columnsWithoutTask = state.currentBoard.columns.map((c) => {
        if (c._id === fromColumnId) {
          const task = c.tasks?.find((t) => t._id === taskId);
          if (task) taskToMove = { ...task, column: toColumnId, position: newPosition };
          return {
            ...c,
            tasks: (c.tasks || []).filter((t) => t._id !== taskId),
          };
        }
        return c;
      });

      if (!taskToMove) return state;

      return {
        currentBoard: {
          ...state.currentBoard,
          columns: columnsWithoutTask.map((c) => {
            if (c._id === toColumnId) {
              const tasks = [...(c.tasks || [])];
              tasks.splice(newPosition, 0, taskToMove!);
              return {
                ...c,
                tasks: tasks.map((t, i) => ({ ...t, position: i })),
              };
            }
            return c;
          }),
        },
      };
    }),
}));
