import { useState, type FormEvent } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Plus, X, Check, Circle } from "lucide-react";
import { getDb, save, uid, type ExpenseCategoryRow } from "../../lib/db";
import { useAuth } from "../auth/AuthProvider";

const INPUT =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none";

export function ExpenseCategoriesScreen() {
  const { user } = useAuth();
  const canManage = user?.role === "owner";
  const rows = useLiveQuery(() => getDb().expenseCategories.toArray(), []) ?? [];
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Enter a category name.");
      return;
    }
    if (rows.some((r) => r.name.toLowerCase() === name.trim().toLowerCase())) {
      setError("That category already exists.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await save(
        "expenseCategories",
        { id: uid(), name: name.trim(), active: true },
        user?.name ?? "Unknown",
        "added expense category",
      );
      setName("");
      setAdding(false);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(row: ExpenseCategoryRow) {
    if (!canManage) return;
    await save(
      "expenseCategories",
      { ...row, active: !row.active },
      user?.name ?? "Unknown",
      row.active ? "deactivated expense category" : "reactivated expense category",
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Expense categories
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Categories used when recording expenses. Owners can add and toggle them on or off.
        </p>
      </div>

      {canManage && (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setAdding((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-secondary"
          >
            {adding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {adding ? "Cancel" : "Add category"}
          </button>
        </div>
      )}

      {adding && canManage && (
        <form
          onSubmit={submit}
          className="space-y-4 rounded-lg border border-border bg-card p-5 shadow-sm"
        >
          <div className="space-y-1">
            <label className="block text-sm font-medium text-foreground">
              Category name
            </label>
            <input
              className={INPUT}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Transport"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded-lg bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-success px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-success/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save category"}
            </button>
          </div>
        </form>
      )}

      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="divide-y divide-border">
          {rows.map((row) => (
            <div key={row.id} className="flex items-center gap-4 px-4 py-3 text-sm">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${row.active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}
              >
                {row.active ? <Check className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
              </span>
              <span
                className={`font-medium ${row.active ? "text-foreground" : "text-muted-foreground"}`}
              >
                {row.name}
              </span>
              <span className="text-muted-foreground text-xs">{row.id}</span>
              {canManage && (
                <button
                  type="button"
                  onClick={() => toggleActive(row)}
                  className={`rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                    row.active
                      ? "bg-destructive/5 text-destructive hover:bg-destructive/10"
                      : "bg-success/5 text-success hover:bg-success/10"
                  }`}
                >
                  {row.active ? "Hide" : "Show"}
                </button>
              )}
            </div>
          ))}
        </div>
        {rows.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No categories yet. Add one to use when recording expenses.
          </div>
        )}
      </div>
    </div>
  );
}
