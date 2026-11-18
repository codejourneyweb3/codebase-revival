import { useState, type FormEvent } from "react";
import {
  AlertTriangle,
  BookOpenCheck,
  FileText,
  Lightbulb,
  MessageSquareText,
  Search,
  Send,
  ShieldX,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { showServerStub } from "./stub";
import { ModuleHeader, Notice, Panel, StubButton } from "./ui";

const SUGGESTED = [
  "Why is this flock growing slowly?",
  "What changed in the poultry house this week?",
  "Which flock has the highest mortality?",
  "What happened before the last environmental warning?",
  "Has litter condition deteriorated?",
  "Which feed batches were associated with poor performance?",
];

const CAPABILITIES = [
  {
    icon: AlertTriangle,
    title: "Explain an alert",
    text: "Why a warning was raised and which observations contributed.",
    behavior:
      "The assistant will read the alert's evidence, rule and recent records, then explain in plain language why it fired and what was missing.",
  },
  {
    icon: Lightbulb,
    title: "Interpret patterns",
    text: "Possible links between environment, behaviour, intake and growth.",
    behavior:
      "The assistant will compare environment, behaviour, feed, water and growth records over the chosen window and list possible relationships, marked as possibilities rather than causes.",
  },
  {
    icon: Search,
    title: "Plan an investigation",
    text: "Relevant checks and questions for the farm attendant.",
    behavior:
      "The assistant will suggest an ordered list of checks for the attendant, based on the active alerts and the farm's approved guides.",
  },
  {
    icon: FileText,
    title: "Summarise a cycle",
    text: "Readable summaries of performance and welfare observations.",
    behavior:
      "The assistant will write a short flock or production-cycle summary from validated records and calculated metrics, ready to review before sharing.",
  },
];

const OUTPUT = [
  "Summary",
  "Observed facts",
  "Relevant calculations",
  "Possible explanations",
  "Supporting evidence",
  "Suggested investigations",
  "Recommended escalation",
  "Confidence or uncertainty",
  "Required human review",
];

const NEVER = [
  "Invent readings, or turn a sensory score into a number",
  "Change historical records",
  "Give an unverified veterinary diagnosis",
  "Prescribe medication on its own",
  "Override a critical deterministic alert",
  "Call a flock healthy because information is missing",
  "Recommend unsafe environmental changes",
];

export function AssistantScreen() {
  const [question, setQuestion] = useState("");
  const ask = (event?: FormEvent) => {
    event?.preventDefault();
    showServerStub(
      "Investigation assistant",
      `The assistant will answer “${question.trim() || "your question"}” using only validated records for the selected farm, house, flock and time window, structured as summary, facts, calculations, possible explanations, evidence, suggested checks, escalation and confidence.`,
    );
  };
  return (
    <div>
      <ModuleHeader
        eyebrow="AI intelligence layer"
        title="Ask about your farm"
        description="The assistant explains validated records and deterministic findings. It suggests what to check next; it never replaces the rule engine, a veterinarian or your own judgement."
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Panel
            title="Your question"
            description="Scope: whole farm · last 14 days. Choose a house or flock to narrow it."
          >
            <form onSubmit={ask} className="space-y-3">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={3}
                placeholder="e.g. Why did feed intake drop in House A this week?"
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2">
                  <StubButton
                    variant="outline"
                    size="sm"
                    feature="Assistant scope"
                    behavior="This will let you pick the farm, house, flock and time window the assistant is allowed to read."
                  >
                    Change scope
                  </StubButton>
                </div>
                <Button type="submit">
                  <Send className="size-4" />
                  Ask
                </Button>
              </div>
            </form>
            <div className="mt-5">
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground">
                Try asking
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuestion(item)}
                    className="rounded-full border bg-background px-3 py-1.5 text-left text-xs hover:border-secondary/50 hover:bg-muted"
                  >
                    <MessageSquareText className="mr-1.5 inline size-3.5 text-secondary" />
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </Panel>

          <div className="grid gap-4 sm:grid-cols-2">
            {CAPABILITIES.map(({ icon: Icon, title, text, behavior }) => (
              <button
                key={title}
                type="button"
                onClick={() => showServerStub(title, behavior)}
                className="rounded-lg border bg-card p-5 text-left transition-colors hover:border-secondary/40"
              >
                <span className="grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">{title}</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
              </button>
            ))}
          </div>

          <Panel
            title="How every answer is laid out"
            description="A possible explanation is always kept apart from a confirmed cause."
          >
            <ol className="grid gap-2 sm:grid-cols-3">
              {OUTPUT.map((item, index) => (
                <li
                  key={item}
                  className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm"
                >
                  <span className="num text-xs font-bold text-secondary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="What the assistant reads">
            <ul className="space-y-1.5 text-sm leading-6 text-muted-foreground">
              {[
                "Farm, house and flock",
                "Bird age and time window",
                "Validated measurements and scores",
                "Calculated metrics",
                "Active rules and alerts",
                "Historical baselines",
                "Management events",
                "Reference standards",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <BookOpenCheck className="mt-1 size-3.5 shrink-0 text-secondary" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              It receives structured information, never open access to the whole database.
            </p>
          </Panel>
          <Panel title="The assistant will never">
            <ul className="space-y-1.5 text-sm leading-6">
              {NEVER.map((item) => (
                <li key={item} className="flex gap-2">
                  <ShieldX className="mt-1 size-3.5 shrink-0 text-destructive" />
                  {item}
                </li>
              ))}
            </ul>
          </Panel>
          <Notice title="Needs the server">
            <Sparkles className="mr-1 inline size-3.5" />
            Answers will appear once the farm's records are synced and the assistant is connected.
            Nothing you type here is sent yet.
          </Notice>
        </div>
      </div>
    </div>
  );
}
