import { useState, type ComponentProps, type FormEvent, type ReactNode } from "react";
import { ArrowRight, BookOpen, Check, Cloud, Info, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Link } from "@/lib/router-compat";
import { showServerStub } from "./stub";
import { FIELD_GUIDES, SCORE_SCALES, type FieldGuide } from "./content";

export function ModuleHeader({
  eyebrow,
  title,
  description,
  actions,
  preview = true,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  preview?: boolean;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {eyebrow && (
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">
              {eyebrow}
            </span>
          )}
          {preview && <PreviewBadge />}
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-normal text-foreground">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function PreviewBadge({ label = "Frontend preview" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[11px] font-semibold text-warning">
      <Cloud className="size-3" />
      {label}
    </span>
  );
}

export function StubButton({
  feature,
  behavior,
  children,
  ...props
}: Omit<ComponentProps<typeof Button>, "onClick"> & { feature: string; behavior: string }) {
  return (
    <Button type="button" {...props} onClick={() => showServerStub(feature, behavior)}>
      {children}
    </Button>
  );
}

export function Panel({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-lg border bg-card shadow-[0_1px_2px_color-mix(in_oklab,var(--foreground)_4%,transparent)]",
        className,
      )}
    >
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 border-b px-5 py-4">
          <div>
            {title && <h2 className="font-display text-base font-semibold">{title}</h2>}
            {description && (
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>
            )}
          </div>
          {action}
        </header>
      )}
      <div className={cn("p-5", contentClassName)}>{children}</div>
    </section>
  );
}

export function Metric({
  label,
  value,
  note,
  icon,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  note?: ReactNode;
  icon?: ReactNode;
  tone?: "default" | "good" | "warn" | "bad";
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {label}
        {icon && <span className="text-secondary [&_svg]:size-4">{icon}</span>}
      </div>
      <div className="num mt-2 font-display text-2xl font-semibold">{value}</div>
      {note && (
        <div
          className={cn(
            "mt-1.5 text-xs leading-5",
            tone === "good" && "text-success",
            tone === "warn" && "text-warning",
            tone === "bad" && "text-destructive",
            tone === "default" && "text-muted-foreground",
          )}
        >
          {note}
        </div>
      )}
    </div>
  );
}

export type Evidence = "Measured" | "Observed" | "Inferred" | "Missing";
export function EvidenceBadge({ evidence }: { evidence: Evidence }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold",
        evidence === "Measured" && "border-primary/20 bg-primary/10 text-primary",
        evidence === "Observed" && "border-secondary/25 bg-secondary/10 text-secondary",
        evidence === "Inferred" && "border-warning/25 bg-warning/10 text-warning",
        evidence === "Missing" && "border-border bg-muted text-muted-foreground",
      )}
    >
      {evidence}
    </span>
  );
}

export function Notice({
  children,
  tone = "info",
  title,
}: {
  children: ReactNode;
  tone?: "info" | "warning" | "danger" | "success";
  title?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border px-4 py-3 text-sm leading-6",
        tone === "info" && "border-primary/15 bg-primary/5 text-foreground",
        tone === "warning" && "border-warning/25 bg-warning/10",
        tone === "danger" && "border-destructive/25 bg-destructive/5",
        tone === "success" && "border-success/25 bg-success/10",
      )}
    >
      <div className="flex gap-3">
        <Info
          className={cn(
            "mt-1 size-4 shrink-0",
            tone === "warning" && "text-warning",
            tone === "danger" && "text-destructive",
            tone === "success" && "text-success",
            tone === "info" && "text-primary",
          )}
        />
        <div>
          {title && <div className="font-semibold">{title}</div>}
          <div className="text-muted-foreground">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-5 py-10 text-center">
      <div className="mb-3 grid size-11 place-items-center rounded-full bg-muted text-muted-foreground [&_svg]:size-5">
        {icon ?? <Plus />}
      </div>
      <h3 className="font-display text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ScoreInput({
  scaleId,
  value,
  onChange,
  label,
}: {
  scaleId: string;
  value?: number;
  onChange: (score: number | undefined) => void;
  label?: string;
}) {
  const scale = SCORE_SCALES.find((item) => item.id === scaleId);
  if (!scale) return null;
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold">{label ?? scale.name}</legend>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {scale.descriptions.map((description, index) => {
          const score = index + 1;
          const selected = value === score;
          return (
            <button
              key={description}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? undefined : score)}
              className={cn(
                "min-h-20 rounded-lg border p-3 text-left transition-all",
                selected
                  ? "border-primary bg-primary/10 ring-1 ring-primary"
                  : "bg-background hover:border-secondary/50 hover:bg-muted/60",
              )}
            >
              <span
                className={cn(
                  "mb-1 grid size-6 place-items-center rounded-full text-xs font-bold",
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {selected ? <Check className="size-3.5" /> : score}
              </span>
              <span className="mt-2 block text-xs leading-5 text-foreground">{description}</span>
            </button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        {value
          ? `Score ${value} selected.`
          : "Not assessed — leave unselected rather than entering zero."}
      </p>
    </fieldset>
  );
}

export interface PreviewField {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "select" | "textarea";
  options?: string[];
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  full?: boolean;
}

export function PreviewFormDialog({
  trigger,
  title,
  description,
  feature,
  behavior,
  fields,
  submitLabel = "Continue",
}: {
  trigger: ReactNode;
  title: string;
  description: string;
  feature: string;
  behavior: string;
  fields: PreviewField[];
  submitLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    showServerStub(feature, behavior);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div
              key={field.name}
              className={cn(
                "space-y-2",
                (field.full || field.type === "textarea") && "sm:col-span-2",
              )}
            >
              <Label htmlFor={`preview-${field.name}`}>
                {field.label}
                {field.required && " *"}
              </Label>
              {field.type === "select" ? (
                <select
                  id={`preview-${field.name}`}
                  name={field.name}
                  required={field.required}
                  defaultValue={field.defaultValue ?? ""}
                  className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select…</option>
                  {field.options?.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <Textarea
                  id={`preview-${field.name}`}
                  name={field.name}
                  required={field.required}
                  placeholder={field.placeholder}
                  defaultValue={field.defaultValue}
                  rows={3}
                />
              ) : (
                <Input
                  id={`preview-${field.name}`}
                  name={field.name}
                  type={field.type ?? "text"}
                  required={field.required}
                  placeholder={field.placeholder}
                  defaultValue={field.defaultValue}
                  min={field.type === "number" ? 0 : undefined}
                  step={field.type === "number" ? "any" : undefined}
                  className="h-11"
                />
              )}
            </div>
          ))}
          <div className="flex items-center justify-between gap-3 sm:col-span-2">
            <p className="text-xs leading-5 text-muted-foreground">
              Preview only. Your entries will not be stored.
            </p>
            <Button type="submit">
              {submitLabel}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function GuideDialog({ guideId, trigger }: { guideId: string; trigger?: ReactNode }) {
  const guide = FIELD_GUIDES.find((item) => item.id === guideId);
  if (!guide) return null;
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <BookOpen className="size-4" />
            How do I judge this?
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[88vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{guide.title}</DialogTitle>
          <DialogDescription>{guide.summary}</DialogDescription>
        </DialogHeader>
        <GuideContent guide={guide} compact />
      </DialogContent>
    </Dialog>
  );
}

export function GuideContent({ guide, compact = false }: { guide: FieldGuide; compact?: boolean }) {
  const scale = SCORE_SCALES.find((item) => item.id === guide.scaleId);
  const sections = [
    ["What you are assessing", guide.what],
    ["Why it matters", guide.why],
    ["Equipment", guide.equipment],
    ["Where to measure", guide.where],
    ["How many samples", guide.sample],
    ["Suggested frequency", guide.frequency],
    ["What to record", guide.record],
    ["What KukuThrive calculates", guide.calculates],
    ["When a result is abnormal", guide.abnormal],
    ["Common mistakes", guide.mistakes],
    ["What to do next", guide.next],
    ["When to call a veterinarian or adviser", guide.veterinarian],
  ];
  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-muted p-4">
        <h3 className="text-sm font-semibold">How to do it</h3>
        <ol className="mt-3 space-y-2">
          {guide.steps.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm leading-6">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
      {scale && (
        <div>
          <h3 className="mb-2 text-sm font-semibold">What each score looks like</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {scale.descriptions.map((description, index) => (
              <div key={description} className="flex gap-3 rounded-lg border p-3 text-sm">
                <span className="font-display text-lg font-bold text-primary">{index + 1}</span>
                <span>{description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className={cn("grid gap-4", !compact && "md:grid-cols-2")}>
        {sections.map(([title, text]) => (
          <div key={title}>
            <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-secondary">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-UG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T12:00:00`));
}

/** Small link to the original record list that a redesigned module screen sits on top of. */
export function RecordsLink({ to, label }: { to: string; label: string }) {
  return (
    <div className="mb-3 flex justify-end">
      <Link
        to={to}
        className="inline-flex items-center gap-1 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        {label}
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
