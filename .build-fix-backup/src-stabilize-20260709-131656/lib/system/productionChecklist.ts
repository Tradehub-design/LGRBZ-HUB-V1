export type ProductionChecklistStatus =
  | "complete"
  | "partial"
  | "planned";

export interface ProductionChecklistItem {
  id: string;
  title: string;
  category: string;
  status: ProductionChecklistStatus;
}

export const PRODUCTION_CHECKLIST: ProductionChecklistItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    category: "Core",
    status: "complete",
  },
  {
    id: "portfolio",
    title: "Portfolio Engine",
    category: "Core",
    status: "complete",
  },
  {
    id: "analytics",
    title: "Analytics",
    category: "Reporting",
    status: "partial",
  },
  {
    id: "broker-sync",
    title: "Broker Sync",
    category: "Integrations",
    status: "planned",
  },
];
