import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Plus, X, TrendingUp, ArrowUpRight, ArrowDownRight, Calendar } from "lucide-react";
import { getDb, save, today, uid } from "../../lib/db";
import { useAuth } from "../auth/AuthProvider";

const PRODUCTS = ["Eggs (tray)", "Live chicken", "Spent hen", "Manure (bag)"];

const INPUT =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none";

export function PriceHistoryScreen() {
  const { user } = useAuth();
  const canManage = user?.role === "owner";
  const rows =
    useLiveQuery(() => getDb().priceHistory.orderBy("date").reverse().toArray(), []) ?? [];
  const [product, setProduct] = useState(PRODUCTS[0]);
  const [adding, setAdding] = useState(false);
  const [date, setDate] = useState(today());
  const [unitPrice, setUnitPrice] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timeline = rows.filter((r) => r.product === product);

  function netChange(latest: number, previous: number) {
    if (previous == null || previous === 0) return null;
    return (latest - previous) / previous;
  }

  const last = timeline[0] ?? null;
  const prev = timeline[1] ?? null;
  const change = last && prev ? netChange(last.unitPrice, prev.unitPrice) : null;

  async function submit() {
    const price = Number(unitPrice);
    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter a valid price.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await save(
        "priceHistory",
        { id: uid(), product, date, unitPrice: price, note: note.trim() || undefined },
        user?.name ?? "Unknown",
        "updated price",
      );
      setDate(today());
      setUnitPrice("");
      setNote("");
      setAdding(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Price history
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track how product prices move over time so sales and statements stay consistent.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            onClick={() => setAdding((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-secondary"
          >
            {adding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {adding ? "Cancel" : "Add change"}
          </button>
        )}
      </div>

      <div className="flex gap-1 overflow-x-auto border-b">
        {PRODUCTS.map((p) => (
          <button
            key={p}
            onClick={() => setProduct(p)}
            className={`whitespace-nowrap rounded-t-lg px-3 py-2 text-sm font-medium transition-colors ${
              product === p
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground">Current price</h2>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-2xl font-semibold text-foreground num">
              UGX {last ? last.unitPrice.toLocaleString() : "—"}
            </span>
            <span className="text-sm text-muted-foreground">{product}</span>
          </div>
          {last && last.note && (
            <p className="mt-2 text-xs text-muted-foreground">{last.note}</p>
          )}
          {change != null && (
            <div className="mt-3 flex items-center gap-1 text-sm font-medium">
              {change >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-success" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-destructive" />
              )}
              <span className={change >= 0 ? "text-success" : "text-destructive"}>
                {change >= 0 ? "+" : ""}
                {Math.round(change * 100)}%
              </span>
              <span className="ml-2 text-muted-foreground">vs last change</span>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground">Latest change</h2>
          {last ? (
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-muted-foreground">{last.date}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-xl font-semibold text-foreground num">
                  UGX {last.unitPrice.toLocaleString()}
                </span>
                {last.note && <span className="text-muted-foreground">{last.note}</span>}
              </div>
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              No price changes recorded yet.
            </p>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="text-sm font-medium text-muted-foreground">
            Changes this product
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{timeline.length} logged</p>
        </div>
      </div>

      {adding && canManage && (
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-foreground">
            Record a price change
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-1">
              <span className="block text-sm font-medium text-foreground">Date</span>
              <input
                type="date"
                className={INPUT}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label className="block space-y-1">
              <span className="block text-sm font-medium text-foreground">
                Price (UGX)
              </span>
              <input
                type="number"
                min={1}
                className={INPUT}
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="12000"
              />
            </label>
            <label className="sm:col-span-2 block space-y-1">
              <span className="block text-sm font-medium text-foreground">
                Note (optional)
              </span>
              <input
                className={INPUT}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Festive demand, supplier update…"
              />
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded-lg bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={submit}
              className="rounded-lg bg-success px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-success/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save change"}
            </button>
          </div>
        </div>
      )}

      {timeline.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center shadow-sm">
          <TrendingUp className="mx-auto h-8 w-8 text-muted" />
          <p className="mt-2 text-sm text-muted-foreground">
            No price changes for this product yet.
          </p>
        </div>
      ) : (
        <div className="space-y-2 rounded-lg border border-border bg-card p-5 shadow-sm">
          {timeline.map((row, i) => (
            <div key={row.id} className="flex flex-wrap items-center gap-4 py-3">
              <div className="grid gap-1 text-sm">
                <span className="font-medium text-foreground num">
                  UGX {row.unitPrice.toLocaleString()}
                </span>
                {row.note && <span className="text-muted-foreground">{row.note}</span>}
              </div>
              <span className="text-muted-foreground">{row.date}</span>
              {i > 0 && prev && row.unitPrice !== prev.unitPrice && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    row.unitPrice > prev.unitPrice
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {row.unitPrice > prev.unitPrice ? "up" : "down"} from{" "}
                  {row.unitPrice > prev.unitPrice ? "previous" : "previous"}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
