import { z } from "zod";
import { useNavigate } from "@/lib/router-compat";
import { useAuth } from "../auth/AuthProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
const schema = z.object({
  ref: z.string().min(1, "Reference is required"),
  date: z.string().min(1, "Date is required"),
  customerId: z.string().min(1, "Customer is required"),
  item: z.enum(["eggs", "birds", "feed", "other"]),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unit: z.string().min(1, "Unit is required"),
  unitPrice: z.number().min(1, "Unit price must be at least 1"),
  paymentMethod: z.enum(["cash", "mobile_money", "bank"]),
  notes: z.string().optional(),
});

type Form = z.infer<typeof schema>;

export function SalesNew() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      ref: `S${String(Math.floor(Math.random() * 900) + 100)}`,
      date: new Date().toISOString().slice(0, 10),
      customerId: "",
      item: "eggs",
      quantity: 1,
      unit: "tray",
      unitPrice: 15000,
      paymentMethod: "cash",
      notes: "",
    },
  });

  const canManage = user?.role === "owner" || user?.role === "manager";

  const onSubmit = async (data: Form) => {
    // Post to /api/v1/sales when the server is live.
    // For now, navigate back so the list screen is reachable.
    console.info("New sale payload:", data);
    navigate("/sales");
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">New sale</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter one sale. The total is computed as quantity × unit price.
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Reference">
            <input
              {...form.register("ref")}
              type="text"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-ring focus:outline-none"
            />
          </FormField>
          <FormField label="Date">
            <input
              {...form.register("date")}
              type="date"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-ring focus:outline-none"
            />
          </FormField>
          <FormField label="Customer">
            <select
              {...form.register("customerId")}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-ring focus:outline-none"
            >
              <option value="">Select customer…</option>
              <option value="c1">Nakato Store</option>
              <option value="c2">Mukasa Eggs</option>
            </select>
          </FormField>
          <FormField label="Item">
            <select
              {...form.register("item")}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-ring focus:outline-none"
            >
              <option value="eggs">Eggs</option>
              <option value="birds">Birds</option>
              <option value="feed">Feed</option>
              <option value="other">Other</option>
            </select>
          </FormField>
          <FormField label="Quantity">
            <input
              {...form.register("quantity", { valueAsNumber: true })}
              type="number"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-ring focus:outline-none"
            />
          </FormField>
          <FormField label="Unit">
            <input
              {...form.register("unit")}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-ring focus:outline-none"
              placeholder="tray / bird / kg"
            />
          </FormField>
          <FormField label="Unit price (UGX)">
            <input
              {...form.register("unitPrice", { valueAsNumber: true })}
              type="number"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-ring focus:outline-none"
            />
          </FormField>
          <FormField label="Payment method">
            <select
              {...form.register("paymentMethod")}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-ring focus:outline-none"
            >
              <option value="cash">Cash</option>
              <option value="mobile_money">Mobile money</option>
              <option value="bank">Bank</option>
            </select>
          </FormField>
        </div>

        <div>
          <FormField label="Notes">
            <input
              {...form.register("notes")}
              type="text"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-ring focus:outline-none"
            />
          </FormField>
        </div>

        {form.formState.errors.root && (
          <p className="text-sm text-destructive">{form.formState.errors.root?.message}</p>
        )}

        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="font-display text-lg font-semibold text-foreground num">
            UGX {(form.watch("quantity") * form.watch("unitPrice")).toLocaleString()}
          </span>
        </div>

        <button
          type="submit"
          disabled={!canManage}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          Save sale
        </button>
      </form>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}
