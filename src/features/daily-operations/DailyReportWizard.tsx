import { useState, type ReactNode } from "react";
import { Link } from "@/lib/router-compat";
import { useLiveQuery } from "dexie-react-hooks";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, Save } from "lucide-react";
import { getDb, saveDailyReport, today, uid, type DailyReport, type Flock } from "../../lib/db";
import { useAuth } from "../auth/AuthProvider";

const STEPS = [
  { id: "overview", label: "Overview" },
  { id: "eggs", label: "Egg records" },
  { id: "health", label: "Health & medication" },
  { id: "feed", label: "Feed usage" },
  { id: "weights", label: "Weight samples" },
  { id: "mortality", label: "Mortality" },
  { id: "sales", label: "Sales" },
  { id: "payments", label: "Payments" },
] as const;

interface Draft {
  date: string;
  flockId: string;
  notes: string;
  collected: string;
  broken: string;
  cracked: string;
  sickBirds: string;
  observations: string;
  feedType: string;
  feedGivenKg: string;
  feedRemainingKg: string;
  waterL: string;
  avgWeightKg: string;
  uniformity: string;
  sampled: string;
  gradeSmall: string;
  gradeMedium: string;
  gradeLarge: string;
  gradeXl: string;
  temperatureC: string;
  deaths: string;
  deathCause: string;
  disposal: string;
}

const EMPTY: Draft = {
  date: "",
  flockId: "",
  notes: "",
  collected: "",
  broken: "",
  cracked: "",
  sickBirds: "",
  observations: "",
  feedType: "Layers Mash",
  feedGivenKg: "",
  feedRemainingKg: "",
  waterL: "",
  avgWeightKg: "",
  uniformity: "",
  sampled: "",
  gradeSmall: "",
  gradeMedium: "",
  gradeLarge: "",
  gradeXl: "",
  temperatureC: "",
  deaths: "",
  deathCause: "",
  disposal: "Burial",
};

const INPUT =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-ring focus:outline-none";

export function DailyReportWizard() {
  const { user } = useAuth();
  const flocks = useLiveQuery(() => getDb().flocks.toArray(), []) ?? [];
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({ ...EMPTY, date: today() });
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (patch: Partial<Draft>) => setDraft((prev) => ({ ...prev, ...patch }));
  const num = (value: string) => (value.trim() === "" ? undefined : Number(value));

  async function finish() {
    if (!draft.flockId) {
      setError("Choose a flock before finishing the report.");
      setStep(0);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const report: DailyReport = {
        id: uid(),
        flockId: draft.flockId,
        date: draft.date,
        manager: user?.name ?? "Unknown",
        status: "Submitted",
        eggs: num(draft.collected),
        broken: num(draft.broken),
        cracked: num(draft.cracked),
        deaths: num(draft.deaths),
        deathCause: draft.deathCause || undefined,
        disposal: draft.disposal || undefined,
        feedType: draft.feedType || undefined,
        feedGivenKg: num(draft.feedGivenKg),
        feedRemainingKg: num(draft.feedRemainingKg),
        waterL: num(draft.waterL),
        temperatureC: num(draft.temperatureC),
        avgWeightKg: num(draft.avgWeightKg),
        uniformity: num(draft.uniformity),
        sickBirds: num(draft.sickBirds),
        sampled: num(draft.sampled),
        gradeSmall: num(draft.gradeSmall),
        gradeMedium: num(draft.gradeMedium),
        gradeLarge: num(draft.gradeLarge),
        gradeXl: num(draft.gradeXl),
        observations: draft.observations || undefined,
        notes: draft.notes || undefined,
        step: STEPS.length,
      };
      await saveDailyReport(report, user?.name ?? "Unknown");
      setSavedId(report.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the report.");
    } finally {
      setSaving(false);
    }
  }

  if (savedId) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="rounded-full bg-success/10 p-2 text-success">
              <CheckCircle className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-display text-xl font-semibold text-foreground">
                Report saved
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Egg, mortality, feed and weight numbers were split into their own records and queued
                for sync.
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <Link
              to="/"
              className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-secondary"
            >
              Back to overview
            </Link>
            <Link
              to="/flocks"
              className="rounded-lg bg-background px-4 py-2 font-medium text-foreground hover:bg-muted"
            >
              View flocks
            </Link>
            <Button
              type="button"
              className="rounded-lg bg-background px-4 py-2 font-medium text-foreground hover:bg-muted"
              onClick={() => {
                setSavedId(null);
                setDraft({ ...EMPTY, date: today() });
                setStep(0);
              }}
            >
              Start another report
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Daily report
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Capture one day at a time. Everything you enter is stored locally and queued for sync.
          </p>
        </div>
        <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
          Step {step + 1} of {STEPS.length}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {STEPS.map((s, i) => (
          <StepIndicator key={s.id} label={s.label} idx={i} active={i === step} done={i < step} />
        ))}
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <StepContent step={step} draft={draft} set={set} flocks={flocks} />
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <Button
          type="button"
          disabled={step === 0 || saving}
          className="inline-flex items-center gap-2 rounded-lg bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        {step === STEPS.length - 1 ? (
          <Button
            type="button"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-success/90 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => void finish()}
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Finish report"}
          </Button>
        ) : (
          <Button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-secondary"
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="block text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function StepIndicator({
  label,
  idx,
  active,
  done,
}: {
  label: string;
  idx: number;
  active: boolean;
  done: boolean;
}) {
  const tone = active
    ? "bg-primary text-primary-foreground"
    : done
      ? "bg-success text-primary-foreground"
      : "bg-muted text-muted-foreground";
  return (
    <div
      className={`flex h-14 min-w-0 flex-col items-center justify-center rounded-md text-xs font-medium ${tone}`}
    >
      {done ? <CheckCircle className="h-3.5 w-3.5" /> : <span>{idx + 1}</span>}
      <span className="mt-0.5 max-w-full truncate px-1">{label}</span>
    </div>
  );
}

function StepContent({
  step,
  draft,
  set,
  flocks,
}: {
  step: number;
  draft: Draft;
  set: (patch: Partial<Draft>) => void;
  flocks: Flock[];
}) {
  switch (step) {
    case 0:
      return (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">Overview</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Report date">
              <input
                type="date"
                className={INPUT}
                value={draft.date}
                onChange={(e) => set({ date: e.target.value })}
              />
            </Field>
            <Field label="Flock">
              <select
                className={INPUT}
                value={draft.flockId}
                onChange={(e) => set({ flockId: e.target.value })}
              >
                <option value="">Select flock…</option>
                {flocks.map((flock) => (
                  <option key={flock.id} value={flock.id}>
                    {flock.name} · {flock.liveCount} birds
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Notes" hint="Anything the rest of the report does not capture.">
            <textarea
              className={INPUT}
              rows={3}
              value={draft.notes}
              onChange={(e) => set({ notes: e.target.value })}
            />
          </Field>
          {flocks.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No flocks yet — add one from{" "}
              <Link className="underline" to="/flocks">
                Flocks
              </Link>{" "}
              first.
            </p>
          )}
        </div>
      );
    case 1:
      return (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Egg records
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Collected">
              <input
                type="number"
                min={0}
                className={INPUT}
                value={draft.collected}
                onChange={(e) => set({ collected: e.target.value })}
              />
            </Field>
            <Field label="Broken">
              <input
                type="number"
                min={0}
                className={INPUT}
                value={draft.broken}
                onChange={(e) => set({ broken: e.target.value })}
              />
            </Field>
            <Field label="Cracked">
              <input
                type="number"
                min={0}
                className={INPUT}
                value={draft.cracked}
                onChange={(e) => set({ cracked: e.target.value })}
              />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-4">
            <Field label="Small">
              <input
                type="number"
                min={0}
                className={INPUT}
                value={draft.gradeSmall}
                onChange={(e) => set({ gradeSmall: e.target.value })}
              />
            </Field>
            <Field label="Medium">
              <input
                type="number"
                min={0}
                className={INPUT}
                value={draft.gradeMedium}
                onChange={(e) => set({ gradeMedium: e.target.value })}
              />
            </Field>
            <Field label="Large">
              <input
                type="number"
                min={0}
                className={INPUT}
                value={draft.gradeLarge}
                onChange={(e) => set({ gradeLarge: e.target.value })}
              />
            </Field>
            <Field label="Extra large">
              <input
                type="number"
                min={0}
                className={INPUT}
                value={draft.gradeXl}
                onChange={(e) => set({ gradeXl: e.target.value })}
              />
            </Field>
          </div>
          <p className="text-xs text-muted-foreground">
            Grade sizes are optional — leave them blank when the eggs leave unsorted.
          </p>
        </div>
      );
    case 2:
      return (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Health &amp; medication
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Sick birds">
              <input
                type="number"
                min={0}
                className={INPUT}
                value={draft.sickBirds}
                onChange={(e) => set({ sickBirds: e.target.value })}
              />
            </Field>
            <Field label="Water drunk (L)">
              <input
                type="number"
                min={0}
                className={INPUT}
                value={draft.waterL}
                onChange={(e) => set({ waterL: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Observations" hint="Symptoms, treatments given, vet visits.">
            <textarea
              className={INPUT}
              rows={3}
              value={draft.observations}
              onChange={(e) => set({ observations: e.target.value })}
            />
          </Field>
        </div>
      );
    case 3:
      return (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Feed usage
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Feed type">
              <select
                className={INPUT}
                value={draft.feedType}
                onChange={(e) => set({ feedType: e.target.value })}
              >
                <option value="Layers Mash">Layers Mash</option>
                <option value="Broiler Grower">Broiler Grower</option>
                <option value="Chick Starter">Chick Starter</option>
              </select>
            </Field>
            <Field label="Given (kg)">
              <input
                type="number"
                min={0}
                step="0.1"
                className={INPUT}
                value={draft.feedGivenKg}
                onChange={(e) => set({ feedGivenKg: e.target.value })}
              />
            </Field>
            <Field label="Left in store (kg)">
              <input
                type="number"
                min={0}
                step="0.1"
                className={INPUT}
                value={draft.feedRemainingKg}
                onChange={(e) => set({ feedRemainingKg: e.target.value })}
              />
            </Field>
          </div>
        </div>
      );
    case 4:
      return (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Weight samples
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Birds weighed">
              <input
                type="number"
                min={0}
                className={INPUT}
                value={draft.sampled}
                onChange={(e) => set({ sampled: e.target.value })}
              />
            </Field>
            <Field label="Average weight (kg)">
              <input
                type="number"
                min={0}
                step="0.01"
                className={INPUT}
                value={draft.avgWeightKg}
                onChange={(e) => set({ avgWeightKg: e.target.value })}
              />
            </Field>
            <Field label="Uniformity (%)">
              <input
                type="number"
                min={0}
                max={100}
                className={INPUT}
                value={draft.uniformity}
                onChange={(e) => set({ uniformity: e.target.value })}
              />
            </Field>
            <Field label="Temperature (°C)">
              <input
                type="number"
                className={INPUT}
                value={draft.temperatureC}
                onChange={(e) => set({ temperatureC: e.target.value })}
              />
            </Field>
          </div>
        </div>
      );
    case 5:
      return (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">Mortality</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Deaths">
              <input
                type="number"
                min={0}
                className={INPUT}
                value={draft.deaths}
                onChange={(e) => set({ deaths: e.target.value })}
              />
            </Field>
            <Field label="Suspected cause">
              <input
                className={INPUT}
                value={draft.deathCause}
                onChange={(e) => set({ deathCause: e.target.value })}
                placeholder="Disease, heat, predator…"
              />
            </Field>
            <Field label="Disposal">
              <select
                className={INPUT}
                value={draft.disposal}
                onChange={(e) => set({ disposal: e.target.value })}
              >
                <option value="Burial">Burial</option>
                <option value="Burning">Burning</option>
                <option value="Sold">Sold</option>
                <option value="Other">Other</option>
              </select>
            </Field>
          </div>
        </div>
      );
    case 6:
      return (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">Sales</h2>
          <p className="text-sm text-muted-foreground">
            Sales are recorded with their own prices, customers and payments so stock and money stay
            consistent. Add today&apos;s sales on the sales screen — they appear in this day&apos;s
            totals.
          </p>
          <Link
            to="/sales/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-secondary"
          >
            Record a sale
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      );
    case 7:
      return (
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold text-foreground">Payments</h2>
          <p className="text-sm text-muted-foreground">
            Payments are captured against the sale or customer balance they settle, so customer
            statements and cash-up stay accurate. Record them from the sales screen.
          </p>
          <Link
            to="/sales"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-secondary"
          >
            Go to sales
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      );
    default:
      return null;
  }
}
