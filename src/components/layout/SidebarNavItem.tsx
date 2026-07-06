"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types/navigation";
import { IconRenderer } from "@/components/layout/IconRenderer";
import { cn } from "@/lib/cn";

type SidebarNavItemProps = {
  item: NavItem;
  collapsed?: boolean;
};

export function SidebarNavItem({ item, collapsed = false }: SidebarNavItemProps) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium transition",
        active
          ? "bg-white text-slate-950 shadow-[0_14px_40px_rgba(255,255,255,0.08)]"
          : "text-slate-400 hover:bg-white/5 hover:text-white",
        collapsed && "justify-center px-0",
      )}
      title={collapsed ? item.label : undefined}
    >
      <IconRenderer
        name={item.icon}
        className={cn("h-5 w-5 shrink-0", active ? "text-slate-950" : "text-slate-500 group-hover:text-white")}
      />

      {!collapsed ? (
        <>
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          {item.badge ? (
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">
              {item.badge}
            </span>
          ) : null}
        </>
      ) : null}
    </Link>
  );
}
