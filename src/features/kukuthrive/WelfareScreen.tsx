import { useState } from "react";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Beaker,
  Eye,
  FileQuestion,
  HeartPulse,
  Home,
  Plus,
  Scale,
  Sparkles,
  Wind,
} from "lucide-react";
import { Link } from "@/lib/router-compat";
import { useData } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { WELFARE_DIMENSIONS } from "./content";
import {
  EmptyState,
  EvidenceBadge,
  ModuleHeader,
  Notice,
  Panel,
  PreviewFormDialog,
  StubButton,
} from "./ui";

const icons = {
  growth: Scale,
  intake: Activity,
  environment: Wind,
  health: HeartPulse,
  housing: Home,
};

export function WelfareScreen() {
  const [tab, setTab] = useState<"dimensions" | "alerts" | "interventions">("dimensions");
  const data = useData(async (db) => ({
    weights: await db.weightSamples.count(),
    feed: await db.feedUsage.count(),
    mortality: await db.mortalityRecords.count(),
    reports: await db.reports.count(),
  }));
  return (
    <div>
      <ModuleHeader
        eyebrow="Animal welfare intelligence"
        title="Evidence before conclusions"
        description="Five connected views of flock welfare. Each keeps its supporting evidence, missing inputs and uncertainty visible; none is an average of unrelated scores."
        actions={
          <Button asChild>
            <Link to="/environment">
              <Plus />
              Record house check
            </Link>
          </Button>
        }
      />

      <div className="mb-5 flex w-fit rounded-lg border bg-muted p-1">
        {(["dimensions", "alerts", "interventions"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`rounded-md px-4 py-2 text-sm font-medium capitalize ${tab === item ? "bg-card shadow-sm" : "text-muted-foreground"}`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "dimensions" && (
        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {WELFARE_DIMENSIONS.map((dimension) => {
              const Icon = icons[dimension.id];
              const count =
                dimension.id === "growth"
                  ? data?.weights
                  : dimension.id === "intake"
                    ? data?.feed
                    : dimension.id === "health"
                      ? data?.mortality
                      : 0;
              return (
                <Link
                  to={dimension.to}
                  key={dimension.id}
                  className="rounded-lg border bg-card p-5 transition-colors hover:border-secondary/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="size-5" />
                    </span>
                    <EvidenceBadge evidence={count ? "Measured" : "Missing"} />
                  </div>
                  <h2 className="mt-4 font-display text-base font-semibold">{dimension.name}</h2>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    {dimension.description}
                  </p>
                  <div className="mt-4 rounded-lg bg-muted p-3">
                    <div className="text-xs font-semibold">Not enough information</div>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {count
                        ? `${count} operational records available; scored welfare evidence is still needed.`
                        : "No direct evidence recorded for this dimension."}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
          <Panel
            title="Evidence quality"
            description="The interface distinguishes where every input came from."
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <EvidenceCard
                icon={<Beaker />}
                title="Measured"
                text="Instrument readings with their method and location."
              />
              <EvidenceCard
                icon={<Eye />}
                title="Observed"
                text="Structured sensory, behavioural and physical scores."
              />
              <EvidenceCard
                icon={<FileQuestion />}
                title="Inferred"
                text="Clearly labelled estimates derived from other records."
              />
              <EvidenceCard
                icon={<BadgeCheck />}
                title="Missing"
                text="No evidence. It is not zero, normal or a welfare alarm."
              />
            </div>
          </Panel>
          <Notice title="Scores stay ordinal">
            KukuThrive compares direction, persistence and agreement across visits. It never averages a
            1–4 score as though every step were equal.
          </Notice>
        </div>
      )}

      {tab === "alerts" && (
        <div className="space-y-5">
          <Notice title="No live deterministic welfare alerts yet">
            The rule engine is server-dependent. The card below is a labelled illustration of the
            intended investigation workflow, not a statement about your birds.
          </Notice>
          <Panel
            title="Example: combined environmental prompt"
            description="Illustrative scores only · observed evidence · no instrument reading"
          >
            <div className="rounded-lg border-l-4 border-warning bg-warning/5 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-warning/15 px-2.5 py-1 text-xs font-bold text-warning">
                  Investigation prompt
                </span>
                <EvidenceBadge evidence="Observed" />
                <span className="text-xs text-muted-foreground">
                  Example House A · example visit
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">
                Check whether wet litter and reduced air exchange are occurring together
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Example evidence: ammonia smell 3, litter feel 3, feed intake 3 across the same
                visit. This combination would raise priority while keeping the observed-only
                evidence level visible.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <MiniScore label="Ammonia" score="3 · noticeable" />
                <MiniScore label="Litter" score="3 · caked" />
                <MiniScore label="Feed intake" score="3 · clearly lower" />
              </div>
              <div className="mt-5 rounded-lg bg-card p-4">
                <h4 className="text-sm font-semibold">Suggested investigation</h4>
                <ol className="mt-2 list-inside list-decimal space-y-1 text-sm leading-6 text-muted-foreground">
                  <li>Check under drinkers for leaks and wet patches.</li>
                  <li>Review ventilation at bird height and other house locations.</li>
                  <li>Re-score after corrective action and record the outcome.</li>
                </ol>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <StubButton
                  feature="Alert acknowledgement"
                  behavior="This will store who acknowledged the alert, preserve its evidence and schedule the next responsible-person escalation if needed."
                >
                  Acknowledge example
                </StubButton>
                <PreviewFormDialog
                  feature="Intervention record"
                  behavior="This will link the action to the alert, capture before-and-after evidence and schedule a reassessment."
                  trigger={
                    <Button variant="outline">
                      <Plus />
                      Record intervention
                    </Button>
                  }
                  title="Preview an intervention"
                  description="Record what was done without treating the example as a live alert."
                  fields={[
                    { name: "action", label: "Action taken", required: true },
                    { name: "person", label: "Responsible person", required: true },
                    {
                      name: "notes",
                      label: "Reason and observations",
                      type: "textarea",
                      full: true,
                    },
                  ]}
                />
              </div>
            </div>
          </Panel>
        </div>
      )}

      {tab === "interventions" && (
        <Panel
          title="Intervention outcomes"
          description="Compare evidence before and after each action; improvement after an action does not by itself prove causation."
        >
          <EmptyState
            icon={<Activity />}
            title="No interventions to review"
            description="When an alert leads to action, KukuThrive will preserve the original problem, responsible person, measurements before and after, outcome and any additional action."
            action={
              <PreviewFormDialog
                feature="Intervention tracking"
                behavior="This will save the action and its before/after measurements, then show whether conditions improved, stayed the same or worsened."
                trigger={
                  <Button>
                    <Plus />
                    Preview intervention form
                  </Button>
                }
                title="Record an intervention"
                description="A frontend form preview; no record will be created."
                fields={[
                  { name: "problem", label: "Original problem", required: true },
                  { name: "action", label: "Action performed", required: true },
                  { name: "person", label: "Responsible person", required: true },
                  { name: "reassess", label: "Reassessment date", type: "date" },
                  { name: "before", label: "Evidence before action", type: "textarea", full: true },
                  { name: "after", label: "Evidence after action", type: "textarea", full: true },
                ]}
              />
            }
          />
        </Panel>
      )}

      <div className="mt-5 rounded-lg border bg-sidebar p-5 text-sidebar-foreground sm:flex sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 font-display font-semibold">
            <Sparkles className="size-4 text-sidebar-primary" />
            Need help investigating?
          </div>
          <p className="mt-1 text-sm text-sidebar-foreground/70">
            Preview how AI will explain validated evidence without diagnosing or overriding
            deterministic alerts.
          </p>
        </div>
        <Button
          asChild
          className="mt-4 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 sm:mt-0"
        >
          <Link to="/assistant">
            Open assistant preview
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function EvidenceCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-lg bg-background p-4">
      <span className="text-secondary [&_svg]:size-5">{icon}</span>
      <h3 className="mt-3 text-sm font-semibold">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
    </div>
  );
}
function MiniScore({ label, score }: { label: string; score: string }) {
  return (
    <div className="rounded-lg bg-card p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold">{score}</div>
    </div>
  );
}
