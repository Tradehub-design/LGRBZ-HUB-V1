import {
  MarketDataReliabilityCentre,
} from "@/components/market-data/MarketDataReliabilityCentre";

export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

export default function MarketDataHealthPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <MarketDataReliabilityCentre />
    </div>
  );
}
