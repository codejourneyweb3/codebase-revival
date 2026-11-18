import { useState } from "react";
import { Calculator, Droplets, Plus, Save, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateWater } from "./calculations";
import {
  EmptyState,
  GuideDialog,
  Metric,
  ModuleHeader,
  Notice,
  Panel,
  PreviewFormDialog,
  StubButton,
} from "./ui";

export function WaterScreen() {
  const [drinkers, setDrinkers] = useState("20");
  const [capacity, setCapacity] = useState("10");
  const [fills, setFills] = useState("3");
  const [leftover, setLeftover] = useState("20");
  const [spilled, setSpilled] = useState("5");
  const [population, setPopulation] = useState("500");
  const [feed, setFeed] = useState("40");
  const result = calculateWater({
    drinkers: Number(drinkers),
    capacityLitres: Number(capacity),
    fills: Number(fills),
    leftoverLitres: Number(leftover),
    spilledLitres: Number(spilled),
  });
  const perBird = Number(population) > 0 ? (result.consumedLitres * 1000) / Number(population) : 0;
  const ratio = Number(feed) > 0 ? result.consumedLitres / Number(feed) : 0;
  return (
    <div>
      <ModuleHeader
        eyebrow="Water management"
        title="Refills, not imaginary meter readings"
        description="Calculate what birds had access to from registered drinkers, fills, leftovers and known spills. Reliability falls when those details are missing."
        actions={
          <>
            <GuideDialog guideId="water" />
            <PreviewFormDialog
              feature="Drinker register"
              behavior="This will save drinker type, identical count, capacity and house location for use in refill calculations and equipment-capacity checks."
              trigger={
                <Button>
                  <Plus />
                  Register drinkers
                </Button>
              }
              title="Register a drinker group"
              description="Capacity is set once and reused for every refill."
              fields={[
                {
                  name: "type",
                  label: "Drinker type",
                  type: "select",
                  options: ["Bell", "Cup", "Trough", "Bucket", "Nipple line"],
                  required: true,
                },
                {
                  name: "count",
                  label: "Number of identical drinkers",
                  type: "number",
                  required: true,
                },
                {
                  name: "capacity",
                  label: "Capacity of one (litres)",
                  type: "number",
                  required: true,
                },
                { name: "location", label: "Location in house", required: true },
              ]}
            />
          </>
        }
      />

      <Notice title="Calculated estimate, not a metered reading">
        Water placed = drinkers × capacity × fills. Water consumed = water placed − leftovers −
        known spillage. If leftovers are not recorded, the result is an upper bound and must be
        labelled “at most”.
      </Notice>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel
          title="Refill calculator"
          description="Editable worked example. Registering real drinker groups will replace these preview values."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <NumberField
              id="water-drinking"
              label="Identical drinkers"
              value={drinkers}
              set={setDrinkers}
            />
            <NumberField
              id="water-capacity"
              label="Capacity each (L)"
              value={capacity}
              set={setCapacity}
            />
            <NumberField id="water-fills" label="Number of fills" value={fills} set={setFills} />
            <NumberField
              id="water-leftover"
              label="Water left over (L)"
              value={leftover}
              set={setLeftover}
            />
            <NumberField
              id="water-spilled"
              label="Known spillage (L)"
              value={spilled}
              set={setSpilled}
            />
            <NumberField
              id="water-population"
              label="Average live birds"
              value={population}
              set={setPopulation}
            />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Result label="Water placed" value={`${result.placedLitres.toFixed(1)} L`} />
            <Result label="Estimated consumed" value={`${result.consumedLitres.toFixed(1)} L`} />
            <Result label="Per live bird" value={`${perBird.toFixed(0)} ml`} />
          </div>
          <div className="mt-4 flex items-end gap-3 border-t pt-4">
            <div className="flex-1">
              <NumberField
                id="water-feed"
                label="Feed consumed in same period (kg)"
                value={feed}
                set={setFeed}
              />
            </div>
            <div className="rounded-lg bg-accent px-4 py-3">
              <div className="text-[11px] font-semibold uppercase text-muted-foreground">
                Water-to-feed
              </div>
              <div className="num font-display text-xl font-semibold text-accent-foreground">
                {ratio.toFixed(2)} : 1
              </div>
            </div>
          </div>
          <StubButton
            feature="Drinker refill log"
            behavior="This will save the drinker group, fills, leftovers, spillage, house, flock, observer and event time, then update the estimated intake trend offline."
            className="mt-5"
          >
            <Save />
            Preview save refill
          </StubButton>
        </Panel>

        <div className="space-y-5">
          <Metric
            label="Evidence confidence"
            value="Moderate"
            note="This example includes leftovers and known spillage"
            icon={<Calculator />}
          />
          <Panel
            title="Drinker problems"
            description="Failures change how water figures should be read."
          >
            <div className="grid gap-2">
              {[
                "Leaks",
                "Spillage",
                "Blockages",
                "Empty drinkers",
                "Contamination",
                "Out of bird reach",
              ].map((problem) => (
                <label
                  key={problem}
                  className="flex items-center gap-3 rounded-lg border p-3 text-sm"
                >
                  <input type="checkbox" className="size-4 accent-[var(--primary)]" />
                  {problem}
                </label>
              ))}
            </div>
            <StubButton
              feature="Drinker condition report"
              behavior="This will link the equipment fault to the house, reduce confidence in affected water figures and surface the issue in daily work and alerts."
              variant="outline"
              className="mt-3 w-full"
            >
              <ShieldAlert />
              Report a problem
            </StubButton>
          </Panel>
          <Panel
            title="Optional water quality"
            description="Attach tested values or a simple visual check."
          >
            <PreviewFormDialog
              feature="Water-quality record"
              behavior="This will store tested pH, conductivity, solids, microbial or disinfectant results separately from visual clarity, smell and contamination observations."
              trigger={
                <Button variant="outline" className="w-full">
                  <Plus />
                  Add quality observation
                </Button>
              }
              title="Water-quality observation"
              description="Laboratory values and visual checks remain distinct."
              fields={[
                {
                  name: "method",
                  label: "Method",
                  type: "select",
                  options: ["Visual and smell check", "Test strip or meter", "Laboratory result"],
                },
                {
                  name: "clarity",
                  label: "Appearance",
                  type: "select",
                  options: ["Clear", "Cloudy", "Visible contamination"],
                },
                { name: "ph", label: "pH, if tested", type: "number" },
                { name: "tds", label: "Total dissolved solids, if tested" },
                {
                  name: "notes",
                  label: "Smell, contamination or test details",
                  type: "textarea",
                  full: true,
                },
              ]}
            />
          </Panel>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel title="Drinker register">
          <EmptyState
            icon={<Droplets />}
            title="No new drinker groups registered"
            description="Your existing equipment records remain available. New water-specific groups will appear here once the server workflow is connected."
          />
        </Panel>
        <Panel title="Refill history">
          <EmptyState
            icon={<Droplets />}
            title="No refill-log entries yet"
            description="Use the calculator to preview the exact formula. Saving is intentionally a stub in this frontend-only iteration."
          />
        </Panel>
      </div>
    </div>
  );
}

function NumberField({
  id,
  label,
  value,
  set,
}: {
  id: string;
  label: string;
  value: string;
  set: (value: string) => void;
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
        onChange={(event) => set(event.target.value)}
      />
    </div>
  );
}
function Result({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="num mt-1 font-display text-xl font-semibold">{value}</div>
    </div>
  );
}
