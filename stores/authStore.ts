"use client";

import { create } from "zustand";
import { IUser } from "@/lib/types/models";

interface AuthState {
  user: IUser | null;
  isLoading: boolean;
  setUser: (user: IUser | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
}));
