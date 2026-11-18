import { useState } from "react";
import { CloudSun, Save, Thermometer, Wind } from "lucide-react";
import { useData } from "@/lib/hooks";
import { today } from "@/lib/db";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  EvidenceBadge,
  GuideDialog,
  ModuleHeader,
  Notice,
  Panel,
  ScoreInput,
  StubButton,
} from "./ui";

const scores = [
  { id: "heat", title: "Heat at bird height" },
  { id: "temperature-behaviour", title: "Bird behaviour for temperature" },
  { id: "air", title: "Air and humidity" },
  { id: "ammonia", title: "Ammonia smell" },
  { id: "draughts", title: "Draughts" },
  { id: "dust", title: "Dust" },
];

export function EnvironmentScreen() {
  const flocks =
    useData((db) =>
      db.flocks.filter((flock) => flock.status === "Active" && flock.type === "Broiler").toArray(),
    ) ?? [];
  const [values, setValues] = useState<Record<string, number | undefined>>({});
  const assessed = scores.filter((score) => values[score.id] !== undefined).length;
  return (
    <div>
      <ModuleHeader
        eyebrow="Environmental monitoring"
        title="Score the house at bird height"
        description="Your senses are valid evidence. Use the same descriptions every visit, add instrument readings only when available, and leave unassessed items blank."
        actions={<GuideDialog guideId="ammonia" />}
      />
      <div className="grid gap-5 xl:grid-cols-[1fr_300px]">
        <div className="space-y-5">
          <Panel
            title="Visit context"
            description="Conditions vary within a house, so every score keeps its location and observer."
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="environment-flock">Flock</Label>
                <select
                  id="environment-flock"
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  <option value="">Select flock…</option>
                  {flocks.map((flock) => (
                    <option key={flock.id}>{flock.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="environment-date">Observation date</Label>
                <Input id="environment-date" type="date" defaultValue={today()} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="environment-time">Time</Label>
                <Input id="environment-time" type="time" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="environment-location">Location in house</Label>
                <select
                  id="environment-location"
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  <option>Mid-house</option>
                  <option>Near brooder</option>
                  <option>Near drinkers</option>
                  <option>Near fans or inlet</option>
                  <option>Wall or corner</option>
                </select>
              </div>
            </div>
          </Panel>

          {scores.map((score) => (
            <Panel
              key={score.id}
              title={score.title}
              action={
                score.id === "ammonia" ? (
                  <GuideDialog
                    guideId="ammonia"
                    trigger={
                      <button
                        type="button"
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        How do I judge this?
                      </button>
                    }
                  />
                ) : (
                  <span className="text-xs text-muted-foreground">1 ideal · 4 worst</span>
                )
              }
            >
              <ScoreInput
                scaleId={score.id}
                value={values[score.id]}
                onChange={(value) => setValues((current) => ({ ...current, [score.id]: value }))}
                label={score.title}
              />
            </Panel>
          ))}

          <Panel
            title="Optional instrument readings"
            description="Stored beside scores, never used to replace or erase them."
          >
            <details className="group">
              <summary className="cursor-pointer text-sm font-semibold text-primary">
                Add numeric readings if you have an instrument
              </summary>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Numeric id="temperature" label="Temperature (°C)" />
                <Numeric id="humidity" label="Relative humidity (%)" />
                <Numeric id="ammonia-ppm" label="Ammonia (ppm)" />
                <Numeric id="co2" label="Carbon dioxide (ppm)" />
                <Numeric id="co" label="Carbon monoxide (ppm)" />
                <Numeric id="light" label="Light intensity (lux)" />
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="instrument">Instrument and method</Label>
                  <Input id="instrument" placeholder="e.g. borrowed handheld meter" />
                </div>
              </div>
            </details>
          </Panel>
        </div>

        <div className="space-y-5">
          <div className="sticky top-20 space-y-5">
            <Panel title="Visit summary">
              <div className="grid size-16 place-items-center rounded-full bg-accent font-display text-2xl font-semibold text-accent-foreground">
                {assessed}/6
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {assessed ? `${assessed} scored parameters selected.` : "No scores selected yet."}{" "}
                Unselected parameters remain missing, not zero.
              </p>
              <div className="mt-4 flex gap-2">
                <EvidenceBadge evidence="Observed" />
                <EvidenceBadge evidence="Missing" />
              </div>
              <StubButton
                feature="Environmental observation"
                behavior="This will save each score with flock, house location, event time, observer and scale version, evaluate local trend rules, and queue the visit for sync."
                className="mt-5 w-full"
                size="lg"
              >
                <Save />
                Preview save check
              </StubButton>
            </Panel>
            <Notice title="Observations are not diagnoses">
              A 3 or 4 is a prompt to investigate. Odour is never converted to ppm, and scores are
              never averaged as though their intervals were equal.
            </Notice>
            <div className="rounded-lg border bg-sidebar p-5 text-sidebar-foreground">
              <CloudSun className="size-6 text-sidebar-primary" />
              <h3 className="mt-3 font-display font-semibold">Check more than the doorway</h3>
              <p className="mt-2 text-xs leading-5 text-sidebar-foreground/70">
                Pause at bird height in several locations. Revisit during extreme weather or
                whenever bird behaviour changes.
              </p>
              <div className="mt-4 flex gap-4 text-sidebar-primary">
                <Thermometer className="size-5" />
                <Wind className="size-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Numeric({ id, label }: { id: string; label: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type="number" min="0" step="any" />
    </div>
  );
}
