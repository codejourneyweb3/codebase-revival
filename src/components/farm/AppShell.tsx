import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "@/lib/router-compat";
import type { LucideIcon } from "lucide-react";

type NavItem = { to: string; label: string; icon: LucideIcon };
import {
  LayoutDashboard,
  Bird,
  ClipboardList,
  Syringe,
  Wheat,
  ShoppingCart,
  Users,
  Receipt,
  Wallet,
  BarChart3,
  FileText,
  Bell,
  FolderOpen,
  Settings,
  Menu,
  Building2,
  Wrench,
  HeartHandshake,
  Scale,
  Droplets,
  Wind,
  Layers,
  Stethoscope,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Ruler,
  BellRing,
  PanelLeftClose,
  PanelLeft,
  Wifi,
  WifiOff,
  RefreshCw,
  LogOut,
  Egg,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth, useUi } from "@/lib/store";
import { useData, useOnline } from "@/lib/hooks";

import { syncNow } from "@/lib/sync";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSyncStatus } from "@/sync/SyncStatusStore";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const groups: { label: string; items: NavItem[] }[] = [
  {
    label: "Today",
    items: [
      { to: "/", label: "Overview", icon: LayoutDashboard },
      { to: "/daily", label: "Daily Operations", icon: ClipboardList },
      { to: "/alerts", label: "Alerts", icon: Bell },
    ],
  },
  {
    label: "Farm",
    items: [
      { to: "/farm", label: "Farm & Houses", icon: Building2 },
      { to: "/flocks", label: "Flocks", icon: Bird },
      { to: "/equipment", label: "Equipment", icon: Wrench },
    ],
  },
  {
    label: "Welfare",
    items: [
      { to: "/welfare", label: "Welfare Intelligence", icon: HeartHandshake },
      { to: "/growth", label: "Growth & Weighing", icon: Scale },
      { to: "/feed", label: "Feed & Inventory", icon: Wheat },
      { to: "/water", label: "Water", icon: Droplets },
      { to: "/environment", label: "Environment", icon: Wind },
      { to: "/litter", label: "Litter", icon: Layers },
      { to: "/health", label: "Health", icon: Stethoscope },
      { to: "/vaccination", label: "Vaccination", icon: Syringe },
      { to: "/biosecurity", label: "Biosecurity", icon: ShieldCheck },
    ],
  },
  {
    label: "Money",
    items: [
      { to: "/sales", label: "Sales", icon: ShoppingCart },
      { to: "/customers", label: "Customers", icon: Users },
      { to: "/expenses", label: "Expenses", icon: Receipt },
      { to: "/cashup", label: "Cash-up", icon: Wallet },
    ],
  },
  {
    label: "Insight",
    items: [
      { to: "/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/reports", label: "Reports", icon: FileText },
      { to: "/assistant", label: "Assistant", icon: Sparkles },
    ],
  },
  {
    label: "Knowledge & Admin",
    items: [
      { to: "/guides", label: "Field Guides", icon: BookOpen },
      { to: "/standards", label: "Standards", icon: Ruler },
      { to: "/documents", label: "Documents", icon: FolderOpen },
      { to: "/notifications", label: "Notifications", icon: BellRing },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
];
const all = groups.flatMap((g) => g.items);
const bottom: NavItem["to"][] = ["/", "/daily", "/welfare", "/flocks"];

function NavList({ collapsed, onNav }: { collapsed?: boolean; onNav?: () => void }) {
  const { pathname } = useLocation();
  return (
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
      {groups.map((g) => (
        <div key={g.label}>
          {!collapsed && (
            <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
              {g.label}
            </div>
          )}
          {g.items.map((i) => {
            const active = i.to === "/" ? (pathname === "/" || pathname === "/dashboard") : pathname.startsWith(i.to);
            return (
              <Link
                key={i.to}
                to={i.to}
                onClick={onNav}
                title={i.label}
                className={cn(
                  "flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60",
                  collapsed && "justify-center",
                )}
              >
                <i.icon className={cn("size-4 shrink-0", active && "text-sidebar-primary")} />
                {!collapsed && i.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function Brand({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-4">
      <div className="grid size-9 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
        <Egg className="size-5" />
      </div>
      {!collapsed && (
        <div>
          <div className="font-display text-base font-semibold leading-tight">KukuThrive</div>
          <div className="text-[11px] text-sidebar-foreground/60">Farm & welfare intelligence</div>
        </div>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  const { collapsed, toggle } = useUi();
  const [mobile, setMobile] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const online = useOnline();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const pending = useData((db) => db.outbox.count()) ?? 0;
  const syncError = useSyncStatus(s => s.error);
  const unread = useData((db) => db.alerts.filter((a) => !a.read && !a.resolved).count()) ?? 0;


  useEffect(() => {
    if (online) void syncNow().catch(() => {});
  }, [online]);
  useEffect(() => {
    if (online && pending) void syncNow().catch(() => {});
  }, [online, pending]);

  if (!user) return <div className="p-8 text-center">Your account is waiting for farm access.</div>;
  const title =
    [...all].reverse().find((i) => (i.to === "/" ? (pathname === "/" || pathname === "/dashboard") : pathname.startsWith(i.to)))
      ?.label ?? "";
  const samplePages = ["/alerts", "/analytics", "/cashup", "/documents", "/feed/stock", "/health/records", "/medication", "/stock", "/vaccination/records", "/reports"];

  return (
    <div className="flex min-h-screen">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex",
          collapsed ? "w-16" : "w-60",
        )}
      >
        <Brand collapsed={collapsed} />
        <NavList collapsed={collapsed} />
        <Button variant="ghost"
          onClick={toggle}
          className="m-3 flex items-center justify-center gap-2 rounded-md py-2 text-xs text-sidebar-foreground/70 hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <PanelLeft className="size-4" />
          ) : (
            <>
              <PanelLeftClose className="size-4" /> Collapse
            </>
          )}
        </Button>
      </aside>

      <Sheet open={mobile} onOpenChange={setMobile}>
        <SheetContent side="left" className="w-80 max-w-[90vw] border-0 bg-sidebar p-0 text-sidebar-foreground">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Brand />
          <NavList onNav={() => setMobile(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-card/95 px-4 backdrop-blur">
          <Button variant="ghost" className="lg:hidden" onClick={() => setMobile(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </Button>
          <div className="font-display text-base font-semibold">{title}</div>
          <div className="ml-auto flex items-center gap-2 text-xs sm:gap-3">
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium",
                online ? "bg-success/12 text-success" : "bg-warning/15 text-warning",
              )}
            >
              {online ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5" />}
              {online ? "Online" : "Offline"}
            </span>
            <Button variant="ghost"
              onClick={async () => {
                setSyncing(true);
                await syncNow().catch(e => toast.error(e instanceof Error ? e.message : "Sync failed"));
                setSyncing(false);
              }}
              className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 font-medium text-muted-foreground hover:text-foreground"
              title="Sync now"
            >
              <RefreshCw className={cn("size-3.5", syncing && "animate-spin")} />
              <span className="num">{pending}</span>
              <span className="hidden sm:inline">Pending sync</span>
            </Button>
            <Link
              to="/alerts"
              className="relative rounded-full p-1.5 hover:bg-muted"
              aria-label="Alerts"
            >
              <Bell className="size-4" />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {unread}
                </span>
              )}
            </Link>
            <div className="hidden items-center gap-2 border-l pl-3 sm:flex">
              <div className="grid size-8 place-items-center rounded-full bg-accent font-semibold text-accent-foreground">
                {user.name[0]}
              </div>
              <div className="leading-tight">
                <div className="font-medium text-foreground">{user.name}</div>
                <div className="text-muted-foreground">
                  {user.role === "Owner" ? "Owner" : "Farm Manager"}
                </div>
              </div>
              <Button variant="ghost"
                onClick={async () => {
                  await logout();
                  void nav("/login");
                }}
                title="Log out"
                className="ml-1 rounded p-1 hover:bg-muted"
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>
        </header>
        {syncError && <p role="alert" className="border-b bg-warning/10 px-4 py-2 text-xs text-warning">Your changes are kept on this device. Sync: {syncError}</p>}
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-24 pt-6 lg:px-8 lg:pb-10">
          {samplePages.includes(pathname) && <p role="status" className="mb-4 border-l-2 border-warning bg-warning/10 px-4 py-3 text-sm text-foreground">Sample view from the original app. Figures and actions on this page are not connected to your farm records yet.</p>}
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t bg-card pb-[env(safe-area-inset-bottom)] lg:hidden">
        {bottom.map((to) => {
          const i = all.find((x) => x.to === to);
          if (!i) return null;
          const active = to === "/" ? (pathname === "/" || pathname === "/dashboard") : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[11px]",
                active ? "text-primary font-semibold" : "text-muted-foreground",
              )}
            >
              <i.icon className="size-5" />
              {i.label.split(" ")[0]}
            </Link>
          );
        })}
        <Button variant="ghost"
          onClick={() => setMobile(true)}
          className="flex flex-col items-center gap-1 py-2.5 text-[11px] text-muted-foreground"
        >
          <Menu className="size-5" />
          More
        </Button>
      </nav>
    </div>
  );
}
