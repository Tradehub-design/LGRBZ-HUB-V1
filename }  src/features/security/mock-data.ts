import type { SecurityEvent } from "./types";

export const securityEvents: SecurityEvent[] = [
  {
    id: "1",
    type: "Login",
    description: "Successful login from known device.",
    createdAt: "2026-07-07 09:12",
    status: "Success",
  },
  {
    id: "2",
    type: "Data Export",
    description: "Portfolio report exported as PDF.",
    createdAt: "2026-07-06 15:30",
    status: "Success",
  },
  {
    id: "3",
    type: "Settings",
    description: "Price alert preferences updated.",
    createdAt: "2026-07-05 11:48",
    status: "Success",
  },
];
