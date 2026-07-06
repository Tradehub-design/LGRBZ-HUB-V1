"use client";

import { Menu, Search, Wifi, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useActiveUser } from "@/hooks/useActiveUser";
import { useUiStore } from "@/store/uiStore";
import { useSettingsStore } from "@/store/settingsStore";

export function Topbar() {
  const activeUser = useActiveUser();
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);
  const commandPalette = useUiStore((state) => state.commandPalette);
  const settings = useSettingsStore((state) => state.settings);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);

    function handleOnline() {
      setOnline(true);
    }

    function handleOffline() {
      setOnline(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-slate-950/70 px-4 backdrop-blur-2xl md:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileNavOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>

        <button
          type="button"
          onClick={() => commandPalette.setOpen(true)}
          className="hidden h-11 min-w-80 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-left text-sm text-slate-500 transition hover:border-white/20 hover:bg-white/[0.05] md:flex"
        >
          <Search className="h-4 w-4" />
          Search holdings, transactions, research...
          <span className="ml-auto rounded-lg border border-white/10 px-2 py-0.5 text-[10px] text-slate-500">
            ⌘K
          </span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <Badge tone={online ? "green" : "amber"}>
          <span className="mr-1.5">{online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}</span>
          {online ? "Online" : "Offline"}
        </Badge>

        <Badge tone="blue">{settings.displayCurrency}</Badge>

        {activeUser ? (
          <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 md:flex">
            <Avatar name={activeUser.name} size="sm" />
            <div className="leading-tight">
              <p className="text-sm font-medium text-white">{activeUser.name}</p>
              <p className="text-xs text-slate-500">{activeUser.role}</p>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
