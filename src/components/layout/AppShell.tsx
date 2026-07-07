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
    <div className="min-h-dvh bg-[#061421] text-slate-100">
      <Sidebar />
      <MobileNav />
      <CommandPalette />

      <div className={cn("min-h-dvh transition-all duration-300", collapsed ? "lg:pl-[84px]" : "lg:pl-[264px]")}>
        <Topbar />
        <main className="w-full px-4 py-4 md:px-6 lg:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
