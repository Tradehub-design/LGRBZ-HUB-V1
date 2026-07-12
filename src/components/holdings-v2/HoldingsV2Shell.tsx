"use client";

import {
  ReactNode,
} from "react";
import {
  HoldingsV2Header,
} from "./HoldingsV2Header";
import {
  HoldingsV2SummaryCards,
} from "./HoldingsV2SummaryCards";
import {
  HoldingsV2SummaryMetric,
} from "@/lib/holdings-v2/holdingsV2Types";

type Props = {
  asOf?: string | null;
  loading?: boolean;
  refreshing?: boolean;
  metrics: HoldingsV2SummaryMetric[];

  onRefresh?: () => void;
  onAdd?: () => void;
  onExport?: () => void;
  onSettings?: () => void;

  toolbar?: ReactNode;
  children: ReactNode;
};

export function HoldingsV2Shell({
  asOf,
  loading = false,
  refreshing = false,
  metrics,
  onRefresh,
  onAdd,
  onExport,
  onSettings,
  toolbar,
  children,
}: Props) {
  return (
    <main className="mx-auto w-full max-w-[1900px] space-y-4 px-3 pb-16 sm:px-4 lg:px-6 xl:px-8">
      <HoldingsV2Header
        asOf={
          asOf
        }
        loading={
          loading
        }
        refreshing={
          refreshing
        }
        onRefresh={
          onRefresh
        }
        onAdd={
          onAdd
        }
        onExport={
          onExport
        }
        onSettings={
          onSettings
        }
      />

      <HoldingsV2SummaryCards
        metrics={
          metrics
        }
        loading={
          loading
        }
      />

      {toolbar}

      {children}
    </main>
  );
}
