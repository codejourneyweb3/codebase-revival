import { useState } from "react";
import {
  CalendarClock,
  Check,
  ClipboardCheck,
  Plus,
  Save,
  ShieldCheck,
  Syringe,
} from "lucide-react";
import { Link } from "@/lib/router-compat";
import { useData } from "@/lib/hooks";
import { today } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { EmptyState, ModuleHeader, Notice, Panel, PreviewFormDialog, StubButton } from "./ui";

const tabs = [
  "Flock schedule",
  "Administration",
  "Procedure checklist",
  "Schedule templates",
] as const;
const checklist = [
  "Vaccine arrived cold and has been kept cold",
  "Batch checked and within expiry",
  "Correct diluent used and vaccine prepared as instructed",
  "Preparation-to-use time checked against the label",
  "Drinking-water preparation and disinfectant residues considered",
  "Route, dose and number vaccinated recorded",
  "Post-vaccination reactions and behaviour review arranged",
];

export function VaccinationScreen() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Flock schedule");
  const data = useData(async (db) => ({
    vaccinations: (await db.vaccinations.toArray()).sort((a, b) =>
      a.dueDate.localeCompare(b.dueDate),
    ),
    flocks: await db.flocks.toArray(),
  }));
  const options = data?.flocks.map((flock) => flock.name) ?? [];
  return (
    <div>
      <ModuleHeader
        eyebrow="Vaccination & medication"
        title="Your schedule. Your veterinarian’s judgement."
        description="KukuThrive ships with no default vaccine programme or doses. Users and veterinarians create versioned schedules, then every administration keeps its own checklist and coverage record."
        actions={
          <PreviewFormDialog
            feature="Vaccine administration"
            behavior="This will save product, batch, expiry, scheduled and actual dates, route, dosage, treated and missed birds, storage, instructions and the procedure checklist."
            trigger={
              <Button>
                <Plus />
                Record administration
              </Button>
            }
            title="Record vaccination or treatment"
            description="Preview the administration record; no medical recommendation is supplied."
            fields={[
              { name: "flock", label: "Flock", type: "select", options, required: true },
              { name: "product", label: "Vaccine or treatment name", required: true },
              { name: "target", label: "Target disease" },
              { name: "batch", label: "Manufacturer and batch" },
              { name: "expiry", label: "Expiry date", type: "date" },
              { name: "scheduled", label: "Scheduled date", type: "date" },
              { name: "actual", label: "Actual administration date", type: "date" },
              {
                name: "route",
                label: "Route",
                type: "select",
                options: [
                  "Drinking water",
                  "Spray",
                  "Eye drop",
                  "Injection",
                  "Other veterinarian-directed route",
                ],
              },
              { name: "dose", label: "Dosage from veterinary instructions" },
              { name: "treated", label: "Birds treated", type: "number" },
              { name: "missed", label: "Birds missed", type: "number" },
              {
                name: "missedReason",
                label: "Reason birds were missed",
                type: "textarea",
                full: true,
              },
              {
                name: "storage",
                label: "Storage and transport conditions",
                type: "textarea",
                full: true,
              },
            ]}
          />
        }
      />
      <Notice title="Schedules are farm-owned content">
        No schedule or dose is supplied by KukuThrive. Templates start empty, changes create new
        versions, and existing flock schedules are never rewritten.
      </Notice>
      <div className="my-5 flex gap-1 overflow-x-auto border-b">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium ${tab === item ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "Flock schedule" && (
        <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <Panel
            title="Existing vaccination items"
            description="Scheduled, due, administered, late and missed states remain distinct."
          >
            <div className="space-y-3">
              {data?.vaccinations.map((item) => {
                const flock = data.flocks.find((f) => f.id === item.flockId);
                const late = !item.done && item.dueDate < today();
                const due = !item.done && item.dueDate === today();
                return (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center gap-3 rounded-lg border p-4"
                  >
                    <span
                      className={`grid size-10 place-items-center rounded-lg ${item.done ? "bg-success/10 text-success" : late ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}
                    >
                      {item.done ? (
                        <Check className="size-5" />
                      ) : (
                        <CalendarClock className="size-5" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold">{item.vaccine}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {flock?.name ?? "Previous flock"} · scheduled {item.dueDate}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold ${item.done ? "text-success" : late ? "text-destructive" : due ? "text-warning" : "text-muted-foreground"}`}
                    >
                      {item.done ? "Administered" : late ? "Late" : due ? "Due today" : "Scheduled"}
                    </span>
                  </div>
                );
              })}
            </div>
          </Panel>
          <div className="space-y-5">
            <Panel title="Coverage matters">
              <p className="text-sm leading-6 text-muted-foreground">
                Birds missed at administration are the unprotected group. Drinking-water doses also
                need the refill and intake record reviewed because uneven drinking affects coverage.
              </p>
            </Panel>
            <Button asChild variant="outline" className="w-full">
              <Link to="/medication">Medication & withdrawal periods</Link>
            </Button>
          </div>
        </div>
      )}

      {tab === "Administration" && (
        <Panel title="Administration history">
          <EmptyState
            icon={<Syringe />}
            title="No detailed administration records yet"
            description="The new workflow will store scheduled and actual dates separately, making late doses visible, and link reactions or mortality in the following days."
            action={
              <StubButton
                feature="Administration history"
                behavior="This will load detailed vaccination and treatment events with batch, route, dose, coverage, missed birds and follow-up outcomes."
              >
                Preview administration history
              </StubButton>
            }
          />
        </Panel>
      )}

      {tab === "Procedure checklist" && (
        <Panel
          title="Guided procedure checklist"
          description="Every step can be skipped, but a skipped step is stored explicitly as skipped."
          action={<ClipboardCheck className="size-5 text-secondary" />}
        >
          <div className="space-y-3">
            {checklist.map((item, index) => (
              <div
                key={item}
                className="grid gap-3 rounded-lg border p-4 sm:grid-cols-[auto_1fr_180px] sm:items-center"
              >
                <span className="grid size-7 place-items-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  {index + 1}
                </span>
                <span className="text-sm leading-6">{item}</span>
                <select
                  aria-label={`Checklist step ${index + 1}`}
                  className="h-10 rounded-md border bg-background px-3 text-sm"
                >
                  <option value="">Not answered</option>
                  <option>Confirmed</option>
                  <option>Skipped — record reason</option>
                  <option>Not applicable</option>
                </select>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <label htmlFor="checklist-note" className="text-sm font-medium">
              Skipped-step reasons and procedure notes
            </label>
            <textarea
              id="checklist-note"
              className="min-h-24 w-full rounded-md border bg-background p-3 text-sm"
            />
          </div>
          <StubButton
            feature="Vaccination procedure checklist"
            behavior="This will store every confirmed, skipped and not-applicable answer with reasons and link the checklist to the administration event."
            className="mt-4"
          >
            <Save />
            Preview save checklist
          </StubButton>
        </Panel>
      )}

      {tab === "Schedule templates" && (
        <Panel
          title="Farm-owned schedule library"
          description="Empty by design until a farmer or veterinarian creates a schedule."
        >
          <EmptyState
            icon={<ShieldCheck />}
            title="No vaccination schedule templates"
            description="Create a named template with vaccine or treatment, target disease, age or event offset, route, tolerance window and veterinary notes. Applying it copies a version to the flock."
            action={
              <PreviewFormDialog
                feature="Vaccination schedule template"
                behavior="This will create version one of a farm-owned template, record its creator and veterinary approver, and allow an editable copy to be applied to a flock."
                trigger={
                  <Button>
                    <Plus />
                    Create schedule template
                  </Button>
                }
                title="Create a farm-owned schedule"
                description="KukuThrive does not suggest a vaccine programme or dosage."
                fields={[
                  { name: "name", label: "Template name", required: true },
                  { name: "creator", label: "Created by", required: true },
                  { name: "approver", label: "Veterinary approver, if applicable" },
                  { name: "item", label: "Vaccine or treatment item", required: true },
                  { name: "target", label: "Target disease" },
                  { name: "due", label: "Age in days or event offset" },
                  { name: "route", label: "Route from veterinary instructions" },
                  { name: "window", label: "Tolerance window (days)", type: "number" },
                  { name: "notes", label: "Veterinary notes", type: "textarea", full: true },
                ]}
              />
            }
          />
        </Panel>
      )}
    </div>
  );
}
