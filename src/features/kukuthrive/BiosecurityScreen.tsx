import { useState } from "react";
import { Check, ClipboardCheck, Plus, Save, ShieldCheck, Sparkles } from "lucide-react";
import { useData } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { ModuleHeader, Notice, Panel, PreviewFormDialog, StubButton } from "./ui";

const recurring = [
  "Footbath or boot cleaning point changed and in use",
  "Tools and equipment cleaned",
  "Visitors limited and any visit recorded",
  "Vehicles kept away or disinfected",
  "Dead birds removed and disposed of properly",
  "Rodent and pest checks completed",
  "Handwashing and clean working clothes or boots",
];
const cleanout = [
  "Remove birds, feed and used litter",
  "Clean the house and equipment",
  "Disinfect",
  "Treat drinkers and feeders",
  "Rest the empty house",
  "Fresh litter laid and checked",
  "Ready for next placement",
];

export function BiosecurityScreen() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [cleaned, setCleaned] = useState<Record<string, boolean>>({});
  const visits = useData((db) => db.visits.orderBy("date").reverse().limit(6).toArray()) ?? [];
  const complete = recurring.filter((item) => checked[item]).length;
  const cleanComplete = cleanout.filter((item) => cleaned[item]).length;
  return (
    <div>
      <ModuleHeader
        eyebrow="Biosecurity & hygiene"
        title="Small routines, visible history"
        description="Recurring tasks stay quick enough for a real farm day. Every completion or skipped item keeps its date, person and reason."
        actions={
          <PreviewFormDialog
            feature="Biosecurity checklist item"
            behavior="This will add a farm-owned recurring item with daily, weekly or custom frequency and include it in daily work and overdue reminders."
            trigger={
              <Button variant="outline">
                <Plus />
                Add checklist item
              </Button>
            }
            title="Add a recurring checklist item"
            description="Farm-owned checklists can be changed without altering history."
            fields={[
              { name: "item", label: "Checklist item", required: true },
              {
                name: "frequency",
                label: "Frequency",
                type: "select",
                options: ["Daily", "Weekly", "Custom interval"],
              },
              { name: "interval", label: "Custom interval (days)", type: "number" },
              { name: "guide", label: "Short task guide", type: "textarea", full: true },
            ]}
          />
        }
      />
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel
          title="Recurring farm checklist"
          description={`${complete} of ${recurring.length} ticked in this unsaved preview`}
        >
          <div className="space-y-2">
            {recurring.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg border bg-background p-3"
              >
                <button
                  type="button"
                  aria-label={`Toggle ${item}`}
                  aria-pressed={!!checked[item]}
                  onClick={() => setChecked((current) => ({ ...current, [item]: !current[item] }))}
                  className={`grid size-7 shrink-0 place-items-center rounded-md border ${checked[item] ? "border-success bg-success text-primary-foreground" : "bg-card"}`}
                >
                  {checked[item] && <Check className="size-4" />}
                </button>
                <span className="flex-1 text-sm leading-5">{item}</span>
                <PreviewFormDialog
                  feature="Skipped biosecurity task"
                  behavior="This will store the skipped state and reason instead of silently treating the task as complete."
                  trigger={
                    <button
                      type="button"
                      className="text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      Skip
                    </button>
                  }
                  title="Skip with a reason"
                  description={item}
                  fields={[
                    {
                      name: "reason",
                      label: "Reason for skipping",
                      type: "textarea",
                      full: true,
                      required: true,
                    },
                  ]}
                  submitLabel="Preview skip"
                />
              </div>
            ))}
          </div>
          <StubButton
            feature="Biosecurity checklist"
            behavior="This will save each tick or explicit skip with the date and responsible person, update overdue tasks and preserve completion history."
            className="mt-4"
          >
            <Save />
            Preview save checklist
          </StubButton>
        </Panel>
        <Panel
          title="Between-flock cleanout"
          description={`${cleanComplete} of ${cleanout.length} steps ticked · rest period and next placement stay linked`}
        >
          <div className="space-y-2">
            {cleanout.map((item, index) => (
              <button
                key={item}
                type="button"
                onClick={() => setCleaned((current) => ({ ...current, [item]: !current[item] }))}
                className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left ${cleaned[item] ? "border-success/30 bg-success/5" : "bg-background"}`}
              >
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${cleaned[item] ? "bg-success text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {cleaned[item] ? <Check className="size-4" /> : index + 1}
                </span>
                <span className="text-sm">{item}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="text-xs font-medium text-muted-foreground">
              House empty date
              <input
                type="date"
                className="mt-1 h-10 w-full rounded-md border bg-background px-2 text-sm"
              />
            </label>
            <label className="text-xs font-medium text-muted-foreground">
              Next placement
              <input
                type="date"
                className="mt-1 h-10 w-full rounded-md border bg-background px-2 text-sm"
              />
            </label>
          </div>
          <StubButton
            feature="House cleanout"
            behavior="This will save the checklist, calculate actual rest days, warn before a short planned turnaround and preserve the house history."
            className="mt-4"
          >
            <Sparkles />
            Preview save cleanout
          </StubButton>
        </Panel>
      </div>
      <div className="mt-4">
        <Notice tone="warning" title="Downtime reference">
          The Cobb starting guidance in your specification calls for at least 12 days between flocks
          for litter quality. This is a breeder-guide reference pending professional review, not a
          universal legal rule.
        </Notice>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel title="Recent visitor records" description="Existing farm biosecurity records.">
          <div className="space-y-2">
            {visits.map((visit) => (
              <div key={visit.id} className="rounded-lg border p-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="font-semibold">{visit.visitor}</span>
                  <span className={visit.disinfected ? "text-success" : "text-warning"}>
                    {visit.disinfected ? "Disinfected" : "Review"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {visit.date} · {visit.purpose} · {visit.vehicle || "No vehicle recorded"}
                </p>
              </div>
            ))}
            {!visits.length && <p className="text-sm text-muted-foreground">No visits recorded.</p>}
          </div>
        </Panel>
        <Panel
          title="Completion history"
          description="See which routines slip and review biosecurity after a health event."
        >
          <div className="flex h-full min-h-40 flex-col items-center justify-center text-center">
            <ClipboardCheck className="size-8 text-muted-foreground" />
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
              No new checklist completions yet. Saving remains a stub until the server workflow is
              connected.
            </p>
            <StubButton
              feature="Biosecurity history"
              behavior="This will load recurring and cleanout history beside health events and overdue routines."
              variant="outline"
              className="mt-4"
            >
              <ShieldCheck />
              Preview history
            </StubButton>
          </div>
        </Panel>
      </div>
    </div>
  );
}
