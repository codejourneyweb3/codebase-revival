import { useAuth } from "../auth/AuthProvider";
import { useState } from "react";
import { Plus } from "lucide-react";
interface HealthRow {
  id: string;
  date: string;
  flock: string;
  observation: string;
  action: string;
  severity: "normal" | "warning" | "critical";
  by: string;
}

const SAMPLE: HealthRow[] = [
  {
    id: "h1",
    date: "2026-11-09",
    flock: "Kampala Layer 01",
    observation: "Slight drop in feed intake",
    action: "Monitored, increasing water vitamin support",
    severity: "warning",
    by: "Tracy",
  },
  {
    id: "h2",
    date: "2026-11-07",
    flock: "Entebbe Broiler 02",
    observation: "Two birds lethargic",
    action: "Isolated, vet consulted",
    severity: "critical",
    by: "Tracy",
  },
  {
    id: "h3",
    date: "2026-11-05",
    flock: "Jinja Layer 03",
    observation: "Normal behaviour",
    action: "Routine check",
    severity: "normal",
    by: "David",
  },
];

export function HealthList() {
  const { user } = useAuth();
  const canManage = user?.role === "owner" || user?.role === "manager";
  const [filter, setFilter] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Health & observations
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Log daily health observations and actions taken. Flag issues early so the right action
            is taken.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-secondary"
          >
            <Plus className="h-4 w-4" />
            Add record
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <select
          className="rounded-lg border border-input bg-background py-2 px-3 text-sm text-foreground focus:border-ring focus:outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All severity</option>
          <option value="normal">Normal</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="divide-y divide-border">
          <div className="bg-muted px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <div className="flex items-center gap-2">
              <span>Date</span>
              <span>Flock</span>
              <span className="hidden sm:inline">Observation</span>
              <span className="hidden md:inline">Action</span>
              <span>Severity</span>
            </div>
          </div>
          {SAMPLE.map((row) => (
            <div key={row.id} className="flex items-center gap-4 px-4 py-3 text-sm">
              <span className="text-muted-foreground">{row.date}</span>
              <span className="font-medium text-foreground">{row.flock}</span>
              <span className="hidden sm:inline flex-1 min-w-0 truncate text-muted-foreground">
                {row.observation}
              </span>
              <span className="hidden md:inline flex-1 min-w-0 truncate text-muted-foreground">
                {row.action}
              </span>
              <SeverityBadge severity={row.severity} />
            </div>
          ))}
        </div>
        {SAMPLE.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No health records yet. Add your first observation to start tracking flock health.
          </div>
        )}
      </div>
    </div>
  );
}

function SeverityBadge({ severity }: { severity: HealthRow["severity"] }) {
  const tone =
    severity === "critical"
      ? "bg-destructive/10 text-destructive"
      : severity === "warning"
        ? "bg-warning/10 text-warning"
        : "bg-success/10 text-success";
  const dot =
    severity === "critical"
      ? "bg-destructive"
      : severity === "warning"
        ? "bg-warning"
        : "bg-success";
  return (
    <span
      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${tone}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {severity}
    </span>
  );
}
