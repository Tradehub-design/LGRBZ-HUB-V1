import { create } from "zustand";
import type {
  SyncEvent,
  SyncStatus
} from "@/core/persistence/types";

interface SyncState {
  status: SyncStatus;
  events: SyncEvent[];
  setStatus: (status: SyncStatus) => void;
  addEvent: (event: SyncEvent) => void;
}

export const useSyncStore = create<SyncState>((set, get) => ({
  status: "idle",
  events: [],
  setStatus: status => set({ status }),
  addEvent: event =>
    set({
      events: [
        event,
        ...get().events
      ].slice(0, 100)
    })
}));
