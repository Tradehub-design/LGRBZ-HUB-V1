import type { HealthCheck } from "./types";

export const healthChecks: HealthCheck[] = [
  {
    id: "1",
    name: "Diversification",
    score: 82,
    status: "Healthy",
    description: "Portfolio has exposure across ETFs, shares and cash.",
  },
  {
    id: "2",
    name: "Concentration Risk",
    score: 68,
    status: "Watch",
    description: "Top holdings are carrying a meaningful part of portfolio value.",
  },
  {
    id: "3",
    name: "Cash Buffer",
    score: 74,
    status: "Watch",
    description: "Cash is acceptable but below the preferred target.",
  },
  {
    id: "4",
    name: "Currency Exposure",
    score: 79,
    status: "Healthy",
    description: "AUD and USD exposure is reasonably balanced.",
  },
];
