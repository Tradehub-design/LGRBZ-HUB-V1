"use client";

import { Menu, Search, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useSettingsStore } from "@/store/settingsStore";
import { useUiStore } from "@/store/uiStore";

export function Topbar() {
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);
  const commandPalette = useUiStore((state) => state.commandPalette);
  const settings = useSettingsStore((state) => state.settings);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);

    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#173047] bg-[#071827]/95 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileNavOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>

        <button
          type="button"
          onClick={() => commandPalette.setOpen(true)}
          className="hidden h-10 min-w-80 items-center gap-3 rounded-lg border border-[#173047] bg-[#0b1e30] px-4 text-left text-sm text-slate-500 transition hover:border-sky-600 md:flex"
        >
          <Search className="h-4 w-4" />
          Search portfolio...
          <span className="ml-auto rounded-md border border-[#173047] px-2 py-0.5 text-[10px] text-slate-500">
            ⌘K
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Badge tone={online ? "green" : "amber"}>
          <span className="mr-1.5">{online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}</span>
          {online ? "Online" : "Offline"}
        </Badge>

        <Badge tone="blue">{settings.displayCurrency}</Badge>
      </div>
    </header>
  );
}
