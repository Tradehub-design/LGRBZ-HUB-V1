export type DataTableStatus = "Healthy" | "Needs Review" | "Error";

export type DataTableRecord = {
  id: string;
  name: string;
  rows: number;
  lastUpdated: string;
  status: DataTableStatus;
};