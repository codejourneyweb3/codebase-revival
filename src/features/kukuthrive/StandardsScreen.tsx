import { useState } from "react";
import { History, Pencil, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SCORE_SCALES } from "./content";
import { NUMERIC_STANDARDS, THRESHOLD_KINDS } from "./standards";
import { EmptyState, ModuleHeader, Notice, Panel, PreviewFormDialog, StubButton } from "./ui";

const TABS = ["Numeric standards", "Scale standards", "Farm overrides"] as const;

function ReviewBadge() {
  return (
    <span className="inline-flex whitespace-nowrap rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[11px] font-semibold text-warning">
      Pending review
    </span>
  );
}

export function StandardsScreen() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Numeric standards");
  const groups = Array.from(new Set(NUMERIC_STANDARDS.map((s) => s.group)));
  return (
    <div>
      <ModuleHeader
        eyebrow="Reference standards & thresholds"
        title="No arbitrary universal limits"
        description="Every value carries its breed, stage, source, version and review status. Seeded values stay pending until a poultry or veterinary professional approves them for your strain, climate and housing."
        actions={
          <>
            <StubButton
              variant="outline"
              feature="Import breed schedule"
              behavior="This will import the full age-based table (for example temperature by day) from the current guide for the flock's strain, rather than typing it in by hand."
            >
              <Upload />
              Import breed table
            </StubButton>
            <StubButton
              feature="Professional review"
              behavior="This will let an approved poultry or veterinary professional mark standards as reviewed for this farm's breed, climate and housing, recording who approved them and when."
            >
              Request review
            </StubButton>
          </>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {THRESHOLD_KINDS.map((k, i) => (
          <div key={k.name} className="rounded-lg border bg-card p-4">
            <div
              className={cn(
                "h-1 w-10 rounded-full",
                i === 0 && "bg-success",
                i === 1 && "bg-primary",
                i === 2 && "bg-warning",
                i === 3 && "bg-destructive",
              )}
            />
            <div className="mt-3 text-sm font-semibold">{k.name}</div>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{k.text}</p>
          </div>
        ))}
      </div>

      <div className="mb-5 flex w-fit flex-wrap rounded-lg border bg-muted p-1">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium",
              tab === item ? "bg-card shadow-sm" : "text-muted-foreground",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "Numeric standards" && (
        <div className="space-y-5">
          {groups.map((group) => (
            <Panel key={group} title={group} contentClassName="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="bg-muted/60 text-left text-xs uppercase tracking-[0.08em] text-muted-foreground">
                    <tr>
                      <th className="px-5 py-2.5">Parameter</th>
                      <th className="px-3 py-2.5">Reference</th>
                      <th className="px-3 py-2.5">Stage</th>
                      <th className="px-3 py-2.5">Source</th>
                      <th className="px-3 py-2.5">Status</th>
                      <th className="px-5 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {NUMERIC_STANDARDS.filter((s) => s.group === group).map((s) => (
                      <tr key={s.parameter} className="border-t">
                        <td className="px-5 py-3 font-medium">{s.parameter}</td>
                        <td className="num px-3 py-3">{s.reference}</td>
                        <td className="px-3 py-3 text-muted-foreground">{s.stage}</td>
                        <td className="px-3 py-3 text-muted-foreground">{s.source}</td>
                        <td className="px-3 py-3">
                          <ReviewBadge />
                        </td>
                        <td className="px-5 py-3 text-right">
                          <StubButton
                            size="sm"
                            variant="ghost"
                            feature="Standard history"
                            behavior={`This will show every version of “${s.parameter}”, with effective dates, sources and who reviewed each one.`}
                          >
                            <History className="size-4" />
                          </StubButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          ))}
          <Notice title="Guide values, not regulations">
            These are breeder-guide reference values. They are not Ugandan regulatory limits and not
            diagnoses.
          </Notice>
        </div>
      )}

      {tab === "Scale standards" && (
        <div className="grid gap-4 lg:grid-cols-2">
          {SCORE_SCALES.map((scale) => (
            <Panel
              key={scale.id}
              title={scale.name}
              description="Version 1 · seeded · prompt at 3 or above · act now at 4 · persistence = 2 visits"
              action={<ReviewBadge />}
            >
              <ol className="space-y-1.5">
                {scale.descriptions.map((d, i) => (
                  <li key={d} className="flex gap-3 text-sm">
                    <span
                      className={cn(
                        "grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold",
                        i < 2
                          ? "bg-muted text-muted-foreground"
                          : i === 2
                            ? "bg-warning/15 text-warning"
                            : "bg-destructive/10 text-destructive",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="leading-6">{d}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-4">
                <PreviewFormDialog
                  feature="Trigger level override"
                  behavior={`This will save a farm-level override for “${scale.name}”, logged with who changed it and why. The seeded original stays visible and historical scores keep the version they were recorded under.`}
                  trigger={
                    <Button size="sm" variant="outline">
                      <Pencil />
                      Override for my farm
                    </Button>
                  }
                  title={`Override “${scale.name}”`}
                  description="Overrides are logged and never replace the seeded original."
                  fields={[
                    {
                      name: "prompt",
                      label: "Prompt at score",
                      type: "select",
                      options: ["2", "3", "4"],
                      defaultValue: "3",
                    },
                    {
                      name: "act",
                      label: "Act now at score",
                      type: "select",
                      options: ["3", "4"],
                      defaultValue: "4",
                    },
                    {
                      name: "persist",
                      label: "Visits that count as persistence",
                      type: "number",
                      defaultValue: "2",
                    },
                    {
                      name: "reason",
                      label: "Reason for the change",
                      type: "textarea",
                      required: true,
                      full: true,
                    },
                  ]}
                />
              </div>
            </Panel>
          ))}
        </div>
      )}

      {tab === "Farm overrides" && (
        <Panel
          title="Farm-owned changes"
          description="Every override records who made it, why, and the original value."
        >
          <EmptyState
            icon={<Plus />}
            title="No overrides yet"
            description="Farm-owned content starts empty and is never overwritten by platform updates. Overrides you make to seeded trigger levels or numeric values will be listed here."
            action={
              <StubButton
                feature="Add override"
                behavior="This will let you override a seeded value for this farm, recording the reason and approver, while keeping the original visible."
              >
                Add an override
              </StubButton>
            }
          />
        </Panel>
      )}
    </div>
  );
}
