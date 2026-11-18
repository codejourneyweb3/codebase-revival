import {
  ArrowRight,
  CalendarClock,
  Check,
  ChevronRight,
  ClipboardList,
  Droplets,
  Feather,
  HeartPulse,
  Plus,
  Wheat,
} from "lucide-react";
import { Link } from "@/lib/router-compat";
import { useData } from "@/lib/hooks";
import { today } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { ModuleHeader, Notice, Panel, PreviewFormDialog, StubButton } from "./ui";

export function DailyOperations() {
  const data = useData(async (db) => ({
    flocks: await db.flocks.filter((flock) => flock.status === "Active").toArray(),
    reports: await db.reports.where("date").equals(today()).toArray(),
    vaccinations: await db.vaccinations
      .filter((vaccination) => !vaccination.done)
      .sortBy("dueDate"),
  }));
  const broilerReports =
    data?.reports.filter(
      (report) => data.flocks.find((flock) => flock.id === report.flockId)?.type === "Broiler",
    ) ?? [];
  const hasMortality = broilerReports.some((report) => report.deaths !== undefined);
  const hasFeed = broilerReports.some((report) => report.feedGivenKg !== undefined);
  const hasWater = broilerReports.some((report) => report.waterL !== undefined);

  return (
    <div>
      <ModuleHeader
        eyebrow="Daily workflow"
        title="One calm check at a time"
        description="Move through the house in a sensible order. Skip what you cannot assess, record what you can, and never let a missing check masquerade as a normal result."
        actions={
          <Button asChild size="lg">
            <Link to="/daily/report">
              <ClipboardList />
              Open full daily report
            </Link>
          </Button>
        }
      />

      <Notice title="Your existing daily report still works">
        The full report saves to your offline farm records and sync queue. The new checks below are
        frontend previews until their server workflows are connected.
      </Notice>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
        <Panel
          title="House visit checklist"
          description={`${broilerReports.length} broiler ${broilerReports.length === 1 ? "report" : "reports"} recorded today`}
        >
          <div className="space-y-3">
            <Task
              number="01"
              icon={<HeartPulse />}
              title="Birds, deaths and culls"
              description="Count deaths, record culls separately, or explicitly confirm no deaths today."
              complete={hasMortality}
              action={
                <Link
                  to="/daily/report"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
                >
                  Record
                  <ArrowRight className="size-3.5" />
                </Link>
              }
            />
            <Task
              number="02"
              icon={<Wheat />}
              title="Feed issued and remaining"
              description="Use the farm’s units, convert once, and keep leftovers and wastage visible."
              complete={hasFeed}
              action={
                <Link
                  to="/feed"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
                >
                  Review
                  <ArrowRight className="size-3.5" />
                </Link>
              }
            />
            <Task
              number="03"
              icon={<Droplets />}
              title="Drinkers and refill estimate"
              description="Check every group for access, leaks and blockage before interpreting intake."
              complete={hasWater}
              action={
                <Link
                  to="/water"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
                >
                  Calculate
                  <ArrowRight className="size-3.5" />
                </Link>
              }
            />
            <Task
              number="04"
              icon={<Feather />}
              title="Sensory house check"
              description="Score heat, bird distribution, air, ammonia, draughts and dust at bird height."
              complete={false}
              action={
                <Link
                  to="/environment"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
                >
                  Start scores
                  <ArrowRight className="size-3.5" />
                </Link>
              }
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
            <StubButton
              feature="No deaths today"
              behavior="This will store an explicit zero for the selected flock and date, distinguish it from a missed day, and reconcile the population."
              variant="outline"
            >
              <Check />
              No deaths today
            </StubButton>
            <PreviewFormDialog
              feature="Quick house note"
              behavior="This will attach your note, event time, entry time, house and flock to the visit and sync it offline-first."
              trigger={
                <Button variant="ghost">
                  <Plus />
                  Quick note
                </Button>
              }
              title="Add a house-visit note"
              description="Notes can be backdated; KukuThrive will keep both event and entry times."
              fields={[
                {
                  name: "flock",
                  label: "Flock",
                  type: "select",
                  options: data?.flocks.map((flock) => flock.name) ?? [],
                  required: true,
                },
                {
                  name: "time",
                  label: "Observation date",
                  type: "date",
                  required: true,
                  defaultValue: today(),
                },
                {
                  name: "note",
                  label: "What did you notice?",
                  type: "textarea",
                  full: true,
                  required: true,
                },
              ]}
              submitLabel="Preview note"
            />
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel
            title="Schedule watch"
            description="User and veterinarian-created schedules appear here."
          >
            {data?.vaccinations.length ? (
              <div className="space-y-3">
                {data.vaccinations.slice(0, 4).map((vaccination) => {
                  const flock = data.flocks.find((item) => item.id === vaccination.flockId);
                  const overdue = vaccination.dueDate < today();
                  return (
                    <Link
                      to="/vaccination"
                      key={vaccination.id}
                      className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50"
                    >
                      <CalendarClock
                        className={`size-4 ${overdue ? "text-destructive" : "text-warning"}`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold">{vaccination.vaccine}</div>
                        <div className="text-xs text-muted-foreground">
                          {flock?.name ?? "Previous flock"} · {vaccination.dueDate}
                        </div>
                      </div>
                      <span
                        className={`text-xs font-semibold ${overdue ? "text-destructive" : "text-warning"}`}
                      >
                        {overdue ? "Late" : "Upcoming"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="py-4 text-sm text-muted-foreground">
                No open vaccination items. KukuThrive never supplies a schedule of its own.
              </p>
            )}
            <Button asChild variant="outline" size="sm" className="mt-4 w-full">
              <Link to="/vaccination">
                Review schedules
                <ChevronRight />
              </Link>
            </Button>
          </Panel>
          <Panel title="The minimum useful day" description="Guidance, not an enforced rule.">
            <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
              <li className="flex gap-2">
                <Check className="mt-1 size-4 shrink-0 text-success" />
                Mortality, or an explicit no-deaths entry
              </li>
              <li className="flex gap-2">
                <Check className="mt-1 size-4 shrink-0 text-success" />
                Feed issued and any leftover information
              </li>
              <li className="flex gap-2">
                <Check className="mt-1 size-4 shrink-0 text-success" />
                Drinker refills and equipment problems
              </li>
              <li className="flex gap-2">
                <Check className="mt-1 size-4 shrink-0 text-success" />
                One structured sensory observation
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Task({
  number,
  icon,
  title,
  description,
  complete,
  action,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  complete: boolean;
  action: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border bg-background p-4 sm:items-center">
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-lg ${complete ? "bg-success/10 text-success" : "bg-accent text-accent-foreground"}`}
      >
        {complete ? <Check className="size-5" /> : icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold tracking-widest text-muted-foreground">
            {number}
          </span>
          <h3 className="text-sm font-semibold">{title}</h3>
          {complete && <span className="text-xs font-medium text-success">Recorded</span>}
        </div>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}
