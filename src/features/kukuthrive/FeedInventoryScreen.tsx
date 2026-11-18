import { useState } from "react";
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  CalendarClock,
  ClipboardCheck,
  Plus,
  Scale,
  Wheat,
} from "lucide-react";
import { useData } from "@/lib/hooks";
import { calculateFeedConsumption } from "./calculations";
import {
  EmptyState,
  Metric,
  ModuleHeader,
  Notice,
  Panel,
  PreviewFormDialog,
  StubButton,
} from "./ui";
import { Button } from "@/components/ui/button";

const tabs = ["Stock balance", "Receipts", "Issues & consumption", "Physical counts"] as const;

export function FeedInventoryScreen() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Stock balance");
  const data = useData(async (db) => ({
    stock: await db.feedStock.toArray(),
    deliveries: await db.feedDeliveries.orderBy("date").reverse().toArray(),
    usage: await db.feedUsage.orderBy("date").reverse().toArray(),
    flocks: await db.flocks.toArray(),
  }));
  const totalKg = data?.stock.reduce((sum, item) => sum + item.quantityKg, 0) ?? 0;
  const low = data?.stock.filter((item) => item.quantityKg <= item.reorderKg) ?? [];
  const days =
    data?.stock
      .filter((item) => item.avgDailyKg > 0)
      .map((item) => item.quantityKg / item.avgDailyKg) ?? [];
  const purchaseCost = data?.deliveries.reduce((sum, item) => sum + item.cost, 0) ?? 0;
  const flockOptions = data?.flocks.map((flock) => flock.name) ?? [];
  return (
    <div>
      <ModuleHeader
        eyebrow="Feed & inventory"
        title="A ledger, not a feed-usage guess"
        description="Purchases come in, issues go out, and physical counts explain the difference. Feed is never typed twice into flock costs."
        actions={
          <PreviewFormDialog
            feature="Feed stock receipt"
            behavior="This will add the receipt to inventory, retain unit weight, price, batch, dates, storage and quality observations, and update cost per kilogram."
            trigger={
              <Button>
                <Plus />
                Record feed purchase
              </Button>
            }
            title="Receive feed into stock"
            description="Use the farm’s own bags or sacks and define the weight of one unit."
            fields={[
              {
                name: "feed",
                label: "Feed type and phase",
                type: "select",
                options: ["Broiler starter", "Broiler grower", "Broiler finisher", "Other"],
                required: true,
              },
              {
                name: "source",
                label: "Source",
                type: "select",
                options: ["Bought", "Homemade", "Locally mixed"],
              },
              { name: "quantity", label: "Units received", type: "number", required: true },
              {
                name: "unitWeight",
                label: "Weight of one unit (kg)",
                type: "number",
                required: true,
              },
              { name: "cost", label: "Purchase cost (UGX)", type: "number" },
              { name: "supplier", label: "Manufacturer and supplier" },
              { name: "batch", label: "Batch number" },
              { name: "expiry", label: "Expiry date", type: "date" },
              { name: "storage", label: "Storage location" },
              {
                name: "quality",
                label: "Quality observations at receipt",
                type: "textarea",
                full: true,
              },
            ]}
          />
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Recorded stock"
          value={`${totalKg.toLocaleString()} kg`}
          note="Across existing feed types"
          icon={<Wheat />}
        />
        <Metric
          label="Low-stock types"
          value={low.length}
          note={low.length ? "At or below reorder level" : "No types below reorder level"}
          icon={<AlertTriangle />}
          tone={low.length ? "warn" : "good"}
        />
        <Metric
          label="Shortest cover"
          value={days.length ? `${Math.min(...days).toFixed(1)} days` : "—"}
          note="At each recorded daily rate"
          icon={<CalendarClock />}
        />
        <Metric
          label="Recorded purchases"
          value={`UGX ${purchaseCost.toLocaleString()}`}
          note={`${data?.deliveries.length ?? 0} existing receipts`}
        />
      </div>

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

      {tab === "Stock balance" && (
        <div className="space-y-5">
          {low.length > 0 && (
            <Notice tone="warning" title="Feed needs attention">
              {low.map((item) => `${item.feedType}: ${item.quantityKg} kg remaining`).join(" · ")}
            </Notice>
          )}
          <Panel
            title="Current stock by feed type"
            description="Days remaining use the recorded daily rate; a physical count is never silently absorbed."
          >
            <div className="space-y-3">
              {data?.stock.map((item) => {
                const cover = item.avgDailyKg > 0 ? item.quantityKg / item.avgDailyKg : undefined;
                return (
                  <div
                    key={item.id}
                    className="grid gap-3 rounded-lg border p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                  >
                    <div>
                      <div className="font-semibold">{item.feedType}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Reorder at {item.reorderKg} kg · typical use {item.avgDailyKg} kg/day
                      </div>
                    </div>
                    <div className="num font-display text-xl font-semibold">
                      {item.quantityKg.toLocaleString()} kg
                    </div>
                    <div
                      className={`text-sm font-medium ${item.quantityKg <= item.reorderKg ? "text-warning" : "text-muted-foreground"}`}
                    >
                      {cover === undefined ? "No usage rate" : `${cover.toFixed(1)} days left`}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <PreviewFormDialog
                feature="Feed issue"
                behavior="This will deduct the issue from running stock, retain the farm unit and unit weight, and calculate consumption from issued minus leftovers and wastage."
                trigger={
                  <Button variant="outline">
                    <ArrowUpFromLine />
                    Preview feed issue
                  </Button>
                }
                title="Issue feed to a house and flock"
                description="Preview the stock-deduction workflow."
                fields={[
                  {
                    name: "flock",
                    label: "Flock",
                    type: "select",
                    options: flockOptions,
                    required: true,
                  },
                  {
                    name: "feed",
                    label: "Feed type",
                    type: "select",
                    options: data?.stock.map((item) => item.feedType) ?? [],
                    required: true,
                  },
                  {
                    name: "unit",
                    label: "Issue unit",
                    type: "select",
                    options: ["Scoops", "Basins", "Bags", "Kilograms"],
                  },
                  { name: "quantity", label: "Quantity issued", type: "number", required: true },
                  { name: "leftover", label: "Feed left at next visit (kg)", type: "number" },
                  { name: "wasted", label: "Known wastage (kg)", type: "number" },
                ]}
              />
              <StubButton
                feature="Feed quality observation"
                behavior="This will attach mould, smell, clumping, moisture, pests or storage concerns to the feed batch and trigger an inspection prompt."
                variant="outline"
              >
                Report feed quality
              </StubButton>
            </div>
          </Panel>
        </div>
      )}

      {tab === "Receipts" && (
        <Panel
          title="Stock receipts"
          description="Existing purchase records from your offline ledger."
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2">Date</th>
                  <th>Feed</th>
                  <th>Supplier</th>
                  <th className="text-right">Quantity</th>
                  <th className="text-right">Cost</th>
                  <th className="text-right">Cost/kg</th>
                </tr>
              </thead>
              <tbody>
                {data?.deliveries.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="py-3">{item.date}</td>
                    <td className="font-medium">{item.feedType}</td>
                    <td className="text-muted-foreground">{item.supplier}</td>
                    <td className="num text-right">{item.quantityKg} kg</td>
                    <td className="num text-right">UGX {item.cost.toLocaleString()}</td>
                    <td className="num text-right">
                      UGX{" "}
                      {item.quantityKg
                        ? Math.round(item.cost / item.quantityKg).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {tab === "Issues & consumption" && (
        <Panel
          title="Feed issued to flocks"
          description="Existing issue records. Without feeder leftovers, issued feed is only an upper bound on consumption."
        >
          <Notice title="How to read these records">
            The existing ledger does not yet contain feeder leftovers, so quantities below are
            labelled “at most”, not confirmed feed eaten.
          </Notice>
          <div className="mt-4 space-y-2">
            {data?.usage.slice(0, 30).map((item) => {
              const flock = data.flocks.find((f) => f.id === item.flockId);
              const consumption = calculateFeedConsumption(item.quantityKg);
              return (
                <div
                  key={item.id}
                  className="grid gap-2 rounded-lg border p-3 text-sm sm:grid-cols-[110px_1fr_1fr_auto]"
                >
                  <span className="text-muted-foreground">{item.date}</span>
                  <span className="font-medium">{flock?.name ?? "Previous flock"}</span>
                  <span>{item.feedType}</span>
                  <span className="num font-semibold">At most {consumption.upperBoundKg} kg</span>
                </div>
              );
            })}
          </div>
        </Panel>
      )}

      {tab === "Physical counts" && (
        <Panel title="Stock reconciliation">
          <EmptyState
            icon={<ClipboardCheck />}
            title="No physical-count history"
            description="A counted balance will be compared with expected stock. Any difference will remain visible as unexplained loss or wastage rather than being silently absorbed."
            action={
              <PreviewFormDialog
                feature="Physical feed count"
                behavior="This will compare counted and expected kilograms, preserve the difference as unexplained loss or wastage, and correct the running stock balance with an audit record."
                trigger={
                  <Button>
                    <Scale />
                    Preview physical count
                  </Button>
                }
                title="Count physical feed stock"
                description="Preview a reconciliation entry."
                fields={[
                  {
                    name: "feed",
                    label: "Feed type",
                    type: "select",
                    options: data?.stock.map((item) => item.feedType) ?? [],
                    required: true,
                  },
                  { name: "counted", label: "Counted stock (kg)", type: "number", required: true },
                  { name: "date", label: "Count date", type: "date" },
                  { name: "person", label: "Counted by" },
                  { name: "reason", label: "Explanation, if known", type: "textarea", full: true },
                ]}
              />
            }
          />
        </Panel>
      )}
      <div className="mt-5">
        <Notice title="Feed costs flow automatically">
          In the connected workflow, actual receipt prices will feed cost per bird, cost per
          kilogram of live-weight gain and total flock cost. Optional laboratory results will stay
          separate from daily attendant observations.
        </Notice>
      </div>
    </div>
  );
}
