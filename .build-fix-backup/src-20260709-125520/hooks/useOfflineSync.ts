"use client";

import { useEffect } from "react";
import { useSyncStore } from "@/store/sync/syncStore";

export default function useOfflineSync() {
  const { setStatus, addEvent } = useSyncStore();

  useEffect(() => {
    function update() {
      const online = navigator.onLine;

      setStatus(online ? "idle" : "offline");

      addEvent({
        id: crypto.randomUUID(),
        entity: "system",
        entityId: "network",
        action: "sync",
        timestamp: new Date().toISOString(),
        status: online ? "idle" : "offline",
        message: online
          ? "Connection restored"
          : "Offline mode enabled"
      });
    }

    window.addEventListener("online", update);
    window.addEventListener("offline", update);

    update();

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, [setStatus, addEvent]);
}
