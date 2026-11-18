import { ReactNode } from "react";
import { HeaderBar } from "./HeaderBar";
interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)]">
      <HeaderBar />
      <main className="flex-1 px-4 py-6 pb-24">{children}</main>
    </div>
  );
}
