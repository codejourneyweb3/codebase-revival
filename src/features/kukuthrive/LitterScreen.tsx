import { useState } from "react";
import { Camera, Layers3, Plus, Save, Shovel } from "lucide-react";
import {
  GuideDialog,
  ModuleHeader,
  Notice,
  Panel,
  PreviewFormDialog,
  ScoreInput,
  StubButton,
} from "./ui";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const spots = [
  { id: "drinkers", label: "Near or under drinkers" },
  { id: "wall", label: "Near a wall or corner" },
  { id: "middle", label: "Middle of the house" },
];

export function LitterScreen() {
  const [scores, setScores] = useState<Record<string, number | undefined>>({});
  const scored = spots
    .map((spot) => scores[spot.id])
    .filter((score): score is number => score !== undefined);
  const worst = scored.length ? Math.max(...scored) : undefined;
  const worstSpot = spots.find((spot) => scores[spot.id] === worst)?.label;
  return (
    <div>
      <ModuleHeader
        eyebrow="Litter management"
        title="Find the worst patch, not the average"
        description="Use the squeeze test in at least three places. The worst spot becomes the house score, and every corrective action gets a before-and-after check."
        actions={
          <>
            <GuideDialog guideId="litter" />
            <PreviewFormDialog
              feature="Litter activity"
              behavior="This will save the activity, reason, quantity, responsible person and post-action score so KukuThrive can show whether the intervention helped."
              trigger={
                <Button variant="outline">
                  <Shovel />
                  Record litter activity
                </Button>
              }
              title="Record a litter activity"
              description="Turning, removal, addition and replacement stay linked to the inspection."
              fields={[
                {
                  name: "activity",
                  label: "Activity",
                  type: "select",
                  options: [
                    "Turning or raking",
                    "Added new material",
                    "Removed wet sections",
                    "Partial replacement",
                    "Complete replacement",
                    "Disposal",
                  ],
                  required: true,
                },
                { name: "quantity", label: "Quantity, if known" },
                { name: "reason", label: "Reason", required: true },
                {
                  name: "after",
                  label: "Score after activity",
                  type: "select",
                  options: [
                    "1 — dry and crumbly",
                    "2 — slightly damp",
                    "3 — caked",
                    "4 — wet and compacted",
                  ],
                },
                { name: "notes", label: "Notes", type: "textarea", full: true },
              ]}
            />
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_310px]">
        <div className="space-y-5">
          {spots.map((spot) => (
            <Panel
              key={spot.id}
              title={spot.label}
              action={
                <GuideDialog
                  guideId="litter"
                  trigger={
                    <button type="button" className="text-xs font-semibold text-primary">
                      How do I judge this?
                    </button>
                  }
                />
              }
            >
              <ScoreInput
                scaleId="litter"
                label={spot.label}
                value={scores[spot.id]}
                onChange={(score) => setScores((current) => ({ ...current, [spot.id]: score }))}
              />
            </Panel>
          ))}
          <Panel
            title="Supporting observations"
            description="These observations help explain the score and guide the next inspection."
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Wet patches",
                "Wet under drinkers",
                "Caking",
                "Odour",
                "Visible mould",
                "Contamination",
                "Dirty breasts",
                "Dirty feet",
                "Bird eye irritation",
              ].map((item) => (
                <label
                  key={item}
                  className="flex min-h-11 items-center gap-3 rounded-lg border bg-background px-3 py-2 text-sm"
                >
                  <input type="checkbox" className="size-4 accent-[var(--primary)]" />
                  {item}
                </label>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="litter-note">Location and inspection note</Label>
              <textarea
                id="litter-note"
                className="min-h-24 w-full rounded-md border bg-background p-3 text-sm"
                placeholder="Describe the affected area and anything the birds are doing…"
              />
            </div>
            <StubButton
              feature="Litter photographs"
              behavior="This will attach photographs to the exact house location and inspection, store them offline and sync the files when connected."
              variant="outline"
              className="mt-3"
            >
              <Camera />
              Add photographs
            </StubButton>
          </Panel>
        </div>
        <div className="space-y-5">
          <Panel title="House result">
            <div
              className={`grid size-20 place-items-center rounded-full font-display text-4xl font-semibold ${worst && worst >= 3 ? "bg-warning/15 text-warning" : "bg-accent text-accent-foreground"}`}
            >
              {worst ?? "—"}
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold">
              {worst ? `Worst score: ${worst}` : "House not assessed"}
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {worst
                ? `From ${worstSpot?.toLowerCase()}. Scores are ranked, never averaged.`
                : "Score at least one location. Unscored locations remain missing."}
            </p>
            {worst && worst >= 3 && (
              <div className="mt-4">
                <Notice tone="warning" title="Investigate this patch">
                  Check drinker leaks first if this is the wettest area, then review humidity,
                  ventilation and stocking density.
                </Notice>
              </div>
            )}
            <StubButton
              feature="Litter inspection"
              behavior="This will save all three spot scores, keep the worst as the house result, record supporting observations and evaluate persistence and drinker-area rules."
              className="mt-5 w-full"
            >
              <Save />
              Preview save inspection
            </StubButton>
          </Panel>
          <Panel
            title="Initial litter setup"
            description="Material history remains available across flocks."
          >
            <PreviewFormDialog
              feature="Litter installation"
              behavior="This will save material, supplier, installation date, depth, quantity and initial moisture condition for the house."
              trigger={
                <Button variant="outline" className="w-full">
                  <Plus />
                  Preview litter setup
                </Button>
              }
              title="Set up house litter"
              description="A frontend preview; no house record will be changed."
              fields={[
                { name: "material", label: "Material type", required: true },
                { name: "supplier", label: "Supplier" },
                { name: "installed", label: "Installation date", type: "date" },
                { name: "depth", label: "Initial depth (cm)", type: "number" },
                { name: "quantity", label: "Initial quantity" },
                {
                  name: "condition",
                  label: "Initial condition",
                  type: "select",
                  options: [
                    "1 — dry and crumbly",
                    "2 — slightly damp",
                    "3 — caked",
                    "4 — wet and compacted",
                  ],
                },
              ]}
            />
          </Panel>
          <div className="rounded-lg border bg-muted p-4">
            <Layers3 className="size-5 text-secondary" />
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              A separate moisture-meter value can be stored with its instrument. It is never merged
              with this squeeze-test score.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
