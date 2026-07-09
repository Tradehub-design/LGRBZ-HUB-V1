import type { ReportItem } from "./types";

export const reports: ReportItem[] = [
  {
    id: "1",
    name: "Monthly Portfolio Report",
    type: "Portfolio",
    createdAt: "2026-07-07 10:30",
    format: "PDF",
    status: "Completed",
  },
  {
    id: "2",
    name: "Dividend Income Report",
    type: "Dividend",
    createdAt: "2026-07-06 15:20",
    format: "Excel",
    status: "Completed",
  },
  {
    id: "3",
    name: "Tax Summary",
    type: "Tax",
    createdAt: "2026-07-05 09:10",
    format: "PDF",
    status: "Ready",
  },
];
