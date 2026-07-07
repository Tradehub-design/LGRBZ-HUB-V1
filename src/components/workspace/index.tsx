import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Workspace({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("min-h-screen space-y-5 bg-[#061421] text-slate-100", className)}>
      {children}
    </div>
  );
}

export function WorkspaceHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#173047] bg-[#071827] p-5 shadow-2xl">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          {eyebrow ? (
            <p className="text-xs uppercase tracking-[0.24em] text-sky-300">{eyebrow}</p>
          ) : null}
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">{title}</h1>
          {description ? <p className="mt-2 max-w-3xl text-sm text-slate-400">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </section>
  );
}

export function WorkspaceLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-[#173047] bg-[#0b1e30] px-4 py-2 text-sm font-semibold text-slate-200 hover:border-sky-500"
    >
      {children}
    </Link>
  );
}

export function WorkspaceGrid({
  children,
  columns = "xl:grid-cols-4",
}: {
  children: ReactNode;
  columns?: string;
}) {
  return <section className={cn("grid gap-3 sm:grid-cols-2", columns)}>{children}</section>;
}

export function MetricTile({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className="rounded-xl border border-[#173047] bg-[#071827] p-4 shadow-xl">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
    </div>
  );
}

export function WorkspacePanel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#173047] bg-[#071827] p-4 shadow-xl">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function ProgressRow({
  label,
  value,
  percent,
  tone = "sky",
}: {
  label: string;
  value: string;
  percent: number;
  tone?: "sky" | "emerald" | "amber" | "rose" | "violet";
}) {
  const toneClass = {
    sky: "bg-sky-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    violet: "bg-violet-500",
  }[tone];

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-400">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className={cn("h-full rounded-full", toneClass)}
          style={{ width: `${Math.min(Math.max(percent, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}
