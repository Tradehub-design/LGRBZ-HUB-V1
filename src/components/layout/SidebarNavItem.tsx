"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconRenderer } from "@/components/layout/IconRenderer";
import { cn } from "@/lib/cn";
import type { NavItem } from "@/types/navigation";

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
      title={collapsed ? item.label : undefined}
      className={cn(
        "group flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition",
        active
          ? "bg-[#1f8cff] text-white shadow-[0_10px_28px_rgba(31,140,255,0.28)]"
          : "text-slate-400 hover:bg-[#10263b] hover:text-white",
        collapsed && "justify-center px-0",
      )}
    >
      <IconRenderer
        name={item.icon}
        className={cn("h-4.5 w-4.5 shrink-0", active ? "text-white" : "text-slate-500 group-hover:text-white")}
      />

      {!collapsed ? <span className="min-w-0 flex-1 truncate">{item.label}</span> : null}
    </Link>
  );
}
