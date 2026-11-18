import { FileText, Egg, DollarSign, TrendingUp, Calendar, Download } from "lucide-react";
import { useState } from "react";
const reports = [
  {
    id: "daily-summary",
    name: "Daily operations summary",
    description: "Eggs, feed, health, mortality for a selected date range.",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: "egg-production",
    name: "Egg production report",
    description: "Trays by flock, grade mix, and trends over time.",
    icon: <Egg className="h-5 w-5" />,
  },
  {
    id: "sales-statement",
    name: "Sales & customer statement",
    description: "Sales, payments, balances, and ageing by customer.",
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    id: "cashflow",
    name: "Cash flow summary",
    description: "Sales vs expenses by period with net position.",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    id: "flock-performance",
    name: "Flock performance",
    description: "Weight progress, mortality, feed conversion per flock.",
    icon: <Calendar className="h-5 w-5" />,
  },
];

export function ReportsScreen() {
  const [filter, setFilter] = useState("all");
  const formats = ["CSV", "PDF"] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Reports & exports
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate and export farm reports. Choose a report and format, then download.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <select
          className="rounded-lg border border-input bg-background py-2 px-3 text-sm text-foreground focus:border-ring focus:outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All reports</option>
          <option value="financial">Financial</option>
          <option value="production">Production</option>
          <option value="operations">Operations</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports
          .filter((r) => {
            if (filter === "financial") return ["sales-statement", "cashflow"].includes(r.id);
            if (filter === "production")
              return ["egg-production", "flock-performance"].includes(r.id);
            if (filter === "operations") return ["daily-summary"].includes(r.id);
            return true;
          })
          .map((r) => (
            <ReportCard key={r.id} report={r} formats={formats} />
          ))}
      </div>
    </div>
  );
}

function ReportCard({
  report,
  formats,
}: {
  report: (typeof reports)[0];
  formats: readonly string[];
}) {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleExport = async (format: string) => {
    setDownloading(format);
    // Generate a sample export here. In production this would call the server or
    // generate a CSV from IndexedDB.
    await new Promise((r) => setTimeout(r, 300));
    setDownloading(null);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <div className="rounded-full bg-muted p-2 text-muted-foreground">
          {report.icon}
        </div>
        <div>
          <h3 className="font-medium text-foreground">{report.name}</h3>
          <p className="text-sm text-muted-foreground">{report.description}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {formats.map((f) => (
          <button
            key={f}
            type="button"
            disabled={downloading !== null}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed"
            onClick={() => handleExport(f)}
          >
            <Download className="h-3.5 w-3.5" />
            {downloading === f ? "Exporting…" : `Export ${f}`}
          </button>
        ))}
      </div>
    </div>
  );
}
