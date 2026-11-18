import { useState } from "react";
import { ArrowRight, Bird, CalendarDays, Plus } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { useData } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Metric, ModuleHeader, Notice, Panel, PreviewFormDialog } from "@/features/kukuthrive/ui";

export function FlocksList() {
  const flocks = useData((db) => db.flocks.orderBy("dateReceived").reverse().toArray()) ?? [];
  const [filter, setFilter] = useState("Active");
  const visible = flocks.filter(
    (flock) =>
      filter === "All" ||
      (filter === "Broilers" ? flock.type === "Broiler" : flock.status === filter),
  );
  const active = flocks.filter((flock) => flock.status === "Active");
  return (
    <div>
      <ModuleHeader
        eyebrow="Production cycles"
        title="Every flock keeps its own history"
        description="Placement, population changes, weights, health, environment, costs and sales stay attached to one production cycle — including after closure."
        preview={false}
        actions={
          <PreviewFormDialog
            feature="Flock registration"
            behavior="This will create the production cycle, copy a user-selected vaccination schedule if one exists, and begin its population and density history."
            trigger={
              <Button>
                <Plus />
                Register flock
              </Button>
            }
            title="Register a broiler flock"
            description="Preview placement and arrival information. No flock will be created in this iteration."
            fields={[
              { name: "name", label: "Flock ID or name", required: true },
              { name: "house", label: "Farm and house", required: true },
              { name: "breed", label: "Breed and strain", required: true },
              { name: "supplier", label: "Supplier or hatchery" },
              { name: "placement", label: "Placement date", type: "date", required: true },
              { name: "delivery", label: "Delivery date", type: "date" },
              { name: "received", label: "Chicks received", type: "number", required: true },
              { name: "placed", label: "Chicks placed", type: "number", required: true },
              { name: "weight", label: "Initial average weight (g)", type: "number" },
              { name: "target", label: "Target depletion weight (kg)", type: "number" },
              {
                name: "condition",
                label: "Chick condition on arrival",
                type: "textarea",
                full: true,
              },
              {
                name: "vaccination",
                label: "Initial vaccination information",
                type: "textarea",
                full: true,
              },
              { name: "personnel", label: "Responsible personnel" },
            ]}
          />
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric
          label="Active flocks"
          value={active.length}
          note={`${active.filter((f) => f.type === "Broiler").length} broiler cycles`}
          icon={<Bird />}
        />
        <Metric
          label="Live birds"
          value={active.reduce((sum, flock) => sum + flock.liveCount, 0).toLocaleString()}
          note="Reconciled existing records"
        />
        <Metric
          label="Closed cycles"
          value={flocks.filter((flock) => flock.status === "Closed").length}
          note="History remains accessible"
          icon={<CalendarDays />}
        />
      </div>

      <div className="my-5 flex flex-wrap gap-2">
        {["Active", "Broilers", "Closed", "All"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${filter === item ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}
          >
            {item}
          </button>
        ))}
      </div>

      <Panel
        title={`${visible.length} ${visible.length === 1 ? "flock" : "flocks"}`}
        contentClassName="p-0"
      >
        <div className="divide-y">
          {visible.map((flock) => {
            const age = Math.max(
              0,
              Math.floor((Date.now() - new Date(flock.dateReceived).getTime()) / 86400000),
            );
            const loss = flock.initialCount - flock.liveCount;
            return (
              <Link
                key={flock.id}
                to={`/flocks/${flock.id}`}
                className="group grid gap-4 p-5 transition-colors hover:bg-muted/50 sm:grid-cols-[1fr_auto_auto] sm:items-center"
              >
                <div className="flex items-start gap-3">
                  <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                    <Bird className="size-5" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-base font-semibold">{flock.name}</h2>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${flock.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}
                      >
                        {flock.status}
                      </span>
                      <span className="rounded-full bg-secondary/10 px-2 py-0.5 text-[11px] font-semibold text-secondary">
                        {flock.type}
                      </span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {flock.breed} · placed {flock.dateReceived} · {age} days
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-5 text-sm sm:gap-8">
                  <div>
                    <div className="text-[11px] uppercase text-muted-foreground">Live</div>
                    <div className="num mt-1 font-semibold">{flock.liveCount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase text-muted-foreground">Placed</div>
                    <div className="num mt-1 font-semibold">
                      {flock.initialCount.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase text-muted-foreground">Net change</div>
                    <div className="num mt-1 font-semibold">{loss.toLocaleString()}</div>
                  </div>
                </div>
                <ArrowRight className="hidden size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary sm:block" />
              </Link>
            );
          })}
        </div>
        {!visible.length && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No flocks match this view.
          </div>
        )}
      </Panel>
      <div className="mt-4">
        <Notice title="Population reconciliation">
          Current population = opening population + birds received − deaths − culls − transfers out
          + transfers in. Sales and thinning are separate depletion events, never silently mixed
          into mortality.
        </Notice>
      </div>
    </div>
  );
}
