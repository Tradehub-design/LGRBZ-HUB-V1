"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import { IconRenderer } from "@/components/layout/IconRenderer";
import { NAV_GROUPS } from "@/lib/constants";
import { useUiStore } from "@/store/uiStore";

export function MobileNav() {
  const open = useUiStore((state) => state.mobileNavOpen);
  const setOpen = useUiStore((state) => state.setMobileNavOpen);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] lg:hidden">
      <button
        type="button"
        aria-label="Close menu"
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      <div className="absolute left-0 top-0 h-full w-[86vw] max-w-sm border-r border-white/10 bg-slate-950 p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <Logo />
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-8 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.id}>
              <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                {group.label}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                  >
                    <IconRenderer name={item.icon} className="h-5 w-5 text-slate-500" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
