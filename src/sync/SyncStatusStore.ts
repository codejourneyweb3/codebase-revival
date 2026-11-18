import { create } from "zustand";
export interface SyncStatusState {
  pending: number;
  syncing: boolean;
  error: string | null;
  lastSyncAt: string | null;
  setPending: (n: number) => void;
  incPending: () => void;
  decPending: () => void;
  setSyncing: (v: boolean) => void;
  setError: (e: string | null) => void;
  markSynced: () => void;
}

export const useSyncStatus = create<SyncStatusState>()((set) => ({
  pending: 0,
  syncing: false,
  error: null,
  lastSyncAt: null,
  setPending: (n) => set({ pending: n, error: null }),
  incPending: () => set((s) => ({ pending: s.pending + 1 })),
  decPending: () => set((s) => ({ pending: Math.max(0, s.pending - 1) })),
  setSyncing: (v) => set({ syncing: v }),
  setError: (e) => set({ error: e, syncing: false }),
  markSynced: () => set({ lastSyncAt: new Date().toISOString(), pending: 0, error: null }),
}));
