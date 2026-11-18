import { useAuth } from "../auth/AuthProvider";
import { stockTotal } from "../../lib/stock-utils";
import { Plus, AlertTriangle, Wheat, Pill, DollarSign } from "lucide-react";
interface StockItem {
  id: string;
  name: string;
  type: "feed" | "medicine";
  unit: string;
  quantity: number;
  pricePerKg?: number;
  lowStockThreshold?: number;
  location: string;
}

const SAMPLE: StockItem[] = [
  {
    id: "fs-1",
    name: "Layer mash 50kg",
    type: "feed",
    unit: "bags",
    quantity: 30,
    pricePerKg: 1_200,
    lowStockThreshold: 10,
    location: "Shed A store",
  },
  {
    id: "fs-2",
    name: "Broiler feed 50kg",
    type: "feed",
    unit: "bags",
    quantity: 18,
    pricePerKg: 1_250,
    lowStockThreshold: 8,
    location: "Shed A store",
  },
  {
    id: "ms-1",
    name: "Newcastle vaccine",
    type: "medicine",
    unit: "doses",
    quantity: 200,
    lowStockThreshold: 50,
    location: "Cold store",
  },
  {
    id: "ms-2",
    name: "Poultry vitamins",
    type: "medicine",
    unit: "bottles",
    quantity: 12,
    lowStockThreshold: 5,
    location: "Cold store",
  },
];

export function StockList() {
  const { user } = useAuth();
  const canManage = user?.role === "owner" || user?.role === "manager";

  const totalValue = SAMPLE.reduce((sum, i) => sum + stockTotal(i), 0);
  const lowStock = SAMPLE.filter((i) => i.lowStockThreshold && i.quantity < i.lowStockThreshold);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Stock</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track feed bags, medicine doses, and their values. Quantities are in kg for feed and
            doses/bottles for medicine.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-secondary"
          >
            <Plus className="h-4 w-4" />
            Add stock
          </button>
        )}
      </div>

      {lowStock.length > 0 && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Low stock</span>
          </div>
          <ul className="mt-2 space-y-1 text-foreground">
            {lowStock.map((i) => (
              <li key={i.id}>
                {i.name}: {i.quantity} {i.unit} (threshold {i.lowStockThreshold})
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
            <Wheat className="h-4 w-4 text-accent" />
            Feed stock
          </h2>
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="divide-y divide-border">
              <div className="bg-muted px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <div className="flex items-center gap-2">
                  <span>Item</span>
                  <span className="hidden sm:inline">Quantity</span>
                  <span className="hidden md:inline">Price / kg</span>
                  <span>Location</span>
                </div>
              </div>
              {SAMPLE.filter((i) => i.type === "feed").map((row) => (
                <div key={row.id} className="flex items-center gap-4 px-4 py-3 text-sm">
                  <span className="font-medium text-foreground">{row.name}</span>
                  <span className="hidden sm:inline text-muted-foreground">
                    {row.quantity} {row.unit}
                  </span>
                  <span className="hidden md:inline text-muted-foreground num">
                    UGX {row.pricePerKg?.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">{row.location}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
            <Pill className="h-4 w-4 text-secondary" />
            Medicine stock
          </h2>
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="divide-y divide-border">
              <div className="bg-muted px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <div className="flex items-center gap-2">
                  <span>Item</span>
                  <span className="hidden sm:inline">Quantity</span>
                  <span>Location</span>
                </div>
              </div>
              {SAMPLE.filter((i) => i.type === "medicine").map((row) => (
                <div key={row.id} className="flex items-center gap-4 px-4 py-3 text-sm">
                  <span className="font-medium text-foreground">{row.name}</span>
                  <span className="hidden sm:inline text-muted-foreground">
                    {row.quantity} {row.unit}
                  </span>
                  <span className="text-muted-foreground">{row.location}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm">Total stock value</span>
          </div>
          <span className="text-lg font-display font-semibold text-foreground num">
            UGX {totalValue.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
