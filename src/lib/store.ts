import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore, type LegacyUser } from "@/features/auth/AuthProvider";

export type User = LegacyUser;

interface LegacyAuthView {
  user: LegacyUser | null;
  logout: () => Promise<void>;
}

/** Read-only view over the Cloud-backed auth store, kept for the screens that use it. */
export function useAuth<T>(selector: (s: LegacyAuthView) => T): T {
  return useAuthStore((s) => selector({ user: s.legacyUser, logout: s.logout }));
}

interface UiState {
  collapsed: boolean;
  toggle: () => void;
}
export const useUi = create<UiState>()(
  persist(
    (set) => ({ collapsed: false, toggle: () => set((s) => ({ collapsed: !s.collapsed })) }),
    { name: "farm-ui" },
  ),
);
