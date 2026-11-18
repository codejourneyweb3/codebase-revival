import { useNavigate } from "@/lib/router-compat";
import { useAuth } from "../auth/AuthProvider";
import { Plus, Mail, Phone, DollarSign } from "lucide-react";
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  overdueDays: number;
}

const SAMPLE: Customer[] = [
  {
    id: "c1",
    name: "Nakato Store",
    email: "nakato@example.com",
    phone: "+256 772 123 456",
    balance: 1_000_000,
    overdueDays: 12,
  },
  {
    id: "c2",
    name: "Mukasa Eggs",
    email: "mukasa@example.com",
    phone: "+256 700 987 654",
    balance: 0,
    overdueDays: 0,
  },
  {
    id: "c3",
    name: "Biryabari Hotel",
    email: "biryabari@example.com",
    phone: "+256 750 555 000",
    balance: 500_000,
    overdueDays: 5,
  },
];

export function CustomersList() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canManage = user?.role === "owner";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Customers
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View customer balances and ageing. Open a statement to see full history.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-secondary"
            onClick={() => navigate("/customers/new")}
          >
            <Plus className="h-4 w-4" />
            Add customer
          </button>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="divide-y divide-border">
          <div className="bg-muted px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <div className="flex items-center gap-2">
              <span>Customer</span>
              <span className="hidden sm:inline">Contact</span>
              <span className="hidden md:inline">Balance</span>
              <span className="hidden md:inline">Overdue</span>
              <span></span>
            </div>
          </div>
          {SAMPLE.map((row) => (
            <div
              key={row.id}
              className="flex items-center gap-4 px-4 py-3 text-sm cursor-pointer transition-colors hover:bg-muted"
              onClick={() => navigate(`/customers/${row.id}`)}
            >
              <div className="min-w-0 flex-1">
                <span className="font-medium text-foreground">{row.name}</span>
                <div className="mt-0.5 flex flex-wrap gap-x-4 gap-y-0.5 text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {row.email}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {row.phone}
                  </span>
                </div>
              </div>
              <div className="hidden md:flex items-baseline gap-1">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-foreground num">
                  {row.balance === 0 ? "—" : `UGX ${row.balance.toLocaleString()}`}
                </span>
              </div>
              <div className="hidden md:flex items-center gap-1">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${row.overdueDays > 0 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}
                >
                  {row.overdueDays > 0 ? `${row.overdueDays}d overdue` : "Current"}
                </span>
              </div>
              <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                View
              </span>
            </div>
          ))}
        </div>
        {SAMPLE.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No customers yet. Add your first customer to start tracking credit sales.
          </div>
        )}
      </div>
    </div>
  );
}
