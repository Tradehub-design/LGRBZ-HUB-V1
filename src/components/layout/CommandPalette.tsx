"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { IconRenderer } from "@/components/layout/IconRenderer";
import { NAV_GROUPS } from "@/lib/constants";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useUiStore } from "@/store/uiStore";

export function CommandPalette() {
  const router = useRouter();
  const commandPalette = useUiStore((state) => state.commandPalette);
  const [search, setSearch] = useState("");

  useKeyboardShortcut({ key: "k", metaKey: true }, () =>
    commandPalette.setOpen(true)
  );

  useKeyboardShortcut({ key: "k", ctrlKey: true }, () =>
    commandPalette.setOpen(true)
  );

  const items = useMemo(() => {
    return NAV_GROUPS.flatMap((group) =>
      group.items.map((item) => ({
        ...item,
        groupLabel: group.label,
      }))
    );
  }, []);

  const filteredItems = items.filter((item) => {
    const query = search.toLowerCase();

    return (
      item.label.toLowerCase().includes(query) ||
      (item.description ?? "").toLowerCase().includes(query)
    );
  });

  if (!commandPalette.open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center p-4 pt-[12vh]">
      <button
        type="button"
        aria-label="Close command palette"
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={() => commandPalette.setOpen(false)}
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-950 shadow-2xl">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <span className="text-slate-500">⌕</span>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            autoFocus
            placeholder="Search pages, holdings, transactions..."
            className="h-10 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => commandPalette.setOpen(false)}
          >
            ×
          </Button>
        </div>

        <div className="max-h-[420px] overflow-y-auto p-3">
          {filteredItems.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-slate-500">
              No results found.
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  router.push(item.href);
                  commandPalette.setOpen(false);
                  setSearch("");
                }}
                className="flex w-full cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-slate-300 outline-none transition hover:bg-white/10 hover:text-white"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
                  <IconRenderer name={item.icon} className="text-slate-400" />
                </div>

                <div className="min-w-0">
                  <p className="font-medium text-white">{item.label}</p>
                  <p className="truncate text-xs text-slate-500">
                    {item.description}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
