import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Egg, Wheat, DollarSign, Percent, TrendingUp } from "lucide-react";
const months = ["Aug", "Sep", "Oct", "Nov"];
const eggProduction = [1_800, 2_100, 2_300, 2_340];
const feedCost = [400_000, 420_000, 410_000, 380_000];

export function AnalyticsScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Farm performance trends, egg production, and feed economics.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<Egg className="h-5 w-5" />}
          label="Eggs this month"
          value="2,340 trays"
          trend="+1.7%"
          up
          color="var(--success)"
        />
        <KpiCard
          icon={<Wheat className="h-5 w-5" />}
          label="Feed used"
          value="80 kg"
          trend="-3%"
          up
          color="var(--primary)"
        />
        <KpiCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Feed cost this month"
          value="UGX 380,000"
          trend="-7%"
          up
          color="var(--success)"
        />
        <KpiCard
          icon={<Percent className="h-5 w-5" />}
          label="FCR this month"
          value="2.04"
          trend="stable"
          neutral
          color="var(--muted)"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            Egg production
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={months.map((m, i) => ({ month: m, trays: eggProduction[i] }))}>
                <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    borderColor: "var(--border)",
                    borderRadius: 8,
                    color: "var(--foreground)",
                  }}
                  formatter={(value: number) => [`${value} trays`, "Eggs"]}
                />
                <Bar dataKey="trays" radius={[6, 6, 0, 0]}>
                  {eggProduction.map((_, i) => (
                    <Cell
                      key={i}
                      fill={i === eggProduction.length - 1 ? "var(--primary)" : "var(--secondary)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 font-display text-lg font-semibold text-foreground">
            Feed cost
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={months.map((m, i) => ({ month: m, cost: feedCost[i] }))}>
                <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                <YAxis
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickFormatter={(v) => `${v / 1000}k`}
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    borderColor: "var(--border)",
                    borderRadius: 8,
                    color: "var(--foreground)",
                  }}
                  formatter={(value: number) => [`UGX ${value.toLocaleString()}`, "Feed cost"]}
                />
                <Bar dataKey="cost" radius={[6, 6, 0, 0]} fill="var(--accent)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  trend,
  up,
  neutral,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: string;
  up?: boolean;
  neutral?: boolean;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-2xl font-semibold text-foreground num">
            {value}
          </p>
        </div>
        <div
          className={`rounded-full p-2 ${up ? "bg-success/10" : neutral ? "bg-muted" : "bg-destructive/10"}`}
        >
          <span
            className={`text-sm ${up ? "text-success" : neutral ? "text-muted-foreground" : "text-destructive"}`}
          >
            {icon}
          </span>
        </div>
      </div>
      {trend && (
        <p
          className={`mt-2 flex items-center text-sm ${up ? "text-success" : neutral ? "text-muted-foreground" : "text-destructive"}`}
        >
          <TrendingUp className="h-3.5 w-3.5 mr-1" />
          {trend}
        </p>
      )}
    </div>
  );
}
