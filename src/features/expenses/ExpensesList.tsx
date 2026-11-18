import { useState, type FormEvent } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Link } from "@/lib/router-compat";
import { Filter, Plus, Search, Wallet } from "lucide-react";
import { getDb, save, today, uid, type Expense, type ExpensePayment } from "../../lib/db";
import { useAuth } from "../auth/AuthProvider";

const INPUT =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none";

const CATEGORIES = ["Feed", "Medication", "Labour", "Utilities", "Equipment", "Transport", "Other"];

type Status = "paid" | "partly_paid" | "unsettled";

export function ExpensesList() {
  const { user } = useAuth();
  const canManage = user?.role === "owner" || user?.role === "manager";
  const expenses =
    useLiveQuery(() => getDb().expenses.orderBy("date").reverse().toArray(), []) ?? [];
  const payments = useLiveQuery(() => getDb().expensePayments.toArray(), []) ?? [];
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [paying, setPaying] = useState<{
    expenseId: string;
    amount: string;
    method: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const paidFor = (expenseId: string) =>
    payments
      .filter((payment) => payment.expenseId === expenseId)
      .reduce((sum, payment) => sum + payment.amount, 0);

  const statusFor = (expense: Expense): Status => {
    const paid = paidFor(expense.id);
    if (paid >= expense.amount) return "paid";
    return paid > 0 ? "partly_paid" : "unsettled";
  };

  const visible = expenses.filter((expense) => {
    const matchesFilter = filter === "all" || expense.category === filter;
    const haystack =
      `${expense.description} ${expense.supplier ?? ""} ${expense.category}`.toLowerCase();
    return matchesFilter && haystack.includes(query.trim().toLowerCase());
  });

  const total = visible.reduce((sum, expense) => sum + expense.amount, 0);
  const outstanding = visible.reduce(
    (sum, expense) => sum + Math.max(0, expense.amount - paidFor(expense.id)),
    0,
  );

  async function recordPayment(event: FormEvent) {
    event.preventDefault();
    if (!paying) return;
    const amount = Number(paying.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter how much was paid.");
      return;
    }
    const expense = expenses.find((row) => row.id === paying.expenseId);
    if (!expense) {
      setError("That expense is no longer on file.");
      return;
    }

    const payment: ExpensePayment = {
      id: uid(),
      expenseId: expense.id,
      date: today(),
      amount,
      method: paying.method,
    };
    const name = user?.name ?? "Unknown";
    await save("expensePayments", payment, name, "recorded expense payment");
    await save(
      "expenses",
      { ...expense, paid: paidFor(expense.id) + amount },
      name,
      "updated expense paid total",
    );
    setPaying(null);
    setError(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Expenses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Record operating expenses and track what has been paid. Amounts are in UGX.
          </p>
        </div>
        {canManage && (
          <Link
            to="/expenses/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-secondary"
          >
            <Plus className="h-4 w-4" />
            New expense
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search expenses, suppliers…"
            className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
          />
        </div>
        <Filter className="h-4 w-4 text-muted-foreground" />
        <select
          className="rounded-lg border border-input bg-background py-2 px-3 text-sm text-foreground focus:border-ring focus:outline-none"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="divide-y divide-border">
          {visible.map((row) => {
            const paid = paidFor(row.id);
            const open = Math.max(0, row.amount - paid);
            return (
              <div key={row.id} className="px-4 py-3 text-sm">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="min-w-0 flex-1 font-medium text-foreground">
                    {row.description}
                  </span>
                  <span className="hidden sm:inline text-muted-foreground">
                    {row.supplier ?? "—"}
                  </span>
                  <span className="hidden md:inline text-muted-foreground">
                    {row.category}
                  </span>
                  <span className="hidden lg:inline text-muted-foreground">
                    {row.date}
                  </span>
                  <span className="font-medium text-foreground num">
                    UGX {row.amount.toLocaleString()}
                  </span>
                  <StatusBadge status={statusFor(row)} />
                  {canManage && open > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setPaying({
                          expenseId: row.id,
                          amount: String(open),
                          method: row.method || "Cash",
                        })
                      }
                      className="rounded-md bg-background px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                    >
                      Pay
                    </button>
                  )}
                </div>
                {paid > 0 && open > 0 && (
                  <p className="mt-1 text-xs text-muted-foreground num">
                    Paid UGX {paid.toLocaleString()} · still owed UGX {open.toLocaleString()}
                  </p>
                )}
                {paying?.expenseId === row.id && (
                  <form
                    onSubmit={recordPayment}
                    className="mt-3 flex flex-wrap items-end gap-3 rounded-lg bg-background p-3"
                  >
                    <label className="block space-y-1">
                      <span className="block text-xs text-muted-foreground">
                        Amount (UGX)
                      </span>
                      <input
                        type="number"
                        min={1}
                        className={`${INPUT} w-36`}
                        value={paying.amount}
                        onChange={(event) => setPaying({ ...paying, amount: event.target.value })}
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="block text-xs text-muted-foreground">Method</span>
                      <select
                        className={`${INPUT} w-36`}
                        value={paying.method}
                        onChange={(event) => setPaying({ ...paying, method: event.target.value })}
                      >
                        <option value="Cash">Cash</option>
                        <option value="Mobile money">Mobile money</option>
                        <option value="Bank">Bank</option>
                      </select>
                    </label>
                    <button
                      type="submit"
                      className="rounded-lg bg-success px-3 py-2 text-sm font-medium text-white hover:bg-success/90"
                    >
                      Save payment
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaying(null)}
                      className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
        {visible.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            {expenses.length === 0
              ? "No expenses yet. Add your first expense to start tracking costs."
              : "No expenses match this search."}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Total expenses this period
            </span>
            <span className="text-lg font-display font-semibold text-foreground num">
              UGX {total.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wallet className="h-4 w-4" />
              <span className="text-sm">Still owed</span>
            </div>
            <span className="text-lg font-display font-semibold text-foreground num">
              UGX {outstanding.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        status === "paid"
          ? "bg-success/10 text-success"
          : status === "partly_paid"
            ? "bg-warning/10 text-warning"
            : "bg-destructive/10 text-destructive"
      }`}
    >
      {status === "partly_paid" ? "Partly paid" : status}
    </span>
  );
}
