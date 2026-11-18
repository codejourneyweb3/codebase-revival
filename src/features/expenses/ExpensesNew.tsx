import { Button } from "@/components/ui/button";
import { save,uid,type ExpenseCategory } from "@/lib/db";
import { syncNow } from "@/lib/sync";
import { z } from "zod";
import { useNavigate } from "@/lib/router-compat";
import { useAuth } from "../auth/AuthProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save } from "lucide-react";
const schema = z.object({
  ref: z.string().min(1, "Reference is required"),
  date: z.string().min(1, "Date is required"),
  supplierId: z.string().min(1, "Supplier is required"),
  category: z.enum(["feed", "medicine", "utilities", "labor", "other"]),
  amount: z.number().min(1, "Amount must be at least 1"),
  notes: z.string().optional(),
});

type Form = z.infer<typeof schema>;

export function ExpensesNew() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canManage = user?.role === "owner" || user?.role === "manager";
  const form = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      ref: `EXP-${String(Math.floor(Math.random() * 900) + 100)}`,
      date: new Date().toISOString().slice(0, 10),
      supplierId: "",
      category: "other",
      amount: 1,
      notes: "",
    },
  });

  const onSubmit = async (data: Form) => {
    try{const categories:Record<Form["category"],ExpenseCategory>={feed:"Feed",medicine:"Medication",utilities:"Utilities",labor:"Labour",other:"Other"};await save("expenses",{id:uid(),date:data.date,category:categories[data.category],description:data.ref,supplier:data.supplierId,amount:data.amount,paid:0,method:"Cash",notes:data.notes},user?.name??"");await syncNow();await navigate("/expenses");}catch(e){form.setError("root",{message:e instanceof Error?e.message:"Could not save expense."});}
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
          <h1 className="font-display text-2xl font-semibold text-foreground">
            New expense
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter one expense. Amounts are in UGX and recorded as an append-only money record.
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
          <FormField label="Supplier">
            <input {...form.register("supplierId")} className="w-full rounded-lg border border-input bg-background px-3 py-2" placeholder="Supplier name" />
          </FormField>
          <FormField label="Category">
            <select
              {...form.register("category")}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-ring focus:outline-none"
            >
              <option value="feed">Feed</option>
              <option value="medicine">Medicine</option>
              <option value="utilities">Utilities</option>
              <option value="labor">Labour</option>
              <option value="other">Other</option>
            </select>
          </FormField>
          <FormField label="Amount (UGX)">
            <input
              {...form.register("amount", { valueAsNumber: true })}
              type="number"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground focus:border-ring focus:outline-none"
            />
          </FormField>
          <div />
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

        {form.formState.errors.root && <p role="alert" className="text-sm text-destructive">{form.formState.errors.root.message}</p>}
        <Button
          type="submit"
          disabled={!canManage || form.formState.isSubmitting}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          Save expense
        </Button>
      </form>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block"><span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>{children}</label>
  );
}
