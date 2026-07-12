"use client";

import {
  BellRing,
} from "lucide-react";
import {
  DashboardExecutiveShellProps,
} from "./dashboardV2Types";
import {
  DashboardAlertSummary,
} from "./DashboardAlertSummary";
import {
  DashboardExecutiveHeader,
} from "./DashboardExecutiveHeader";
import {
  DashboardExecutiveKpiGrid,
} from "./DashboardExecutiveKpiGrid";
import {
  DashboardQuickActions,
} from "./DashboardQuickActions";
import {
  DashboardSectionCard,
} from "./DashboardSectionCard";

export function DashboardExecutiveShell({
  title,
  subtitle,
  asOf,
  loading = false,
  error = null,
  metrics = [],
  quickActions = [],
  alerts = [],
  children,
  onRefresh,
  refreshing = false,
}: DashboardExecutiveShellProps) {
  return (
    <main className="mx-auto w-full max-w-[1800px] space-y-4 px-3 pb-12 sm:px-4 lg:px-6 xl:px-8">
      <DashboardExecutiveHeader
        title={
          title
        }
        subtitle={
          subtitle
        }
        asOf={
          asOf
        }
        loading={
          loading
        }
        error={
          error
        }
        onRefresh={
          onRefresh
        }
        refreshing={
          refreshing
        }
      />

      <DashboardExecutiveKpiGrid
        metrics={
          metrics
        }
      />

      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-4">
          <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-12">
            {children}
          </div>
        </div>

        <aside className="min-w-0 space-y-4">
          <DashboardQuickActions
            actions={
              quickActions
            }
          />

          <DashboardSectionCard
            title="Alerts & Notifications"
            eyebrow="Attention Required"
            description="Portfolio risk, data quality and upcoming-event notifications."
            icon={
              BellRing
            }
            size="full"
          >
            <DashboardAlertSummary
              alerts={
                alerts
              }
            />
          </DashboardSectionCard>
        </aside>
      </div>
    </main>
  );
}
