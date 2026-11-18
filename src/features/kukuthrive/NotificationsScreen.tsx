import { useEffect, useState } from "react";
import { Bell, BellOff, Moon, Radio, Smartphone } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

import { showServerStub } from "./stub";
import { EmptyState, ModuleHeader, Notice, Panel, StubButton } from "./ui";

type PushState = "checking" | "unsupported" | "default" | "granted" | "denied";

const CATEGORIES = [
  {
    id: "welfare",
    name: "Welfare alerts",
    text: "From the rule engine, by severity. Critical alerts can override quiet hours.",
  },
  {
    id: "schedule",
    name: "Vaccinations & treatments",
    text: "Due soon, due today, late and missed — each stage once.",
  },
  {
    id: "expiry",
    name: "Expiry & withdrawal dates",
    text: "Vaccine expiry and the end of medication withdrawal periods.",
  },
  { id: "feed", name: "Feed stock", text: "Running low or nearing expiry." },
  { id: "missed", name: "Missed daily records", text: "A gentle prompt, never a welfare alarm." },
  { id: "quality", name: "Data-quality warnings", text: "Kept separate from welfare alerts." },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];
type Prefs = {
  categories: Record<CategoryId, boolean>;
  quietFrom: string;
  quietTo: string;
};

const DEFAULT_PREFS: Prefs = {
  categories: Object.fromEntries(CATEGORIES.map((c) => [c.id, true])) as Record<CategoryId, boolean>,
  quietFrom: "21:00",
  quietTo: "06:00",
};

function normalizePrefs(raw: unknown): Prefs {
  const value = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const cats =
    value["categories"] && typeof value["categories"] === "object"
      ? (value["categories"] as Record<string, unknown>)
      : {};
  return {
    categories: Object.fromEntries(
      CATEGORIES.map((c) => [c.id, typeof cats[c.id] === "boolean" ? (cats[c.id] as boolean) : true]),
    ) as Record<CategoryId, boolean>,
    quietFrom: typeof value["quietFrom"] === "string" ? value["quietFrom"] : DEFAULT_PREFS.quietFrom,
    quietTo: typeof value["quietTo"] === "string" ? value["quietTo"] : DEFAULT_PREFS.quietTo,
  };
}

async function loadPrefs(): Promise<Prefs> {
  const { data } = await api<{ data: unknown }>("/api/auth/preferences");
  return normalizePrefs(data);
}

async function savePrefs(data: Prefs): Promise<void> {
  await api("/api/auth/preferences", { method: "PUT", body: JSON.stringify(data) });
}

export function NotificationsScreen() {
  const [push, setPush] = useState<PushState>("checking");
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [loaded, setLoaded] = useState(false);
  const [savingQuiet, setSavingQuiet] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) setPush("unsupported");
    else setPush(Notification.permission as PushState);
  }, []);

  useEffect(() => {
    void loadPrefs()
      .then((data) => setPrefs(data))
      .catch(() => undefined)
      .finally(() => setLoaded(true));
  }, []);

  const persist = async (next: Prefs, message: string) => {
    setPrefs(next);
    try {
      await savePrefs(next);
      toast.success(message);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save your preference.");
    }
  };

  const pushLabel = {
    checking: "Checking…",
    unsupported: "Not supported on this device",
    default: "Not turned on",
    granted: "Allowed on this device",
    denied: "Blocked in browser settings",
  }[push];

  return (
    <div>
      <ModuleHeader
        eyebrow="Notification & alert delivery"
        title="Alerts that reach you, without flooding you"
        description="Every alert is recorded in the app first. Live updates and phone notifications are extra channels you control per device and per category."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Channel
          icon={<Bell />}
          title="In-app notification centre"
          status="Always on"
          tone="good"
          text="The permanent record. Alerts that arrive while you are offline appear here in order, with their original time."
        />
        <Channel
          icon={<Radio />}
          title="Live updates"
          status="Needs the server"
          tone="warn"
          text="While the app is open and connected, new alerts and late schedules appear instantly."
          action={
            <StubButton
              size="sm"
              variant="outline"
              feature="Live updates"
              behavior="This will keep a live connection open while the app is in use, so new alerts and late schedules appear instantly without refreshing."
            >
              Test live updates
            </StubButton>
          }
        />
        <Channel
          icon={push === "denied" || push === "unsupported" ? <BellOff /> : <Smartphone />}
          title="Phone notifications"
          status={pushLabel}
          tone={push === "granted" ? "good" : push === "denied" ? "bad" : "warn"}
          text="Short alerts when the app is closed or the phone is locked. They carry a title and severity only, never farm data. On iPhone, add KukuThrive to the home screen first."
          action={
            <StubButton
              size="sm"
              disabled={push === "unsupported"}
              feature="Phone notifications"
              behavior="This will ask for permission at a sensible moment, register this device, and send short lock-screen alerts with a link back into the app."
            >
              Turn on for this device
            </StubButton>
          }
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_360px]">
        <Panel
          title="Categories"
          description="Welfare alerts, reminders and data-quality prompts have separate settings. Saved to your account."
        >
          <div className="divide-y">
            {CATEGORIES.map((c) => (
              <div
                key={c.id}
                className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
              >
                <div>
                  <div className="text-sm font-semibold">{c.name}</div>
                  <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{c.text}</p>
                </div>
                <Switch
                  checked={prefs.categories[c.id]}
                  disabled={!loaded}
                  aria-label={c.name}
                  onCheckedChange={(value) =>
                    void persist(
                      { ...prefs, categories: { ...prefs.categories, [c.id]: value } },
                      value ? `${c.name} turned on.` : `${c.name} turned off.`,
                    )
                  }
                />
              </div>
            ))}
          </div>
        </Panel>
        <div className="space-y-5">
          <Panel title="Quiet hours" description="Normal alerts wait until quiet hours end. Saved to your account.">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="quiet-from">From</Label>
                <Input
                  id="quiet-from"
                  type="time"
                  value={prefs.quietFrom}
                  onChange={(e) => setPrefs((p) => ({ ...p, quietFrom: e.target.value }))}
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="quiet-to">Until</Label>
                <Input
                  id="quiet-to"
                  type="time"
                  value={prefs.quietTo}
                  onChange={(e) => setPrefs((p) => ({ ...p, quietTo: e.target.value }))}
                  className="h-11"
                />
              </div>
            </div>
            <Button
              className="mt-4 w-full"
              variant="outline"
              disabled={!loaded || savingQuiet}
              onClick={async () => {
                setSavingQuiet(true);
                try {
                  await savePrefs(prefs);
                  toast.success("Quiet hours saved.");
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Could not save quiet hours.");
                } finally {
                  setSavingQuiet(false);
                }
              }}
            >
              <Moon />
              Save quiet hours
            </Button>
          </Panel>
          <Notice title="Escalation">
            An unacknowledged critical alert is repeated after a set interval, then sent to the next
            responsible person on the farm.
          </Notice>
        </div>
      </div>

      <div className="mt-5">
        <Panel
          title="Delivery log"
          description="Every attempt, acknowledgement and escalation, so a missed alert can be explained later."
        >
          <EmptyState
            icon={<Bell />}
            title="No deliveries yet"
            description="Once delivery channels are connected, each alert's delivery attempts and who acknowledged it will be listed here."
          />
        </Panel>
      </div>
    </div>
  );
}

function Channel({
  icon,
  title,
  status,
  text,
  tone,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  status: string;
  text: string;
  tone: "good" | "warn" | "bad";
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-lg border bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground [&_svg]:size-5">
          {icon}
        </span>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-semibold",
            tone === "good" && "bg-success/12 text-success",
            tone === "warn" && "bg-warning/15 text-warning",
            tone === "bad" && "bg-destructive/10 text-destructive",
          )}
        >
          {status}
        </span>
      </div>
      <h3 className="mt-4 font-display text-base font-semibold">{title}</h3>
      <p className="mt-1 flex-1 text-xs leading-5 text-muted-foreground">{text}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
