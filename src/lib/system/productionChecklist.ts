export type ProductionChecklistStatus =
  | "complete"
  | "partial"
  | "planned"
  | "pending"
  | "review";

export interface ProductionChecklistItem {
  id: string;
  title: string;
  label: string;
  category: string;
  area: string;
  status: ProductionChecklistStatus;
  description?: string;
  owner?: string;
}

export const PRODUCTION_CHECKLIST: ProductionChecklistItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    label: "Dashboard",
    category: "Core",
    area: "Core",
    status: "complete",
    description: "Summary dashboard with portfolio, income, risk and watchlist overview.",
  },
  {
    id: "portfolio-engine",
    title: "Portfolio Engine",
    label: "Portfolio Engine",
    category: "Core",
    area: "Core",
    status: "complete",
    description: "Holdings, transaction calculations and portfolio summary.",
  },
  {
    id: "analytics",
    title: "Analytics",
    label: "Analytics",
    category: "Reporting",
    area: "Reporting",
    status: "partial",
    description: "Performance, allocation and income analytics.",
  },
  {
    id: "broker-sync",
    title: "Broker Sync",
    label: "Broker Sync",
    category: "Integrations",
    area: "Integrations",
    status: "planned",
    description: "Future live broker integration.",
  },
];
