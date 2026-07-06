"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { IconRenderer } from "@/components/layout/IconRenderer";
import { NAV_GROUPS } from "@/lib/constants";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useUiStore } from "@/store/uiStore";

export function CommandPalette() {
  const router = useRouter();
  const commandPalette = useUiStore((state) => state.commandPalette);
  const [search, setSearch] = useState("");

  useKeyboardShortcut({ key: "k", metaKey: true }, () => commandPalette.setOpen(true));
  useKeyboardShortcut({ key: "k", ctrlKey: true }, () => commandPalette.setOpen(true));

  const items = useMemo(() => {
    return NAV_GROUPS.flatMap((group) =>
      group.items.map((item) => ({
        ...item,
        groupLabel: group.label,
      })),
    );
  }, []);

  if (!commandPalette.open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center p-4 pt-[12vh]">
      <button
        type="button"
        aria-label="Close command palette"
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={() => commandPalette.setOpen(false)}
      />

      <Command className="relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-950 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <Search className="h-5 w-5 text-slate-500" />
          <Command.Input
            value={search}
            onValueChange={setSearch}
            autoFocus
            placeholder="Search pages, holdings, transactions..."
            className="h-10 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
          <Button variant="ghost" size="icon" onClick={() => commandPalette.setOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Command.List className="max-h-[420px] overflow-y-auto p-3">
          <Command.Empty className="px-4 py-10 text-center text-sm text-slate-500">
            No results found.
          </Command.Empty>

          {NAV_GROUPS.map((group) => (
            <Command.Group
              key={group.id}
              heading={group.label}
              className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-2 [&_[cmdk-group-heading]]:pt-4 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-slate-600"
            >
              {items
                .filter((item) => item.groupLabel === group.label)
                .map((item) => (
                  <Command.Item
                    key={item.id}
                    value={`${item.label} ${item.description ?? ""}`}
                    onSelect={() => {
                      router.push(item.href);
                      commandPalette.setOpen(false);
                      setSearch("");
                    }}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-300 outline-none transition aria-selected:bg-white/8 aria-selected:text-white"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                      <IconRenderer name={item.icon} className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-white">{item.label}</p>
                      <p className="truncate text-xs text-slate-500">{item.description}</p>
                    </div>
                  </Command.Item>
                ))}
            </Command.Group>
          ))}
        </Command.List>
      </Command>
    </div>
  );
}
