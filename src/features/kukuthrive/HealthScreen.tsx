import { useState } from "react";
import {
  Activity,
  ArrowRight,
  HeartPulse,
  Plus,
  Save,
  ShieldAlert,
  Stethoscope,
} from "lucide-react";
import { Link } from "@/lib/router-compat";
import { useData } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  EmptyState,
  GuideDialog,
  ModuleHeader,
  Notice,
  Panel,
  PreviewFormDialog,
  ScoreInput,
  StubButton,
} from "./ui";

const tabs = [
  "Daily health check",
  "Health events",
  "Mortality & culls",
  "Physical welfare",
] as const;
const signs = [
  "Respiratory signs",
  "Abnormal droppings",
  "Lethargy or weakness",
  "Lameness or unusual movement",
  "Injuries",
  "Dehydration",
  "Nervous signs",
  "Sudden behaviour change",
];

export function HealthScreen() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Daily health check");
  const [noneSeen, setNoneSeen] = useState<boolean | undefined>();
  const [severity, setSeverity] = useState<number | undefined>();
  const data = useData(async (db) => ({
    flocks: await db.flocks.filter((flock) => flock.status === "Active").toArray(),
    mortality: await db.mortalityRecords.orderBy("date").reverse().toArray(),
  }));
  return (
    <div>
      <ModuleHeader
        eyebrow="Health & veterinary management"
        title="Notice early. Link what happens next."
        description="Daily signs, health events, deaths, culls and treatment outcomes stay connected. KukuThrive prompts investigation and veterinary help; it never diagnoses from observations or photographs."
        actions={
          <>
            <GuideDialog guideId="health" />
            <Button asChild variant="outline">
              <Link to="/vaccination">
                Vaccination & schedules
                <ArrowRight />
              </Link>
            </Button>
          </>
        }
      />
      <div className="mb-5 flex gap-1 overflow-x-auto border-b">
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

      {tab === "Daily health check" && (
        <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <Panel
              title="Are any birds showing signs of illness today?"
              description="‘None seen’ is a real recorded answer. A blank day means nobody checked."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setNoneSeen(true)}
                  className={`min-h-20 rounded-lg border p-4 text-left ${noneSeen === true ? "border-success bg-success/10" : "bg-background"}`}
                >
                  <span className="font-semibold">None seen</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    Record a completed quiet check
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setNoneSeen(false)}
                  className={`min-h-20 rounded-lg border p-4 text-left ${noneSeen === false ? "border-warning bg-warning/10" : "bg-background"}`}
                >
                  <span className="font-semibold">Yes, signs observed</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    Select signs and estimate affected birds
                  </span>
                </button>
              </div>
              {noneSeen === false && (
                <div className="mt-5 space-y-5">
                  <div className="grid gap-2 sm:grid-cols-2">
                    {signs.map((sign) => (
                      <label
                        key={sign}
                        className="flex min-h-11 items-center gap-3 rounded-lg border bg-background px-3 py-2 text-sm"
                      >
                        <input type="checkbox" className="size-4 accent-[var(--primary)]" />
                        {sign}
                      </label>
                    ))}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="affected">Approximately how many birds?</Label>
                      <Input id="affected" type="number" min="0" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="health-location">Where in the house?</Label>
                      <Input id="health-location" placeholder="e.g. near the eastern drinkers" />
                    </div>
                  </div>
                  <ScoreInput scaleId="health-severity" value={severity} onChange={setSeverity} />
                  <div className="space-y-2">
                    <Label htmlFor="health-note">Short note or useful observation</Label>
                    <textarea
                      id="health-note"
                      className="min-h-24 w-full rounded-md border bg-background p-3 text-sm"
                    />
                  </div>
                </div>
              )}
              {noneSeen !== undefined && (
                <StubButton
                  feature="Daily health check"
                  behavior="This will save the explicit result, signs, affected count, location, severity, observer and event time, then link any new or existing health event and queue follow-up."
                  className="mt-5"
                >
                  <Save />
                  Preview save health check
                </StubButton>
              )}
            </Panel>
          </div>
          <div className="space-y-5">
            <Notice tone="warning" title="When to seek veterinary help">
              High severity, sharply rising deaths, several signs together, nervous signs or serious
              widespread illness should prompt professional help. Do not wait for an AI
              interpretation.
            </Notice>
            <Panel
              title="Health event follow-up"
              description="Group related observations instead of losing the sequence."
            >
              <PreviewFormDialog
                feature="Health event"
                behavior="This will create or update a health event, link observations, photographs, veterinary findings, treatment and mortality, and track whether signs resolve or worsen."
                trigger={
                  <Button variant="outline" className="w-full">
                    <Plus />
                    Start health event
                  </Button>
                }
                title="Start a health event"
                description="Record a concern without assigning a diagnosis."
                fields={[
                  {
                    name: "flock",
                    label: "Flock",
                    type: "select",
                    options: data?.flocks.map((flock) => flock.name) ?? [],
                    required: true,
                  },
                  { name: "firstSeen", label: "First noticed", type: "date", required: true },
                  { name: "affected", label: "Birds affected initially", type: "number" },
                  { name: "assessment", label: "Veterinary assessment, if any" },
                  {
                    name: "observations",
                    label: "Observed signs and sequence",
                    type: "textarea",
                    full: true,
                  },
                ]}
              />
            </Panel>
            <StubButton
              feature="Health photograph"
              behavior="This will attach the image to the health event as supporting evidence. It will not be used to generate a disease diagnosis."
              variant="outline"
              className="w-full"
            >
              <Plus />
              Attach photograph
            </StubButton>
          </div>
        </div>
      )}

      {tab === "Health events" && (
        <Panel title="Open and resolved health events">
          <EmptyState
            icon={<Stethoscope />}
            title="No health events in the new workflow"
            description="Existing daily observations remain in your offline records. New health events will gather signs over time, veterinary assessments, treatments and outcomes here."
            action={
              <StubButton
                feature="Health event history"
                behavior="This will load health events with their signs, severity, affected counts, treatments and resolution timeline."
              >
                Preview event history
              </StubButton>
            }
          />
        </Panel>
      )}

      {tab === "Mortality & culls" && (
        <div className="space-y-5">
          <Notice title="A missing day is not zero">
            Only an explicit ‘no deaths today’ entry counts as zero. Mortality, illness culls, sales
            and transfers remain separate.
          </Notice>
          <Panel
            title="Recorded mortality"
            description={`${data?.mortality.length ?? 0} existing entries across all flocks`}
            action={
              <Button asChild size="sm">
                <Link to="/daily/report">
                  <Plus />
                  Record mortality
                </Link>
              </Button>
            }
          >
            <div className="space-y-2">
              {data?.mortality.slice(0, 40).map((record) => {
                const flock = data.flocks.find((item) => item.id === record.flockId);
                return (
                  <div
                    key={record.id}
                    className="grid gap-2 rounded-lg border p-3 text-sm sm:grid-cols-[110px_1fr_1fr_auto]"
                  >
                    <span className="text-muted-foreground">{record.date}</span>
                    <span className="font-medium">{flock?.name ?? "Closed or previous flock"}</span>
                    <span className="text-muted-foreground">
                      {record.suspectedCause || "Unknown cause"}
                    </span>
                    <span className="num font-semibold">{record.count} deaths</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex gap-2">
              <PreviewFormDialog
                feature="Illness cull"
                behavior="This will record the cull separately from mortality, retain its reason and reconcile the flock population."
                trigger={<Button variant="outline">Record illness cull</Button>}
                title="Record an illness cull"
                description="Culls have a different operational meaning from deaths."
                fields={[
                  {
                    name: "flock",
                    label: "Flock",
                    type: "select",
                    options: data?.flocks.map((flock) => flock.name) ?? [],
                    required: true,
                  },
                  { name: "count", label: "Birds culled", type: "number", required: true },
                  { name: "reason", label: "Reason", required: true },
                  {
                    name: "observations",
                    label: "Signs seen beforehand",
                    type: "textarea",
                    full: true,
                  },
                ]}
              />
            </div>
          </Panel>
        </div>
      )}

      {tab === "Physical welfare" && (
        <div className="space-y-5">
          <Panel
            title="Sampled physical welfare"
            description="Enter the number of sampled birds at each score. Do not replace the distribution with an average."
            action={
              <GuideDialog
                guideId="physical-welfare"
                trigger={
                  <Button variant="outline" size="sm">
                    Open sampling guide
                  </Button>
                }
              />
            }
          >
            <div className="mb-4 grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="physical-sample">Sample size</Label>
                <Input id="physical-sample" type="number" min="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="physical-flock">Flock</Label>
                <select
                  id="physical-flock"
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                >
                  {data?.flocks.map((flock) => (
                    <option key={flock.id}>{flock.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="physical-date">Assessment date</Label>
                <Input id="physical-date" type="date" />
              </div>
            </div>
            <div className="space-y-4">
              <Distribution title="Footpad condition" />
              <Distribution title="Hock condition" />
              <Distribution title="Feather condition and cleanliness" />
              <Distribution title="Gait" />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="blisters">Breast blisters (count)</Label>
                <Input id="blisters" type="number" min="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wounds">Wounds (count)</Label>
                <Input id="wounds" type="number" min="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lame">Lame birds (count)</Label>
                <Input id="lame" type="number" min="0" />
              </div>
            </div>
            <StubButton
              feature="Physical welfare assessment"
              behavior="This will save score distributions and counts with the sample size, show prevalence per score, and link severe individual cases to health events."
              className="mt-5"
            >
              <Save />
              Preview save assessment
            </StubButton>
          </Panel>
          <Notice title="Severe birds remain visible">
            Even if most of a sample is unaffected, severe individual lesions, wounds or lameness
            keep their own record and follow-up.
          </Notice>
        </div>
      )}
    </div>
  );
}

function Distribution({ title }: { title: string }) {
  return (
    <fieldset className="rounded-lg border p-4">
      <legend className="px-1 text-sm font-semibold">{title}</legend>
      <div className="grid grid-cols-4 gap-2">
        {[1, 2, 3, 4].map((score) => (
          <label key={score} className="space-y-1 text-center text-xs text-muted-foreground">
            Score {score}
            <Input type="number" min="0" aria-label={`${title} score ${score} count`} />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
