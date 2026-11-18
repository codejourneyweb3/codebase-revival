import {
  AlertTriangle,
  ArrowRight,
  Bird,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  CloudUpload,
  Droplets,
  Feather,
  HeartPulse,
  Home,
  Scale,
  Sparkles,
  Wheat,
} from "lucide-react";
import { Link } from "@/lib/router-compat";
import { useData } from "@/lib/hooks";
import { today } from "@/lib/db";
import { useAuth } from "@/features/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { WELFARE_DIMENSIONS } from "@/features/kukuthrive/content";
import { EvidenceBadge, Metric, Panel, PreviewBadge, type Evidence } from "@/features/kukuthrive/ui";

import photo from "@/assets/kuku-poultry.asset.json";
const dimensionIcons = [Scale, Droplets, Feather, HeartPulse, Home];

export function Dashboard() {
  const { user } = useAuth();
  const data = useData(async (db) => {
    const [flocks, reports, alerts, pending, weights, feed, mortality] = await Promise.all([
      db.flocks.toArray(),
      db.reports.toArray(),
      db.alerts.filter((alert) => !alert.resolved).toArray(),
      db.outbox.count(),
      db.weightSamples.toArray(),
      db.feedUsage.toArray(),
      db.mortalityRecords.toArray(),
    ]);
    return { flocks, reports, alerts, pending, weights, feed, mortality };
  });
  const active = data?.flocks.filter((flock) => flock.status === "Active") ?? [];
  const broilers = active.filter((flock) => flock.type === "Broiler");
  const birds = active.reduce((sum, flock) => sum + flock.liveCount, 0);
  const reportsToday = data?.reports.filter((report) => report.date === today()) ?? [];
  const unread = data?.alerts.filter((alert) => !alert.read).length ?? 0;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const date = new Intl.DateTimeFormat("en-UG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  const dimensionEvidence: Record<string, { evidence: Evidence; detail: string }> = {
    growth: {
      evidence: data?.weights.length ? "Measured" : "Missing",
      detail: data?.weights.length
        ? `${data.weights.length} weighing sessions available`
        : "No weight samples recorded",
    },
    intake: {
      evidence: data?.feed.length ? "Measured" : "Missing",
      detail: data?.feed.length
        ? `${data.feed.length} feed records; refill checks still needed`
        : "No feed or refill records",
    },
    environment: { evidence: "Missing", detail: "No scored house checks yet" },
    health: {
      evidence: data?.mortality.length ? "Measured" : "Missing",
      detail: data?.mortality.length
        ? `${data.mortality.length} mortality records; health check needed`
        : "No health-check evidence",
    },
    housing: { evidence: "Missing", detail: "Add house, litter and equipment evidence" },
  };

  return (
    <div className="space-y-7">
      <section className="farm-banner" style={{backgroundImage:`url(${photo.url})`}}>
        <p className="mb-2 text-sm">{date} · {user?.name}</p>
        <h1>KukuThrive</h1>
        <p className="mt-2 text-sm">{greeting}. Let’s check the birds first.</p>
        <div className="mt-5 flex flex-wrap gap-3"><Button asChild><Link to="/daily"><ClipboardCheck/>Start today’s checks<ArrowRight/></Link></Button><Button asChild variant="secondary"><Link to="/flocks"><Bird/>Your flocks</Link></Button></div>
      </section>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Metric
          label="Active flocks"
          value={active.length}
          note={`${broilers.length} broiler ${broilers.length === 1 ? "flock" : "flocks"}`}
          icon={<Bird />}
        />
        <Metric
          label="Birds on farm"
          value={birds.toLocaleString()}
          note="Current recorded live population"
          icon={<Feather />}
        />
        <Metric
          label="Open alerts"
          value={unread}
          note={unread ? "Review evidence and next steps" : "No unread farm alerts"}
          icon={<AlertTriangle />}
          tone={unread ? "warn" : "good"}
        />
        <Metric
          label="Pending sync"
          value={data?.pending ?? 0}
          note="Local changes waiting to upload"
          icon={<CloudUpload />}
        />
      </div>

      <div>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-semibold">Welfare at a glance</h2>
              <PreviewBadge label="Evidence view" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              A summary stays unresolved until there is enough evidence — never green by default.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/welfare">
              Explore welfare intelligence
              <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {WELFARE_DIMENSIONS.map((dimension, index) => {
            const Icon = dimensionIcons[index];
            const evidence = dimensionEvidence[dimension.id];
            return (
              <Link
                key={dimension.id}
                to={dimension.to}
                className="group rounded-lg border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-secondary/40 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">
                    <Icon className="size-4" />
                  </span>
                  <EvidenceBadge evidence={evidence.evidence} />
                </div>
                <h3 className="mt-4 text-sm font-semibold">{dimension.name}</h3>
                <p className="mt-1 min-h-10 text-xs leading-5 text-muted-foreground">
                  {evidence.detail}
                </p>
                <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs">
                  <span className="font-medium text-muted-foreground">Not enough information</span>
                  <ArrowRight className="size-3.5 text-secondary transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <Panel
          title="Today’s priorities"
          description="A guided workflow for the next house visit."
          action={
            <Link to="/daily" className="text-xs font-semibold text-primary hover:underline">
              View all
            </Link>
          }
        >
          <div className="divide-y">
            <Priority
              icon={<HeartPulse />}
              title="Confirm mortality"
              description="Record deaths or explicitly confirm ‘no deaths today’."
              to="/daily"
            />
            <Priority
              icon={<Wheat />}
              title="Reconcile feed"
              description="Record feed issued, leftovers and any known wastage."
              to="/feed"
            />
            <Priority
              icon={<Droplets />}
              title="Check drinker refills"
              description="Include leftover water, spills and leaking drinkers."
              to="/water"
            />
            <Priority
              icon={<Feather />}
              title="Score the house"
              description="Heat, behaviour, air, ammonia, draughts and dust."
              to="/environment"
            />
          </div>
        </Panel>

        <Panel
          title="How intelligence will read the evidence"
          description="Example workflow only — this is not a live alert."
        >
          <div className="rounded-lg border border-warning/25 bg-warning/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.12em] text-warning">
                Example combined prompt
              </span>
              <PreviewBadge label="Illustration" />
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold">
              Check litter, drinkers and ventilation together
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              If ammonia smell rises to 3, litter becomes caked and feed intake falls, KukuThrive will
              connect those observations instead of raising unrelated alarms.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <EvidenceBadge evidence="Observed" />
              <EvidenceBadge evidence="Missing" />
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              No ppm reading in this example. The wording remains a prompt to check, not a
              diagnosis.
            </p>
          </div>
          <Button asChild variant="outline" className="mt-4 w-full">
            <Link to="/assistant">
              <Sparkles />
              Preview KukuThrive’s investigation assistant
            </Link>
          </Button>
        </Panel>
      </div>
    </div>
  );
}

function Priority({
  icon,
  title,
  description,
  to,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
}) {
  return (
    <Link to={to} className="group flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-secondary [&_svg]:size-4">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs leading-5 text-muted-foreground">{description}</span>
      </span>
      <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
    </Link>
  );
}
