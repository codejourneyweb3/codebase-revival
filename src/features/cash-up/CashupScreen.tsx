import { useAuth } from "../auth/AuthProvider";
import { useState } from "react";
import { DollarSign, AlertTriangle } from "lucide-react";
interface CashupMethod {
  method: string;
  expected: number;
  actual: number;
}

export function CashupScreen() {
  const { user } = useAuth();
  const isOwner = user?.role === "owner";
  const [entries] = useState<CashupMethod[]>([
    { method: "Cash", expected: 1_300_000, actual: 1_250_000 },
    { method: "Mobile money", expected: 2_600_000, actual: 2_600_000 },
    { method: "Bank", expected: 500_000, actual: 600_000 },
  ]);

  const diff = entries.reduce((sum, e) => sum + e.actual - e.expected, 0);
  const totalExpected = entries.reduce((sum, e) => sum + e.expected, 0);
  const totalActual = entries.reduce((sum, e) => sum + e.actual, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Cash-up</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isOwner
              ? "Compare expected receipts against what was collected today."
              : "Cash-up is restricted to the farm owner."}
          </p>
        </div>
        {isOwner && (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-secondary"
          >
            <DollarSign className="h-4 w-4" />
            Finalize cash-up
          </button>
        )}
      </div>

      {!isOwner && (
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm text-center">
          <p className="text-sm text-muted-foreground">
            Only the farm owner can adjust or finalize the cash-up. Managers can view sales and
            payments but not edit this screen.
          </p>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="divide-y divide-border">
          <div className="bg-muted px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <div className="flex items-center gap-2">
              <span>Method</span>
              <span className="ml-auto">Expected</span>
              <span className="ml-4">Actual</span>
              <span className="ml-4">Variance</span>
            </div>
          </div>
          {entries.map((row) => (
            <div key={row.method} className="flex items-center gap-4 px-4 py-3 text-sm">
              <span className="font-medium text-foreground">{row.method}</span>
              <span className="text-right text-muted-foreground num ml-auto">
                UGX {row.expected.toLocaleString()}
              </span>
              <span className="text-right text-foreground num ml-4">
                UGX {row.actual.toLocaleString()}
              </span>
              <VarianceBadge value={row.actual - row.expected} />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm">Total expected</span>
          </div>
          <span className="text-lg font-display font-semibold text-foreground num">
            UGX {totalExpected.toLocaleString()}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm">Total actual</span>
          </div>
          <span className="text-lg font-display font-semibold text-foreground num">
            UGX {totalActual.toLocaleString()}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-2">
            {diff === 0 ? (
              <DollarSign className="h-4 w-4 text-success" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            )}
            <span className="text-sm font-medium">Variance</span>
          </div>
          <span
            className={`text-lg font-display font-semibold num ${diff === 0 ? "text-success" : diff > 0 ? "text-success" : "text-destructive"}`}
          >
            {diff === 0 ? "—" : diff > 0 ? "+" : ""} UGX {Math.abs(diff).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function VarianceBadge({ value }: { value: number }) {
  if (value === 0)
    return <span className="text-right text-muted-foreground num ml-4">—</span>;
  return (
    <span
      className={`text-right num ml-4 ${value > 0 ? "text-success" : "text-destructive"}`}
    >
      {value > 0 ? "+" : ""} UGX {Math.abs(value).toLocaleString()}
    </span>
  );
}
