"use client";

import { useMemo } from "react";
import { useSettingsStore } from "@/store/settingsStore";

export function useActiveUser() {
  const users = useSettingsStore((state) => state.users);
  const activeUserId = useSettingsStore((state) => state.activeUserId);

  return useMemo(() => {
    return users.find((user) => user.id === activeUserId) ?? users[0] ?? null;
  }, [activeUserId, users]);
}
