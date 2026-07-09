"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { SidebarNavItem } from "@/components/layout/SidebarNavItem";
import { Button } from "@/components/ui/Button";
import { NAV_GROUPS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { useSettingsStore } from "@/store/settingsStore";

export function Sidebar() {
  const collapsed = useSettingsStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useSettingsStore((state) => state.toggleSidebar);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-dvh border-r border-[#173047] bg-[#071827] transition-all duration-300 lg:block",
        collapsed ? "w-[84px]" : "w-[264px]",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b border-[#173047] px-4">
          <Logo collapsed={collapsed} />

          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.id}>
              {!collapsed ? (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-600">
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
