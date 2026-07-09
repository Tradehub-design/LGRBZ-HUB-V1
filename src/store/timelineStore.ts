import { create } from "zustand";

export type TimelineEvent = {
  id: string;
  title: string;
  date: string;
  detail?: string;
};

export const useTimelineStore = create<{
  events: TimelineEvent[];
  setEvents: (events: TimelineEvent[]) => void;
}>((set) => ({
  events: [],
  setEvents: (events) => set({ events }),
}));
