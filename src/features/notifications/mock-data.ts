import type { NotificationItem } from "./types";

export const notifications: NotificationItem[] = [
  {
    id: "1",
    title: "NDQ target alert",
    message: "NDQ is approaching your target price.",
    type: "Price Alert",
    createdAt: "2026-07-07 10:30",
    read: false,
  },
  {
    id: "2",
    title: "Dividend payment",
    message: "VAS dividend forecast has been updated.",
    type: "Dividend",
    createdAt: "2026-07-06 15:20",
    read: true,
  },
  {
    id: "3",
    title: "Monthly report ready",
    message: "Your monthly portfolio report is ready.",
    type: "Report",
    createdAt: "2026-07-05 09:10",
    read: false,
  },
];