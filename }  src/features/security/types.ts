export type SecurityEventType =
  | "Login"
  | "Password"
  | "Data Export"
  | "Settings"
  | "Broker Access";

export type SecurityEvent = {
  id: string;
  type: SecurityEventType;
  description: string;
  createdAt: string;
  status: "Success" | "Warning" | "Blocked";
};
