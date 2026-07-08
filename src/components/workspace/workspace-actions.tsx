import Link from "next/link";
import type { ReactNode } from "react";

export function WorkspaceActionButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg bg-[#1f8cff] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_28px_rgba(31,140,255,0.28)] transition hover:bg-sky-500"
    >
      {children}
    </Link>
  );
}

export function WorkspaceGhostButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-[#173047] bg-[#0b1e30] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-500 hover:text-white"
    >
      {children}
    </Link>
  );
}
