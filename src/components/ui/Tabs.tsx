"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TabItem = {
  label: string;
  value: string;
  icon?: ReactNode;
};

type TabsProps = {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function Tabs({ items, value, onChange, className }: TabsProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-slate-950/60 p-1",
        className,
      )}
    >
      {items.map((item) => {
        const active = item.value === value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-xl px-3 text-sm font-medium transition",
              active
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-400 hover:bg-white/5 hover:text-white",
            )}
          >
            {item.icon}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
