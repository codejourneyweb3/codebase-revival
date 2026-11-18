import { useAuth } from "../auth/AuthProvider";
import { useState } from "react";
import { Upload, FolderOpen, FileText, Download, Pencil } from "lucide-react";
interface Document {
  id: string;
  title: string;
  type: string;
  category: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
}

const SAMPLE: Document[] = [
  {
    id: "d1",
    title: "Feed supplier contract 2026",
    type: "PDF",
    category: "Contracts",
    uploadedBy: "Tracy",
    uploadedAt: "2026-11-02",
    size: "1.2 MB",
  },
  {
    id: "d2",
    title: "Vaccine stock register",
    type: "XLSX",
    category: "Inventory",
    uploadedBy: "David",
    uploadedAt: "2026-10-28",
    size: "0.4 MB",
  },
  {
    id: "d3",
    title: "Daily operations log 2026-11-09",
    type: "PDF",
    category: "Reports",
    uploadedBy: "Tracy",
    uploadedAt: "2026-11-09",
    size: "0.6 MB",
  },
];

export function DocumentsList() {
  const { user } = useAuth();
  const canManage = user?.role === "owner" || user?.role === "manager";
  const [filter, setFilter] = useState("all");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Documents
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload and manage farm documents — contracts, reports, registers.
          </p>
        </div>
        {canManage && (
          <label className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-secondary cursor-pointer">
            <Upload className="h-4 w-4" />
            Upload document
            <input type="file" className="hidden" />
          </label>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground focus:border-ring focus:outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All categories</option>
            <option value="Contracts">Contracts</option>
            <option value="Inventory">Inventory</option>
            <option value="Reports">Reports</option>
          </select>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="divide-y divide-border">
          <div className="bg-muted px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide">
            <div className="flex items-center gap-2">
              <span>Document</span>
              <span>Type</span>
              <span className="hidden sm:inline">Category</span>
              <span className="hidden md:inline">Uploaded by</span>
              <span className="hidden lg:inline">Date</span>
              <span className="hidden xl:inline">Size</span>
              <span></span>
              <span></span>
            </div>
          </div>
          {SAMPLE.map((row) => (
            <div key={row.id} className="flex items-center gap-4 px-4 py-3 text-sm">
              <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <span className="font-medium text-foreground">{row.title}</span>
                <span className="ml-2 text-muted-foreground">{row.type}</span>
              </div>
              <span className="hidden sm:inline text-muted-foreground">
                {row.category}
              </span>
              <span className="hidden md:inline text-muted-foreground">
                {row.uploadedBy}
              </span>
              <span className="hidden lg:inline text-muted-foreground">
                {row.uploadedAt}
              </span>
              <span className="hidden xl:inline text-muted-foreground">{row.size}</span>
              <button
                type="button"
                className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted"
              >
                <Download className="h-4 w-4" />
              </button>
              {canManage && (
                <button
                  type="button"
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        {SAMPLE.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No documents yet. Upload your first document to keep records organized.
          </div>
        )}
      </div>
    </div>
  );
}
