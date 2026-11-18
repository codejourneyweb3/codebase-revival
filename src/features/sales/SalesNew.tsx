import { Button } from "@/components/ui/button";
import { useData } from "@/lib/hooks";
import { save,uid,type Product } from "@/lib/db";
import { syncNow } from "@/lib/sync";
import { Link } from "@/lib/router-compat";
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
  item: z.enum(["eggs", "birds", "spent", "manure"]),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unit: z.string().min(1, "Unit is required"),
  unitPrice: z.number().min(1, "Unit price must be at least 1"),
  paymentMethod: z.enum(["cash", "mobile_money", "bank"]),
  notes: z.string().optional(),
});

type Form = z.infer<typeof schema>;

export function SalesNew() {
  const customers=useData(db=>db.customers.toArray())??[];
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
    try {
      const products:Record<Form["item"],Product>={eggs:"Eggs (tray)",birds:"Live chicken",spent:"Spent hen",manure:"Manure (bag)"};
      await save("sales", {id:uid(),ref:data.ref,date:data.date,customerId:data.customerId,product:products[data.item],quantity:data.quantity,unitPrice:data.unitPrice,paymentMethod:data.paymentMethod,notes:data.notes},user?.name??"");
      await syncNow();await navigate("/sales");
    }catch(e){form.setError("root",{message:e instanceof Error?e.message:"Could not save sale."});}

  };

  return (
    <div className="space-y-6">
      <Button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">New sale</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter one sale. The total is computed as quantity × unit price.
          </p>
        </div>
      </div>

      {!customers.length && <p className="text-sm text-muted-foreground">Add a customer before recording a sale. <Link to="/customers" className="text-primary underline">Open customers</Link></p>}
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
              {customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FormField>
          <FormField label="Item">
            <select
              {...form.register("item")}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-ring focus:outline-none"
            >
              <option value="eggs">Eggs</option>
              <option value="birds">Birds</option>
              <option value="spent">Spent hen</option>
              <option value="manure">Manure</option>
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

        <Button
          type="submit"
          disabled={!canManage || form.formState.isSubmitting}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          Save sale
        </Button>
      </form>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
