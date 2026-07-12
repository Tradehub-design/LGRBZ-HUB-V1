"use client";

import {
  CalendarDays,
  CircleDollarSign,
  History,
  PieChart,
  ShieldCheck,
  Star,
  TrendingUp,
} from "lucide-react";
import {
  createDashboardExecutiveMetrics,
  createDashboardQuickActions,
} from "./createDashboardExecutivePresentation";
import {
  DashboardExecutiveShell,
} from "./DashboardExecutiveShell";
import {
  DashboardSectionCard,
} from "./DashboardSectionCard";

export function DashboardV2FoundationPreview() {
  const snapshot = {
    asOf:
      new Date().toISOString(),
    portfolioValue: null,
    dailyGainLoss: null,
    dailyGainLossPercent: null,
    totalReturn: null,
    totalReturnPercent: null,
    availableCash: null,
    investedCapital: null,
    unrealisedGainLoss: null,
    realisedGainLoss: null,
    dividendIncome: null,
    portfolioHealthScore: null,
    riskScore: null,
    currency:
      "AUD",
  };

  return (
    <DashboardExecutiveShell
      title="Portfolio Dashboard"
      subtitle="Executive overview powered by the existing Transaction Ledger and frozen portfolio engines."
      asOf={
        snapshot.asOf
      }
      metrics={
        createDashboardExecutiveMetrics(
          snapshot
        )
      }
      quickActions={
        createDashboardQuickActions()
      }
      alerts={[]}
    >
      <DashboardSectionCard
        title="Portfolio Performance"
        eyebrow="Performance"
        description="Portfolio value and return history will connect to the existing Dashboard Engine."
        icon={
          TrendingUp
        }
        size="xl"
        empty
        emptyTitle="Performance connection pending"
        emptyDescription="Dashboard 2.0 Bash 2 will connect this panel to the existing ledger-driven dashboard data."
      >
        <div />
      </DashboardSectionCard>

      <DashboardSectionCard
        title="Portfolio Allocation"
        eyebrow="Exposure"
        description="Asset, sector and currency allocation summary."
        icon={
          PieChart
        }
        size="md"
        empty
      >
        <div />
      </DashboardSectionCard>

      <DashboardSectionCard
        title="Recent Transactions"
        eyebrow="Ledger Activity"
        description="Most recent ledger entries."
        icon={
          History
        }
        size="lg"
        empty
      >
        <div />
      </DashboardSectionCard>

      <DashboardSectionCard
        title="Upcoming Dividends"
        eyebrow="Income"
        description="Expected and announced dividend payments."
        icon={
          CircleDollarSign
        }
        size="lg"
        empty
      >
        <div />
      </DashboardSectionCard>

      <DashboardSectionCard
        title="Portfolio Health"
        eyebrow="Health"
        description="Diversification, concentration and data-quality summary."
        icon={
          ShieldCheck
        }
        size="md"
        empty
      >
        <div />
      </DashboardSectionCard>

      <DashboardSectionCard
        title="Watchlist Highlights"
        eyebrow="Research"
        description="Key watchlist opportunities and risks."
        icon={
          Star
        }
        size="md"
        empty
      >
        <div />
      </DashboardSectionCard>

      <DashboardSectionCard
        title="Upcoming Events"
        eyebrow="Calendar"
        description="Earnings, ex-dividend dates and market events."
        icon={
          CalendarDays
        }
        size="md"
        empty
      >
        <div />
      </DashboardSectionCard>
    </DashboardExecutiveShell>
  );
}
