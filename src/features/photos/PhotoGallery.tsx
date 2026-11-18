import { useState, type FormEvent } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Image, Plus, X, Calendar, Filter } from "lucide-react";
import { getDb, save, today, uid, type Photo } from "../../lib/db";
import { useAuth } from "../auth/AuthProvider";

const INPUT =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none";

export function PhotoGallery() {
  const { user } = useAuth();
  const canManage = user?.role === "owner";
  const photos = useLiveQuery(() => getDb().photos.orderBy("date").reverse().toArray(), []) ?? [];
  const flocks = useLiveQuery(() => getDb().flocks.toArray(), []) ?? [];
  const [filter, setFilter] = useState("all");
  const [adding, setAdding] = useState(false);
  const [caption, setCaption] = useState("");
  const [flockId, setFlockId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visible = filter === "all" ? photos : photos.filter((p) => p.flockId === filter);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!file) {
      setError("Choose a photo first.");
      return;
    }
    if (!caption.trim()) {
      setError("Add a short caption.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const dataUrl = await readFile(file);
      if (!dataUrl) return;
      const record: Photo = {
        id: uid(),
        flockId: flockId || undefined,
        date: today(),
        caption: caption.trim(),
        dataUrl,
      };
      await save("photos", record, user?.name ?? "Unknown", "added photo");
      setCaption("");
      setFlockId("");
      setFile(null);
      setPreview(null);
      setAdding(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">Photos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Snapshot key moments — flock checks, housing, deliveries. Stored locally and queued for
            sync.
          </p>
        </div>
        {canManage && (
          <button
            type="button"
            onClick={() => setAdding((v) => !v)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-secondary"
          >
            {adding ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {adding ? "Cancel" : "Add photo"}
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <select
          className="rounded-lg border border-input bg-background py-2 px-3 text-sm text-foreground focus:border-ring focus:outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All flocks</option>
          {flocks.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      {adding && canManage && (
        <form
          onSubmit={submit}
          className="space-y-4 rounded-lg border border-border bg-card p-5 shadow-sm"
        >
          <div className="space-y-2">
            <label className="block space-y-1">
              <span className="block text-sm font-medium text-foreground">Caption</span>
              <input
                className={INPUT}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Layers House A — litter and feeders"
              />
            </label>
            <label className="block space-y-1">
              <span className="block text-sm font-medium text-foreground">
                Flock (optional)
              </span>
              <select
                className={INPUT}
                value={flockId}
                onChange={(e) => setFlockId(e.target.value)}
              >
                <option value="">Unassigned</option>
                {flocks.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-2">
              <span className="block text-sm font-medium text-foreground">Photo</span>
              {preview ? (
                <div className="flex items-start gap-3">
                  <img
                    src={preview}
                    alt="preview"
                    className="h-24 w-32 rounded-lg border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-primary file:text-primary-foreground hover:file:bg-secondary"
                  onChange={(e) => {
                    const n = e.target.files?.[0] ?? null;
                    setFile(n);
                    if (n) readFile(n).then(setPreview);
                  }}
                />
              )}
            </label>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={saving || !file}
            className="rounded-lg bg-success px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-success/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save photo"}
          </button>
        </form>
      )}

      {visible.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center shadow-sm">
          <Image className="mx-auto h-8 w-8 text-muted" />
          <p className="mt-2 text-sm text-muted-foreground">
            No photos yet. Add your first snapshot to start building the record.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((photo) => (
            <div
              key={photo.id}
              className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"
            >
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={photo.dataUrl}
                  alt={photo.caption}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="px-4 py-3">
                <p className="font-medium text-foreground truncate">{photo.caption}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {photo.date}
                  {photo.flockId && (
                    <>
                      <span className="mx-1">·</span>
                      <span className="truncate">
                        {flocks.find((f) => f.id === photo.flockId)?.name ?? "Unknown flock"}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

async function readFile(file: File): Promise<string | null> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type || "image/png" });
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}
