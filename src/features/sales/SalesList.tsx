import { useAuth } from "../auth/AuthProvider";
import { useState } from "react";
import { Plus, Search, Calendar, TrendingUp } from "lucide-react";
import { saleTotal } from "../../lib/finance";
interface SaleRow {
  id: string;
  ref: string;
  date: string;
  customer: string;
  item: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  paymentMethod: string;
  status: "paid" | "partly_paid" | "unsettled";
}

const SAMPLE: SaleRow[] = [
  {
    id: "s1",
    ref: "S001",
    date: "2026-11-09",
    customer: "Nakato Store",
    item: "eggs",
    quantity: 120,
    unit: "tray",
    unitPrice: 15000,
    paymentMethod: "mobile_money",
    status: "partly_paid",
  },
  {
    id: "s2",
    ref: "S002",
    date: "2026-11-08",
    customer: "Mukasa Eggs",
    item: "eggs",
    quantity: 200,
    unit: "tray",
    unitPrice: 14000,
    paymentMethod: "cash",
    status: "paid",
  },
  {
    id: "s3",
    ref: "S003",
    date: "2026-11-07",
    customer: "Biryabari Hotel",
    item: "birds",
    quantity: 50,
    unit: "bird",
    unitPrice: 28000,
    paymentMethod: "bank",
    status: "paid",
  },
];

export function SalesList() {
  const { user } = useAuth();
  const canManage = user?.role === "owner" || user?.role === "manager";
  const [filter, setFilter] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Sales</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Record and track customer sales. Totals are computed from quantity × unit price.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-secondary"
          >
            <Plus className="h-4 w-4" />
            New sale
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search sales, customers..."
            className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="date"
            className="rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-ring focus:outline-none"
          />
        </div>
        <select
          className="rounded-lg border border-input bg-background py-2 px-3 text-sm text-foreground focus:border-ring focus:outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="paid">Paid</option>
          <option value="partly_paid">Partly paid</option>
          <option value="unsettled">Unsettled</option>
        </select>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="divide-y divide-border">
          <div className="bg-muted px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <div className="flex items-center gap-2">
              <span>Ref</span>
              <span className="ml-auto">Customer</span>
              <span className="hidden sm:inline">Item</span>
              <span className="hidden sm:inline">Qty</span>
              <span className="hidden md:inline">Unit price</span>
              <span>Total</span>
              <span className="hidden sm:inline">Status</span>
            </div>
          </div>
          {SAMPLE.map((row) => (
            <div key={row.id} className="flex items-center gap-4 px-4 py-3 text-sm">
              <span className="font-medium text-foreground">{row.ref}</span>
              <span className="min-w-0 flex-1 truncate text-foreground">
                {row.customer}
              </span>
              <span className="hidden sm:inline text-muted-foreground">{row.item}</span>
              <span className="hidden sm:inline text-muted-foreground">
                {row.quantity} {row.unit}
              </span>
              <span className="hidden md:inline text-muted-foreground num">
                UGX {row.unitPrice.toLocaleString()}
              </span>
              <span className="text-foreground font-medium num">
                UGX {saleTotal(row).toLocaleString()}
              </span>
              <span className="ml-auto">
                <StatusBadge status={row.status} />
              </span>
            </div>
          ))}
        </div>
        {SAMPLE.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No sales yet. Create your first sale to start tracking revenue.
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Total sales this period</span>
          </div>
          <span className="text-lg font-display font-semibold text-foreground num">
            UGX {SAMPLE.reduce((sum, r) => sum + saleTotal(r), 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: SaleRow["status"] }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${status === "paid" ? "bg-success/10 text-success" : status === "partly_paid" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}
    >
      {status === "partly_paid" ? "Partly paid" : status}
    </span>
  );
}
