import { useAuth } from "../auth/AuthProvider";
import { Plus, Calendar } from "lucide-react";
interface VaccinationRow {
  id: string;
  date: string;
  flock: string;
  vaccine: string;
  batch: string;
  expiry: string;
  dose: string;
  route: "drinking water" | "injection" | "eye drop";
  by: string;
}

const SAMPLE: VaccinationRow[] = [
  {
    id: "v1",
    date: "2026-11-09",
    flock: "Kampala Layer 01",
    vaccine: "Newcastle (LaSota)",
    batch: "NV-2026-041",
    expiry: "2027-05-12",
    dose: "1 dose per bird",
    route: "drinking water",
    by: "Tracy",
  },
  {
    id: "v2",
    date: "2026-10-28",
    flock: "Entebbe Broiler 02",
    vaccine: "Gumboro (IBD)",
    batch: "IBD-2026-012",
    expiry: "2027-02-18",
    dose: "1 dose per bird",
    route: "drinking water",
    by: "Tracy",
  },
  {
    id: "v3",
    date: "2026-10-15",
    flock: "Jinja Layer 03",
    vaccine: "Marek's disease",
    batch: "MK-2026-003",
    expiry: "2027-01-30",
    dose: "0.2 ml per bird",
    route: "injection",
    by: "David",
  },
];

export function VaccinationList() {
  const { user } = useAuth();
  const canManage = user?.role === "owner" || user?.role === "manager";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Vaccinations
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Record vaccinations given to each flock, including batch number and expiry.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-secondary"
          >
            <Plus className="h-4 w-4" />
            Add vaccination
          </button>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="divide-y divide-border">
          <div className="bg-muted px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <div className="flex items-center gap-2">
              <span>Date</span>
              <span>Flock</span>
              <span className="hidden sm:inline">Vaccine</span>
              <span className="hidden md:inline">Batch</span>
              <span className="hidden lg:inline">Expiry</span>
              <span>Dose</span>
              <span className="hidden sm:inline">Route</span>
              <span>By</span>
            </div>
          </div>
          {SAMPLE.map((row) => (
            <div key={row.id} className="flex items-center gap-4 px-4 py-3 text-sm">
              <span className="text-muted-foreground">
                <Calendar className="inline h-3 w-3 mr-1 text-muted-foreground" />
                {row.date}
              </span>
              <span className="font-medium text-foreground">{row.flock}</span>
              <span className="hidden sm:inline flex-1 min-w-0 truncate text-foreground">
                {row.vaccine}
              </span>
              <span className="hidden md:inline flex-1 min-w-0 truncate text-muted-foreground font-mono text-xs">
                {row.batch}
              </span>
              <span className="hidden lg:inline text-muted-foreground">{row.expiry}</span>
              <span className="flex-1 min-w-0 truncate text-muted-foreground">
                {row.dose}
              </span>
              <span className="hidden sm:inline text-muted-foreground capitalize">
                {row.route}
              </span>
              <span className="text-muted-foreground">{row.by}</span>
            </div>
          ))}
        </div>
        {SAMPLE.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No vaccinations recorded yet. Add your first vaccination to start tracking flock
            immunity.
          </div>
        )}
      </div>
    </div>
  );
}
