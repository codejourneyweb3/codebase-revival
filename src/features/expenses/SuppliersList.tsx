import { useState, type FormEvent, type ReactNode } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Mail, Phone, Plus, X } from "lucide-react";
import { getDb, save, uid, type Supplier } from "../../lib/db";
import { useAuth } from "../auth/AuthProvider";

const EMPTY = { name: "", email: "", phone: "", items: "", balance: "" };

const INPUT =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none";

export function SuppliersList() {
  const { user } = useAuth();
  const canManage = user?.role === "owner";
  const suppliers = useLiveQuery(() => getDb().suppliers.toArray(), []) ?? [];
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);

  const owed = suppliers.reduce((sum, supplier) => sum + supplier.balance, 0);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("Give the supplier a name.");
      return;
    }
    const record: Supplier = {
      id: uid(),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      items: form.items.trim(),
      balance: Number(form.balance) || 0,
    };
    await save("suppliers", record, user?.name ?? "Unknown", "added supplier");
    setForm(EMPTY);
    setOpen(false);
    setError(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Suppliers
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage supplier contacts and view amounts owed.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-secondary"
          >
            {open ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {open ? "Cancel" : "Add supplier"}
          </button>
        )}
      </div>

      {open && canManage && (
        <form
          onSubmit={submit}
          className="space-y-4 rounded-lg border border-border bg-card p-5 shadow-sm"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input
                className={INPUT}
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Kuku Feeds Ltd"
              />
            </Field>
            <Field label="Items supplied">
              <input
                className={INPUT}
                value={form.items}
                onChange={(event) => setForm({ ...form, items: event.target.value })}
                placeholder="Layer mash, vaccines…"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                className={INPUT}
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </Field>
            <Field label="Phone">
              <input
                className={INPUT}
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                placeholder="+256 7xx xxx xxx"
              />
            </Field>
            <Field label="Amount owed (UGX)">
              <input
                type="number"
                min={0}
                className={INPUT}
                value={form.balance}
                onChange={(event) => setForm({ ...form, balance: event.target.value })}
              />
            </Field>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            className="rounded-lg bg-success px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-success/90"
          >
            Save supplier
          </button>
        </form>
      )}

      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="divide-y divide-border">
          {suppliers.map((row) => (
            <div
              key={row.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm"
            >
              <span className="min-w-0 flex-1 font-medium text-foreground">
                {row.name}
              </span>
              <span className="hidden sm:inline text-muted-foreground">{row.items}</span>
              <div className="hidden md:flex flex-wrap gap-x-4 gap-y-0.5 text-muted-foreground">
                {row.email && (
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {row.email}
                  </span>
                )}
                {row.phone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {row.phone}
                  </span>
                )}
              </div>
              <span className="font-medium text-foreground num">
                {row.balance === 0 ? "—" : `UGX ${row.balance.toLocaleString()}`}
              </span>
            </div>
          ))}
        </div>
        {suppliers.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No suppliers yet. Add your first supplier to start tracking purchases.
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total owed to suppliers</span>
          <span className="text-lg font-display font-semibold text-foreground num">
            UGX {owed.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
