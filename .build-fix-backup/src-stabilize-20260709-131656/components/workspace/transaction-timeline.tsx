import { AssetLogo } from "@/components/workspace/asset-logo";
import { StatusPill } from "@/components/workspace/status-pill";
import { formatMoney } from "@/lib/portfolio-engine/format";
import type { LedgerRow } from "@/lib/portfolio-engine/types";

export function TransactionTimeline({ transactions }: { transactions: LedgerRow[] }) {
  return (
    <div className="space-y-3">
      {transactions.slice(0, 12).map((tx) => (
        <div key={tx.id} className="flex gap-3 rounded-2xl border border-[#173047] bg-[#0b1e30] p-3">
          <AssetLogo symbol={tx.assetTicker} />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-white">{tx.assetTicker}</p>
              <StatusPill tone={toneForAction(tx.action)}>{tx.action}</StatusPill>
            </div>
            <p className="mt-1 text-xs text-slate-500">{tx.date} · {tx.platform}</p>
          </div>

          <p className="text-sm font-semibold text-white">{formatMoney(tx.totalFeesIncludedAud, 2)}</p>
        </div>
      ))}
    </div>
  );
}

function toneForAction(action: string): "green" | "blue" | "amber" | "rose" | "purple" | "neutral" {
  const lower = action.toLowerCase();

  if (lower.includes("buy")) return "green";
  if (lower.includes("sell")) return "rose";
  if (lower.includes("dividend")) return "blue";
  if (lower.includes("deposit")) return "purple";
  if (lower.includes("fee")) return "amber";

  return "neutral";
}
