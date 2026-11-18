import { useEffect, type ReactNode } from "react";
import { create } from "zustand";

import { api } from "@/lib/api";

export interface User {
  id: string;
  email: string;
  name: string;
  /** null = signed in but the Owner has not granted a role yet. */
  role: "owner" | "manager" | null;
  farmName?: string;
  createdAt?: string;
}

/** Shape the older screens read through `@/lib/store`. */
export interface LegacyUser {
  name: string;
  email: string;
  role: "Owner" | "Manager";
}

interface AuthState {
  user: User | null;
  legacyUser: LegacyUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  restore: () => Promise<void>;
}

function toLegacy(user: User | null): LegacyUser | null {
  if (!user || !user.role) return null;
  return { name: user.name, email: user.email, role: user.role === "owner" ? "Owner" : "Manager" };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  legacyUser: null,
  loading: true,

  login: async (email, password) => {
    const { user } = await api<{ user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    set({ user, legacyUser: toLegacy(user), loading: false });
  },

  logout: async () => {
    await api("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    set({ user: null, legacyUser: null, loading: false });
  },

  restore: async () => {
    try {
      const { user } = await api<{ user: User }>("/api/auth/me");
      set({ user, legacyUser: toLegacy(user), loading: false });
    } catch {
      set({ user: null, legacyUser: null, loading: false });
    }
  },
}));

export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    void useAuthStore.getState().restore();
  }, []);
  return <>{children}</>;
}

export function useAuth() {
  return useAuthStore();
}
