import { useSyncStatus, type SyncStatusState } from "../../sync/SyncStatusStore";
import { useAuth } from "../../features/auth/AuthProvider";
import { Menu, WifiOff, RefreshCw, Wifi } from "lucide-react";
export function HeaderBar() {
  const sync = useSyncStatus();
  const auth = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--color-card)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Menu className="h-6 w-6 text-[var(--primary)]" />
          <div className="flex flex-col">
            <span className="font-display text-lg font-semibold text-[var(--foreground)]">
              KukuThrive
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">
              {auth.user?.role === "owner" ? "Owner" : "Farm Manager"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <SyncPill sync={sync} />
        </div>
      </div>
    </header>
  );
}

function SyncPill({ sync }: { sync: SyncStatusState }) {
  const status =
    sync.pending > 0
      ? "offline"
      : sync.syncing
        ? "syncing"
        : sync.error
          ? "error"
          : sync.lastSyncAt
            ? "synced"
            : "idle";

  const icon =
    status === "error" ? (
      <WifiOff className="h-4 w-4" />
    ) : status === "syncing" ? (
      <RefreshCw className="h-4 w-4 animate-spin" />
    ) : (
      <Wifi className="h-4 w-4" />
    );

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium
        ${
          status === "error"
            ? "bg-[var(--destructive)]/10 text-[var(--destructive)]"
            : status === "syncing"
              ? "bg-[var(--warning)]/10 text-[var(--warning)]"
              : status === "offline"
                ? "bg-[var(--muted)] text-[var(--muted-foreground)]"
                : "bg-[var(--success)]/10 text-[var(--success)]"
        }
      `}
    >
      {icon}
      <span>
        {status === "idle" && "Offline"}
        {status === "offline" && `Syncing ${sync.pending}`}
        {status === "syncing" && "Syncing…"}
        {status === "error" && sync.error}
        {status === "synced" && "Synced"}
      </span>
    </span>
  );
}
