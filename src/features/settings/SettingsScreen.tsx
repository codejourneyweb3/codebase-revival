import { useAuth } from "../auth/AuthProvider";
import { User, Bell, Shield, Users, FileText, LogOut } from "lucide-react";
export function SettingsScreen() {
  const { user, logout } = useAuth();
  const isOwner = user?.role === "owner";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, farm preferences, and access.
        </p>
      </div>

      <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-semibold text-foreground">Profile</h2>
        </div>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Name</dt>
            <dd className="mt-0.5 font-medium text-foreground">{user?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Email</dt>
            <dd className="mt-0.5 font-medium text-foreground">{user?.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Role</dt>
            <dd className="mt-0.5">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${isOwner ? "bg-primary text-primary-foreground" : "bg-secondary text-primary-foreground"}`}
              >
                {isOwner ? "Owner" : "Farm Manager"}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Farm</dt>
            <dd className="mt-0.5 font-medium text-foreground">
              {user?.farmName ?? "Kuku Farm"}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-warning" />
          <h2 className="font-display text-lg font-semibold text-foreground">
            Preferences
          </h2>
        </div>
        <div className="space-y-3">
          <ToggleRow label="Low stock alerts" defaultOn />
          <ToggleRow label="Vaccine expiry reminders" defaultOn />
          <ToggleRow label="Daily report reminders" defaultOn={false} />
          <div className="pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Units are set per the design guidelines: kg for feed and weights, UGX whole numbers
              for money.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-secondary" />
          <h2 className="font-display text-lg font-semibold text-foreground">
            Access & security
          </h2>
        </div>
        <div className="space-y-3">
          {isOwner ? (
            <>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg bg-background px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted"
              >
                <Users className="h-5 w-5 text-muted-foreground" />
                <span>Manage users and roles</span>
                <span className="ml-auto text-xs text-muted-foreground">Owner only</span>
              </button>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg bg-background px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted"
              >
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span>Audit log</span>
                <span className="ml-auto text-xs text-muted-foreground">Owner only</span>
              </button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              User management and audit logs are restricted to the farm owner.
            </p>
          )}
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive transition-colors hover:bg-destructive/10"
            onClick={() => logout()}
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </section>
    </div>
  );
}

function ToggleRow({ label, defaultOn }: { label: string; defaultOn?: boolean }) {
  return (
    <label className="flex items-center justify-between rounded-lg bg-background px-4 py-3 cursor-pointer">
      <span className="text-sm text-foreground">{label}</span>
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
        defaultChecked={defaultOn}
      />
    </label>
  );
}
