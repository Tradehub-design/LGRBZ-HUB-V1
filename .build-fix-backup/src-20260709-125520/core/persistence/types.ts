export type SyncStatus =
  | "idle"
  | "saving"
  | "saved"
  | "offline"
  | "error"
  | "conflict";

export interface RepositoryRecord<T> {
  id: string;
  data: T;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  version: number;
  source: "local" | "remote";
}

export interface SyncEvent {
  id: string;
  entity: string;
  entityId: string;
  action: "create" | "update" | "delete" | "sync";
  timestamp: string;
  status: SyncStatus;
  message?: string;
}
