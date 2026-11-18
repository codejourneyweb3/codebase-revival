import { Building2, Bird, HandHeart, Home } from "lucide-react";
import { showServerStub } from "./stub";
import { Panel, PreviewBadge } from "./ui";

const PACKS = [
  {
    icon: Building2,
    level: "Farm",
    items: [
      "Production performance",
      "Welfare status",
      "Active warnings",
      "Farm expenses",
      "House comparisons",
      "Production history",
    ],
  },
  {
    icon: Home,
    level: "House",
    items: [
      "Environmental trends (measured vs observed)",
      "Data completeness",
      "Litter condition",
      "Equipment failures",
      "Stocking density",
      "Welfare warnings",
    ],
  },
  {
    icon: Bird,
    level: "Flock",
    items: [
      "Growth curve",
      "Weight uniformity",
      "Feed & water consumption",
      "FCR",
      "Mortality",
      "Health events",
      "Welfare assessments",
      "Production costs",
    ],
  },
  {
    icon: HandHeart,
    level: "Intervention",
    items: [
      "Original problem",
      "Measurements before",
      "Action, date and person",
      "Measurements after",
      "Whether it improved",
      "Further action needed",
    ],
  },
];

export function ReportPacks() {
  return (
    <div className="mt-8">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="font-display text-lg font-semibold">Welfare & performance reports</h2>
        <PreviewBadge />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PACKS.map(({ icon: Icon, level, items }) => (
          <Panel
            key={level}
            title={`${level}-level report`}
            action={<Icon className="size-5 text-secondary" />}
          >
            <ul className="space-y-1 text-sm text-muted-foreground">
              {items.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() =>
                showServerStub(
                  `${level}-level report`,
                  `This will build the ${level.toLowerCase()} report from synced records, keep measured and observed evidence separate, show data completeness, and let you download it as PDF or CSV.`,
                )
              }
              className="mt-4 w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Generate
            </button>
          </Panel>
        ))}
      </div>
    </div>
  );
}
