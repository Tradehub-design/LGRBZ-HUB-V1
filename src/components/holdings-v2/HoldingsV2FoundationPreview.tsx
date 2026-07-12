"use client";

import {
  adaptHoldingsV2Data,
} from "@/lib/holdings-v2/adaptHoldingsV2Data";
import {
  createHoldingsV2Metrics,
} from "@/lib/holdings-v2/createHoldingsV2Metrics";
import {
  HoldingsV2EmptyState,
} from "./HoldingsV2States";
import {
  HoldingsV2Shell,
} from "./HoldingsV2Shell";

export function HoldingsV2FoundationPreview() {
  const data =
    adaptHoldingsV2Data({
      holdings: [],
    });

  return (
    <HoldingsV2Shell
      asOf={
        data.summary.asOf
      }
      metrics={
        createHoldingsV2Metrics(
          data.summary
        )
      }
    >
      <HoldingsV2EmptyState />
    </HoldingsV2Shell>
  );
}
