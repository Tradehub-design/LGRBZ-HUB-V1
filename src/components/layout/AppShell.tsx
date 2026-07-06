"use client";

import type { ReactNode } from "react";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { cn } from "@/lib/cn";
import { useSettingsStore } from "@/store/settingsStore";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const collapsed = useSettingsStore((state) => state.sidebarCollapsed);

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.10),transparent_28%),linear-gradient(180deg,#020617_0%,#050816_45%,#020617_100%)]" />
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:44px_44px] opacity-30" />

      <Sidebar />
      <MobileNav />
      <CommandPalette />

      <div className={cn("min-h-dvh transition-all duration-300", collapsed ? "lg:pl-[92px]" : "lg:pl-[286px]")}>
        <Topbar />
        <main className="mx-auto w-full max-w-[1680px] px-4 py-6 md:px-6 md:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
