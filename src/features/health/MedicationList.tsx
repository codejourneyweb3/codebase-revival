import { useAuth } from "../auth/AuthProvider";
import { Plus } from "lucide-react";
interface MedicationRow {
  id: string;
  date: string;
  flock: string;
  medicine: string;
  dose: string;
  route: "oral" | "injection" | "water" | " spray";
  reason: string;
  by: string;
}

const SAMPLE: MedicationRow[] = [
  {
    id: "m1",
    date: "2026-11-09",
    flock: "Entebbe Broiler 02",
    medicine: "Amprolium",
    dose: "2.5 ml per litre",
    route: "water",
    reason: "Coccidiosis prevention",
    by: "Tracy",
  },
  {
    id: "m2",
    date: "2026-11-05",
    flock: "Kampala Layer 01",
    medicine: "Vitamin supplement",
    dose: "5 ml per litre",
    route: "water",
    reason: "Stress recovery",
    by: "David",
  },
  {
    id: "m3",
    date: "2026-10-28",
    flock: "Jinja Layer 03",
    medicine: "Tylan",
    dose: "1 ml per bird",
    route: "injection",
    reason: "Respiratory signs",
    by: "Tracy",
  },
];

export function MedicationList() {
  const { user } = useAuth();
  const canManage = user?.role === "owner" || user?.role === "manager";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Medication
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Record medications given to flocks, including dose, route, and reason.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-secondary"
          >
            <Plus className="h-4 w-4" />
            Add medication
          </button>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="divide-y divide-border">
          <div className="bg-muted px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <div className="flex items-center gap-2">
              <span>Date</span>
              <span>Flock</span>
              <span className="hidden sm:inline">Medicine</span>
              <span className="hidden md:inline">Dose</span>
              <span className="hidden lg:inline">Route</span>
              <span>Reason</span>
              <span>By</span>
            </div>
          </div>
          {SAMPLE.map((row) => (
            <div key={row.id} className="flex items-center gap-4 px-4 py-3 text-sm">
              <span className="text-muted-foreground">{row.date}</span>
              <span className="font-medium text-foreground">{row.flock}</span>
              <span className="hidden sm:inline flex-1 min-w-0 truncate text-foreground">
                {row.medicine}
              </span>
              <span className="hidden md:inline flex-1 min-w-0 truncate text-muted-foreground">
                {row.dose}
              </span>
              <span className="hidden lg:inline text-muted-foreground capitalize">
                {row.route}
              </span>
              <span className="flex-1 min-w-0 truncate text-muted-foreground">
                {row.reason}
              </span>
              <span className="text-muted-foreground">{row.by}</span>
            </div>
          ))}
        </div>
        {SAMPLE.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No medication records yet. Add your first medication to start tracking treatments.
          </div>
        )}
      </div>
    </div>
  );
}
