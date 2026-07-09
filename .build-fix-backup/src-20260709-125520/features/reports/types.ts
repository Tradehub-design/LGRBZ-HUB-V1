export type ReportType =
  | "Portfolio"
  | "Tax"
  | "Dividend"
  | "Performance"
  | "Allocation";

export type ReportStatus = "Ready" | "Generating" | "Completed" | "Failed";

export type ReportItem = {
  id: string;
  name: string;
  type: ReportType;
  createdAt: string;
  format: "PDF" | "Excel" | "CSV";
  status: ReportStatus;
};
