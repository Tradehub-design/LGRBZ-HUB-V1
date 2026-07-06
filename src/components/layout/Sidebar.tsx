"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import { SidebarNavItem } from "@/components/layout/SidebarNavItem";
import { NAV_GROUPS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { useSettingsStore } from "@/store/settingsStore";

export function Sidebar() {
  const collapsed = useSettingsStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useSettingsStore((state) => state.toggleSidebar);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-dvh border-r border-white/10 bg-slate-950/80 backdrop-blur-2xl transition-all duration-300 lg:block",
        collapsed ? "w-[92px]" : "w-[286px]",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-20 items-center justify-between px-5">
          <Logo collapsed={collapsed} />
          {!collapsed ? (
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          ) : null}
        </div>

        {collapsed ? (
          <div className="px-5 pb-3">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        ) : null}

        <nav className="flex-1 space-y-6 overflow-y-auto px-4 pb-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.id}>
              {!collapsed ? (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                  {group.label}
                </p>
              ) : null}

              <div className="space-y-1">
                {group.items.map((item) => (
                  <SidebarNavItem key={item.id} item={item} collapsed={collapsed} />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
