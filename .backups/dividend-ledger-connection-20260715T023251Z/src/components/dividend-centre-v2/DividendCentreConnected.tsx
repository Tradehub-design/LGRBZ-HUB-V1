"use client";

import type {
  DividendHolding,
  DividendIntelligenceResponse,
  DividendTransaction,
} from "@/lib/dividend-data";
import {
  useDividendIntelligence,
} from "@/hooks/useDividendIntelligence";
import {
  DividendCentreEmptyState,
  DividendCentreErrorState,
  DividendCentreLoadingState,
} from "./DividendCentreStates";
import {
  ProfessionalDividendCentre,
} from "./ProfessionalDividendCentre";

type Props = {
  holdings:
    DividendHolding[];
  transactions?:
    DividendTransaction[];
  initialData?:
    DividendIntelligenceResponse | null;
  baseCurrency?: string;
};

export function DividendCentreConnected({
  holdings,
  transactions = [],
  initialData =
    null,
  baseCurrency =
    "AUD",
}: Props) {
  const intelligence =
    useDividendIntelligence(
      {
        holdings,
        transactions,
        baseCurrency,
      },
      {
        enabled:
          holdings.length >
          0,
        refreshIntervalMs:
          30 *
          60 *
          1000,
      }
    );

  const data =
    intelligence.data ||
    initialData;

  if (
    holdings.length ===
    0 &&
    !data
  ) {
    return (
      <DividendCentreEmptyState />
    );
  }

  if (
    intelligence.loading &&
    !data
  ) {
    return (
      <DividendCentreLoadingState />
    );
  }

  if (
    intelligence.error &&
    !data
  ) {
    return (
      <DividendCentreErrorState
        message={
          intelligence.error
        }
        onRetry={() =>
          void intelligence.refresh()
        }
      />
    );
  }

  if (!data) {
    return (
      <DividendCentreEmptyState />
    );
  }

  return (
    <ProfessionalDividendCentre
      data={
        data
      }
      loading={
        intelligence.loading
      }
      refreshing={
        intelligence.refreshing
      }
      onRefresh={() =>
        void intelligence.refresh()
      }
    />
  );
}
