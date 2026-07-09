"use client";

import { useEffect } from "react";

export function useAutoRefresh(refresh: () => void) {
  useEffect(() => {
    refresh();

    const timer = setInterval(refresh, 60000);

    return () => clearInterval(timer);
  }, [refresh]);
}
