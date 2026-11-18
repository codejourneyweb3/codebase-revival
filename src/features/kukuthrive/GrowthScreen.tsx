import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Plus, Scale, TrendingUp } from "lucide-react";
import { useData } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateDensity } from "./calculations";
import {
  EvidenceBadge,
  EmptyState,
  GuideDialog,
  Metric,
  ModuleHeader,
  Notice,
  Panel,
  PreviewFormDialog,
} from "./ui";

export function GrowthScreen() {
  const data = useData(async (db) => ({
    flocks: await db.flocks.filter((flock) => flock.type === "Broiler").toArray(),
    weights: await db.weightSamples.toArray(),
  }));
  const [selectedId, setSelectedId] = useState("");
  const broilers = data?.flocks ?? [];
  const flock =
    broilers.find((item) => item.id === selectedId) ??
    broilers.find((item) => item.status === "Active") ??
    broilers[0];
  const sessions = (data?.weights.filter((item) => item.flockId === flock?.id) ?? []).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  const latest = sessions.at(-1);
  const previous = sessions.at(-2);
  const elapsed =
    latest && previous
      ? Math.max(
          1,
          Math.round(
            (new Date(latest.date).getTime() - new Date(previous.date).getTime()) / 86400000,
          ),
        )
      : 0;
  const dailyGain =
    latest && previous && elapsed
      ? ((latest.averageWeightKg - previous.averageWeightKg) * 1000) / elapsed
      : undefined;
  const [area, setArea] = useState("400");
  const [population, setPopulation] = useState("0");
  const [weight, setWeight] = useState("0");
  const [target, setTarget] = useState("2");
  const [limit, setLimit] = useState("30");
  useEffect(() => {
    if (flock) setPopulation(String(flock.liveCount));
    if (flock?.targetWeightKg) setTarget(String(flock.targetWeightKg));
  }, [flock?.id, flock?.liveCount, flock?.targetWeightKg]);
  useEffect(() => {
    if (latest) setWeight(String(latest.averageWeightKg));
  }, [latest?.id, latest?.averageWeightKg]);
  const density = calculateDensity({
    usableAreaM2: Number(area),
    livePopulation: Number(population),
    averageWeightKg: Number(weight),
    targetWeightKg: Number(target),
    houseLimitKgM2: Number(limit),
  });

  return (
    <div>
      <ModuleHeader
        eyebrow="Growth & development"
        title="Every weight keeps its context"
        description="Review average gain and spread alongside sample size and measurement confidence. Handling observations remain separate from kilograms."
        actions={
          <>
            <GuideDialog guideId="weighing" />
            <PreviewFormDialog
              feature="Weighing session"
              behavior="This will store each original weight, sample location, scale and calibration status, then calculate average gain, CV and uniformity offline before syncing."
              trigger={
                <Button>
                  <Plus />
                  Record weighing
                </Button>
              }
              title="Guided weighing session"
              description="Preview the session fields; individual sample weights will be retained in the connected workflow."
              fields={[
                {
                  name: "flock",
                  label: "Broiler flock",
                  type: "select",
                  options: broilers.map((item) => item.name),
                  required: true,
                },
                { name: "date", label: "Weighing date", type: "date", required: true },
                { name: "sample", label: "Birds sampled", type: "number", required: true },
                { name: "location", label: "Sampling locations", required: true },
                { name: "scale", label: "Scale used", required: true },
                {
                  name: "calibration",
                  label: "Calibration",
                  type: "select",
                  options: ["Known and checked", "Uncalibrated", "Unknown"],
                },
                {
                  name: "weights",
                  label: "Individual weights, separated by commas (kg)",
                  type: "textarea",
                  full: true,
                  placeholder: "1.42, 1.55, 1.48…",
                },
              ]}
            />
          </>
        }
      />

      <div className="mb-5 flex flex-wrap items-end gap-3">
        <div className="space-y-2">
          <Label htmlFor="growth-flock">Flock</Label>
          <select
            id="growth-flock"
            value={flock?.id ?? ""}
            onChange={(event) => setSelectedId(event.target.value)}
            className="h-10 min-w-56 rounded-md border bg-card px-3 text-sm"
          >
            {broilers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        {latest && <EvidenceBadge evidence="Measured" />}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Latest average"
          value={latest ? `${latest.averageWeightKg.toFixed(2)} kg` : "—"}
          note={latest ? `${latest.sampled} birds sampled · ${latest.date}` : "No measured weights"}
          icon={<Scale />}
        />
        <Metric
          label="Daily gain"
          value={dailyGain !== undefined ? `${dailyGain.toFixed(1)} g/day` : "—"}
          note={
            dailyGain !== undefined
              ? `Across ${elapsed} elapsed days`
              : "Needs two weighing sessions"
          }
          icon={<TrendingUp />}
        />
        <Metric
          label="Sample spread"
          value={latest?.cvPercent ? `${latest.cvPercent}%` : "—"}
          note={
            latest
              ? `Existing CV/uniformity field · n=${latest.sampled}`
              : "No distribution available"
          }
        />
        <Metric
          label="Reference deviation"
          value="Not available"
          note="Select a reviewed breed and age reference curve"
        />
      </div>
      {latest && latest.sampled < 30 && (
        <div className="mt-4">
          <Notice tone="warning" title="Low-confidence sample">
            Only {latest.sampled} birds are represented. Small samples can swing widely, so avoid
            treating spread or average as the whole flock.
          </Notice>
        </div>
      )}

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_1fr]">
        <Panel
          title="Measured weight trend"
          description="Original sessions remain stored; no handling score is converted into weight."
        >
          {sessions.length ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={sessions.map((item) => ({ ...item, weight: item.averageWeightKg }))}
                >
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis
                    unit="kg"
                    domain={["auto", "auto"]}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                    }}
                    formatter={(value) => [`${Number(value).toFixed(2)} kg`, "Average"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    dot={{ fill: "var(--harvest)", strokeWidth: 0, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              icon={<Scale />}
              title="No weighing sessions for this flock"
              description="Use the guided session preview to see how representative weights, locations and scale details will be captured."
            />
          )}
        </Panel>

        <Panel
          title="No scale? Use handling scores"
          description="Body condition and breast fullness are useful observations, never estimated kilograms."
        >
          <div className="rounded-lg bg-muted p-4 text-sm leading-6 text-muted-foreground">
            Pick a small representative sample, handle each bird gently and record the share at each
            1–4 score. KukuThrive will show the distribution and its direction across sessions.
          </div>
          <PreviewFormDialog
            feature="Handling assessment"
            behavior="This will save body-condition and breast-fullness score distributions with the sample size, keeping them separate from measured weights."
            trigger={
              <Button variant="outline" className="mt-4">
                <Plus />
                Preview handling assessment
              </Button>
            }
            title="Handling assessment without a scale"
            description="Scores are observations and cannot be converted into kilograms."
            fields={[
              { name: "sample", label: "Birds handled", type: "number", required: true },
              { name: "location", label: "Sampling locations", required: true },
              {
                name: "body",
                label: "Body-condition distribution",
                type: "textarea",
                full: true,
                placeholder: "Score 1: 0 birds; score 2: 4; score 3: 2; score 4: 0",
              },
              {
                name: "breast",
                label: "Breast-fullness distribution",
                type: "textarea",
                full: true,
              },
            ]}
          />
        </Panel>
      </div>

      <Panel
        className="mt-5"
        title="Stocking-density planner"
        description="Editable frontend calculation using live kilograms per usable square metre."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <NumberField id="density-area" label="Usable area (m²)" value={area} onChange={setArea} />
          <NumberField
            id="density-population"
            label="Live population"
            value={population}
            onChange={setPopulation}
          />
          <NumberField
            id="density-weight"
            label="Average weight (kg)"
            value={weight}
            onChange={setWeight}
          />
          <NumberField
            id="density-target"
            label="Target weight (kg)"
            value={target}
            onChange={setTarget}
          />
          <NumberField
            id="density-limit"
            label="House limit (kg/m²)"
            value={limit}
            onChange={setLimit}
          />
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <DensityResult
            label="Current biomass"
            value={`${density.currentKgM2.toFixed(1)} kg/m²`}
          />
          <DensityResult label="Bird density" value={`${density.birdsM2.toFixed(2)} birds/m²`} />
          <DensityResult
            label="Limit used"
            value={`${density.utilizationPercent.toFixed(1)}%`}
            warn={density.utilizationPercent >= 90}
          />
          <DensityResult
            label="Projected final"
            value={`${density.projectedKgM2.toFixed(1)} kg/m²`}
            warn={density.projectedKgM2 > Number(limit)}
          />
          <DensityResult
            label="Placement ceiling"
            value={`${Math.floor(density.maximumPlacement).toLocaleString()} birds`}
          />
        </div>
        <div className="mt-4">
          <Notice tone="warning" title="Reference pending professional review">
            The default 30 kg/m² naturally ventilated house limit comes from the Cobb guide starting
            values in your specification. It is not a Ugandan legal limit. A placement ceiling is
            not a recommendation to fill the house.
          </Notice>
        </div>
      </Panel>
    </div>
  );
}

function NumberField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        min="0"
        step="any"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
function DensityResult({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className={`rounded-lg p-3 ${warn ? "bg-warning/10" : "bg-muted"}`}>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className={`num mt-1 font-display text-lg font-semibold ${warn ? "text-warning" : ""}`}>
        {value}
      </div>
    </div>
  );
}
