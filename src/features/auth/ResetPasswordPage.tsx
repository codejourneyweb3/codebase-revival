import { useState, type FormEvent } from "react";

import { api } from "@/lib/api";
import { useNavigate } from "@/lib/router-compat";
import { usePageMeta } from "@/lib/use-page-meta";

export function ResetPasswordPage() {
  usePageMeta(
    "Set a new password · KukuThrive",
    "Choose a new password for your KukuThrive account.",
  );

  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api("/api/auth/password", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      void navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-lg border bg-card p-6">
        <h1 className="font-display text-xl font-semibold">Set a new password</h1>
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className="w-full rounded-lg border border-input bg-background px-3 py-2"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          disabled={saving}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save password"}
        </button>
      </form>
    </div>
  );
}
