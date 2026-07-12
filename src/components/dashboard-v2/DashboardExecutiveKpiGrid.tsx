"use client";

import {
  DashboardExecutiveMetric,
} from "./dashboardV2Types";
import {
  DashboardExecutiveKpiCard,
} from "./DashboardExecutiveKpiCard";

type Props = {
  metrics: DashboardExecutiveMetric[];
};

export function DashboardExecutiveKpiGrid({
  metrics,
}: Props) {
  if (
    metrics.length ===
    0
  ) {
    return null;
  }

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6">
      {metrics.map(
        (metric) => (
          <DashboardExecutiveKpiCard
            key={
              metric.id
            }
            metric={
              metric
            }
          />
        )
      )}
    </section>
  );
}
