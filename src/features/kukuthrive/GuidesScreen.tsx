import { useMemo, useState } from "react";
import { BookOpen, Download, Headphones, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FIELD_GUIDES } from "./content";
import { GuideContent, ModuleHeader, Notice, Panel, PreviewFormDialog, StubButton } from "./ui";

export function GuidesScreen() {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(FIELD_GUIDES.map((g) => g.category)))],
    [],
  );
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const list = FIELD_GUIDES.filter(
    (g) =>
      (category === "All" || g.category === category) &&
      `${g.title} ${g.summary}`.toLowerCase().includes(query.toLowerCase()),
  );
  const [selectedId, setSelectedId] = useState(FIELD_GUIDES[0]?.id);
  const selected = FIELD_GUIDES.find((g) => g.id === selectedId) ?? list[0];

  return (
    <div>
      <ModuleHeader
        eyebrow="Guided data collection"
        title="Everyone scores the same way"
        description="Short, plain-language guides for every scored check and field task. Each says what to assess, how to do it, what each score looks like, common mistakes and when to call for help."
        actions={
          <>
            <StubButton
              variant="outline"
              feature="Offline guides"
              behavior="This will download every approved guide, with pictures and audio, so it opens on the phone without a connection."
            >
              <Download />
              Save for offline
            </StubButton>
            <PreviewFormDialog
              feature="Farm guide"
              behavior="This will save a farm-owned guide, versioned with its author and approver, alongside the original seeded guide which is never overwritten."
              trigger={
                <Button>
                  <Plus />
                  Add farm guide
                </Button>
              }
              title="Add a guide for your farm"
              description="Farm guides belong to the farm and are never overwritten by platform updates."
              fields={[
                { name: "title", label: "Guide title", required: true },
                {
                  name: "category",
                  label: "Category",
                  type: "select",
                  options: categories.slice(1),
                },
                { name: "what", label: "What you are assessing", type: "textarea", full: true },
                {
                  name: "steps",
                  label: "How to do it (one step per line)",
                  type: "textarea",
                  full: true,
                },
                { name: "approver", label: "Reviewed by" },
                { name: "source", label: "Source" },
              ]}
            />
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guides"
              className="h-11 pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  category === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {list.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setSelectedId(g.id)}
                className={cn(
                  "w-full rounded-lg border p-4 text-left transition-colors",
                  selected?.id === g.id
                    ? "border-primary bg-primary/5"
                    : "bg-card hover:border-secondary/40",
                )}
              >
                <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-secondary">
                  {g.category}
                </div>
                <div className="mt-1 font-display text-sm font-semibold">{g.title}</div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{g.summary}</p>
              </button>
            ))}
            {list.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">No guides match.</p>
            )}
          </div>
        </div>

        {selected ? (
          <Panel
            title={selected.title}
            description={`${selected.category} · seeded guide · pending professional review`}
            action={
              <StubButton
                size="sm"
                variant="outline"
                feature="Audio guide"
                behavior="This will play a short spoken version of the guide in the farm's chosen local language, for attendants who prefer listening."
              >
                <Headphones />
                Listen
              </StubButton>
            }
          >
            <GuideContent guide={selected} />
          </Panel>
        ) : (
          <Panel>
            <div className="py-10 text-center text-sm text-muted-foreground">
              <BookOpen className="mx-auto mb-2 size-5" />
              Choose a guide.
            </div>
          </Panel>
        )}
      </div>

      <div className="mt-5">
        <Notice title="Guides are content, not code">
          Each guide is versioned with its source and approver. A poultry professional should review
          guides before production use. Edits to a seeded guide create a farm copy; the original is
          kept.
        </Notice>
      </div>
    </div>
  );
}
