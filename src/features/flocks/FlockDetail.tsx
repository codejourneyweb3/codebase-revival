import { ArrowLeft, Bird, HeartPulse, Plus, Scale, Wheat } from "lucide-react";
import { Link, useParams } from "@/lib/router-compat";
import { useData } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  Metric,
  ModuleHeader,
  Notice,
  Panel,
  PreviewFormDialog,
} from "@/features/kukuthrive/ui";

export function FlockDetail() {
  const { id } = useParams<{ id: string }>();
  const data = useData(
    async (db) => ({
      flock: await db.flocks.get(id),
      weights: await db.weightSamples.where("flockId").equals(id).sortBy("date"),
      mortality: await db.mortalityRecords.where("flockId").equals(id).sortBy("date"),
      feed: await db.feedUsage.where("flockId").equals(id).sortBy("date"),
      reports: await db.reports.where("flockId").equals(id).sortBy("date"),
    }),
    [id],
  );
  const flock = data?.flock;
  if (data && !flock)
    return (
      <EmptyState
        title="Flock not found"
        description="This flock may have been removed or is not available on this device."
        action={
          <Button asChild>
            <Link to="/flocks">Back to flocks</Link>
          </Button>
        }
      />
    );
  if (!flock)
    return <div className="py-16 text-center text-sm text-muted-foreground">Loading flock…</div>;
  const age = Math.max(
    0,
    Math.floor((Date.now() - new Date(flock.dateReceived).getTime()) / 86400000),
  );
  const latestWeight = data.weights.at(-1);
  const deaths = data.mortality.reduce((sum, record) => sum + record.count, 0);
  const feed = data.feed.reduce((sum, record) => sum + record.quantityKg, 0);
  return (
    <div>
      <Link
        to="/flocks"
        className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All flocks
      </Link>
      <ModuleHeader
        eyebrow={`${flock.type} production cycle`}
        title={flock.name}
        description={`${flock.breed} · ${flock.supplier} · placed ${flock.dateReceived}`}
        preview={false}
        actions={
          <PreviewFormDialog
            feature="Flock population event"
            behavior="This will record the distinct mortality, cull, transfer, sale or thinning event and reconcile live population and density without rewriting history."
            trigger={
              <Button>
                <Plus />
                Record population event
              </Button>
            }
            title="Record a population event"
            description="Different event types keep their operational meaning."
            fields={[
              {
                name: "type",
                label: "Event type",
                type: "select",
                options: [
                  "Deaths",
                  "Cull",
                  "Transfer in",
                  "Transfer out",
                  "Sale",
                  "Thinning",
                  "Consumed or given away",
                ],
                required: true,
              },
              { name: "count", label: "Number of birds", type: "number", required: true },
              { name: "date", label: "Event date", type: "date", required: true },
              { name: "reason", label: "Reason or suspected cause" },
              { name: "notes", label: "Observations beforehand", type: "textarea", full: true },
            ]}
          />
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Current population"
          value={flock.liveCount.toLocaleString()}
          note={`${flock.initialCount.toLocaleString()} chicks placed`}
          icon={<Bird />}
        />
        <Metric label="Age" value={`${age} days`} note={flock.status} />
        <Metric
          label="Latest average weight"
          value={latestWeight ? `${latestWeight.averageWeightKg.toFixed(2)} kg` : "—"}
          note={
            latestWeight
              ? `${latestWeight.sampled} birds · ${latestWeight.date}`
              : "No weight session"
          }
          icon={<Scale />}
        />
        <Metric
          label="Recorded deaths"
          value={deaths}
          note="Culls and sales remain separate"
          icon={<HeartPulse />}
        />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <Panel
          title="Feed issued"
          description="Existing records; not confirmed eaten without leftovers."
        >
          <div className="num font-display text-3xl font-semibold">{feed.toLocaleString()} kg</div>
          <p className="mt-2 text-sm text-muted-foreground">{data.feed.length} feed entries</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/feed">
              <Wheat />
              Open feed ledger
            </Link>
          </Button>
        </Panel>
        <Panel
          title="Growth and density"
          description="Measured weights and usable house area belong together."
        >
          <div className="num font-display text-3xl font-semibold">
            {latestWeight ? `${latestWeight.averageWeightKg.toFixed(2)} kg` : "Missing"}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {flock.targetWeightKg
              ? `Target ${flock.targetWeightKg} kg`
              : "No target depletion weight"}
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/growth">
              <Scale />
              Open growth workspace
            </Link>
          </Button>
        </Panel>
        <Panel title="Daily record coverage" description="Missing days are not counted as zero.">
          <div className="num font-display text-3xl font-semibold">{data.reports.length}</div>
          <p className="mt-2 text-sm text-muted-foreground">daily reports for this flock</p>
          <Button asChild variant="outline" className="mt-4">
            <Link to="/daily/report">Open daily report</Link>
          </Button>
        </Panel>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Panel title="Recent weight sessions">
          <div className="space-y-2">
            {[...data.weights]
              .reverse()
              .slice(-8)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-background p-3 text-sm"
                >
                  <span>{item.date}</span>
                  <span className="text-muted-foreground">n={item.sampled}</span>
                  <span className="num font-semibold">{item.averageWeightKg.toFixed(2)} kg</span>
                </div>
              ))}
            {!data.weights.length && (
              <p className="text-sm text-muted-foreground">No measured weights.</p>
            )}
          </div>
        </Panel>
        <Panel title="Recent mortality records">
          <div className="space-y-2">
            {[...data.mortality]
              .reverse()
              .slice(-8)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-background p-3 text-sm"
                >
                  <span>{item.date}</span>
                  <span className="text-muted-foreground">
                    {item.suspectedCause || "Cause unknown"}
                  </span>
                  <span className="num font-semibold">{item.count}</span>
                </div>
              ))}
            {!data.mortality.length && (
              <p className="text-sm text-muted-foreground">No mortality entries.</p>
            )}
          </div>
        </Panel>
      </div>
      <div className="mt-4">
        <Notice title="Historical records stay intact">
          Closing or selling this flock must not erase its health, environment, density or financial
          history. Important measurements and treatment changes will require a reason and an audit
          trail.
        </Notice>
      </div>
    </div>
  );
}
