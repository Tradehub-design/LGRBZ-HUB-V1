export type HealthStatus = "Healthy" | "Watch" | "Risk";

export type HealthCheck = {
  id: string;
  name: string;
  score: number;
  status: HealthStatus;
  description: string;
};
