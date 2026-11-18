import { useState, type FormEvent, type ReactNode } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { AlertCircle, Calendar, CheckCircle, Plus, Wrench, X } from "lucide-react";
import { getDb, save, today, uid, type Equipment, type MaintenanceRecord } from "../../lib/db";
import { useAuth } from "../auth/AuthProvider";

const INPUT =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none";

export function EquipmentList() {
  const { user } = useAuth();
  const canManage = user?.role === "owner" || user?.role === "manager";
  const equipment = useLiveQuery(() => getDb().equipment.toArray(), []) ?? [];
  const records = useLiveQuery(() => getDb().maintenanceRecords.toArray(), []) ?? [];
  const [filter, setFilter] = useState("all");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    name: "",
    purchaseDate: today(),
    cost: "",
    condition: "Good",
    nextService: "",
  });
  const [servicing, setServicing] = useState<{
    equipmentId: string;
    description: string;
    cost: string;
    doneBy: string;
  } | null>(null);
  const [historyFor, setHistoryFor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const statusOf = (item: Equipment): "operational" | "maintenance_due" => {
    return item.nextService && item.nextService < today() ? "maintenance_due" : "operational";
  };

  const historyOf = (equipmentId: string) =>
    records
      .filter((record) => record.equipmentId === equipmentId)
      .sort((a, b) => b.date.localeCompare(a.date));

  const visible = equipment.filter((item) => filter === "all" || statusOf(item) === filter);

  async function addEquipment(event: FormEvent) {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("Give the equipment a name.");
      return;
    }
    const record: Equipment = {
      id: uid(),
      name: form.name.trim(),
      purchaseDate: form.purchaseDate,
      cost: Number(form.cost) || 0,
      condition: form.condition,
      nextService: form.nextService || form.purchaseDate,
    };
    await save("equipment", record, user?.name ?? "Unknown", "added equipment");
    setForm({ name: "", purchaseDate: today(), cost: "", condition: "Good", nextService: "" });
    setAdding(false);
    setError(null);
  }

  async function logMaintenance(event: FormEvent) {
    event.preventDefault();
    if (!servicing) return;
    if (!servicing.description.trim()) {
      setError("Describe the work done.");
      return;
    }
    const record: MaintenanceRecord = {
      id: uid(),
      equipmentId: servicing.equipmentId,
      date: today(),
      description: servicing.description.trim(),
      cost: Number(servicing.cost) || 0,
      doneBy: servicing.doneBy.trim() || "In-house",
    };
    await save("maintenanceRecords", record, user?.name ?? "Unknown", "logged maintenance");
    setServicing(null);
    setError(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Equipment
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track farm equipment, maintenance schedules, and service history.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            onClick={() => setAdding((value) => !value)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-secondary"
          >
            {adding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {adding ? "Cancel" : "Add equipment"}
          </button>
        )}
      </div>

      {adding && canManage && (
        <form
          onSubmit={addEquipment}
          className="space-y-4 rounded-lg border border-border bg-card p-5 shadow-sm"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Name">
              <input
                className={INPUT}
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Generator 5kVA"
              />
            </Field>
            <Field label="Purchased">
              <input
                type="date"
                className={INPUT}
                value={form.purchaseDate}
                onChange={(event) => setForm({ ...form, purchaseDate: event.target.value })}
              />
            </Field>
            <Field label="Cost (UGX)">
              <input
                type="number"
                min={0}
                className={INPUT}
                value={form.cost}
                onChange={(event) => setForm({ ...form, cost: event.target.value })}
              />
            </Field>
            <Field label="Condition">
              <select
                className={INPUT}
                value={form.condition}
                onChange={(event) => setForm({ ...form, condition: event.target.value })}
              >
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </Field>
            <Field label="Next service">
              <input
                type="date"
                className={INPUT}
                value={form.nextService}
                onChange={(event) => setForm({ ...form, nextService: event.target.value })}
              />
            </Field>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            className="rounded-lg bg-success px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-success/90"
          >
            Save equipment
          </button>
        </form>
      )}

      <div className="flex items-center gap-3">
        <select
          className="rounded-lg border border-input bg-background py-2 px-3 text-sm text-foreground focus:border-ring focus:outline-none"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="operational">Operational</option>
          <option value="maintenance_due">Maintenance due</option>
        </select>
      </div>

      {error && !adding && !servicing && (
        <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="divide-y divide-border">
          {visible.map((row) => {
            const history = historyOf(row.id);
            const last = history[0];
            return (
              <div key={row.id} className="px-4 py-3 text-sm">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Wrench className="h-4 w-4" />
                  </div>
                  <span className="min-w-0 flex-1 font-medium text-foreground">
                    {row.name}
                  </span>
                  <span className="hidden sm:inline text-muted-foreground">
                    {row.condition}
                  </span>
                  <span className="hidden md:inline text-muted-foreground num">
                    UGX {row.cost.toLocaleString()}
                  </span>
                  <span className="hidden lg:inline text-muted-foreground">
                    Last: {last ? last.date : "—"}
                  </span>
                  <StatusBadge status={statusOf(row)} />
                  <span className="text-xs text-muted-foreground">
                    Next {row.nextService}
                  </span>
                  {canManage && (
                    <button
                      type="button"
                      onClick={() =>
                        setServicing({ equipmentId: row.id, description: "", cost: "", doneBy: "" })
                      }
                      className="rounded-md bg-background px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      Log service
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setHistoryFor((current) => (current === row.id ? null : row.id))}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted"
                    aria-label={`Maintenance history for ${row.name}`}
                  >
                    <Calendar className="h-4 w-4" />
                  </button>
                </div>

                {servicing?.equipmentId === row.id && (
                  <form
                    onSubmit={logMaintenance}
                    className="mt-3 flex flex-wrap items-end gap-3 rounded-lg bg-background p-3"
                  >
                    <Field label="Work done">
                      <input
                        className={`${INPUT} w-56`}
                        value={servicing.description}
                        onChange={(event) =>
                          setServicing({ ...servicing, description: event.target.value })
                        }
                        placeholder="Oil and filter change"
                      />
                    </Field>
                    <Field label="Cost (UGX)">
                      <input
                        type="number"
                        min={0}
                        className={`${INPUT} w-32`}
                        value={servicing.cost}
                        onChange={(event) =>
                          setServicing({ ...servicing, cost: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="Done by">
                      <input
                        className={`${INPUT} w-40`}
                        value={servicing.doneBy}
                        onChange={(event) =>
                          setServicing({ ...servicing, doneBy: event.target.value })
                        }
                        placeholder="In-house"
                      />
                    </Field>
                    <button
                      type="submit"
                      className="rounded-lg bg-success px-3 py-2 text-sm font-medium text-white hover:bg-success/90"
                    >
                      Save service
                    </button>
                    <button
                      type="button"
                      onClick={() => setServicing(null)}
                      className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                    >
                      Cancel
                    </button>
                  </form>
                )}

                {historyFor === row.id && (
                  <div className="mt-3 space-y-1 rounded-lg bg-background p-3">
                    {history.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        No maintenance recorded yet.
                      </p>
                    ) : (
                      history.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground"
                        >
                          <span className="font-medium text-foreground">{entry.date}</span>
                          <span className="min-w-0 flex-1">{entry.description}</span>
                          <span>{entry.doneBy}</span>
                          <span className="num">UGX {entry.cost.toLocaleString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {visible.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            {equipment.length === 0
              ? "No equipment recorded yet. Add your first equipment item to start tracking maintenance."
              : "No equipment matches this filter."}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function StatusBadge({ status }: { status: "operational" | "maintenance_due" }) {
  return (
    <span
      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
        status === "operational"
          ? "bg-success/10 text-success"
          : "bg-warning/10 text-warning"
      }`}
    >
      {status === "operational" ? (
        <CheckCircle className="h-3 w-3" />
      ) : (
        <AlertCircle className="h-3 w-3" />
      )}
      {status === "operational" ? "Operational" : "Maintenance due"}
    </span>
  );
}
