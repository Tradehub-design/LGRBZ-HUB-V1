import { AssetLogo } from "@/components/workspace/asset-logo";
import { formatMoney, formatPercent } from "@/lib/portfolio-engine/format";

type HoldingDetail = {
  id: string;
  ticker: string;
  sector: string;
  platform: string;
  quantity: number;
  marketValueAud: number;
  unrealisedPlAud: number;
  unrealisedPlPercent: number;
  portfolioWeightPercent: number;
};

export function HoldingDetailCard({ holding }: { holding: HoldingDetail }) {
  const positive = holding.unrealisedPlAud >= 0;

  return (
    <div className="rounded-2xl border border-[#173047] bg-[#071827] p-4 shadow-xl transition hover:-translate-y-0.5 hover:border-sky-600">
      <div className="flex items-center gap-3">
        <AssetLogo symbol={holding.ticker} size="lg" />
        <div>
          <p className="text-xl font-semibold text-white">{holding.ticker}</p>
          <p className="text-xs text-slate-500">{holding.sector} · {holding.platform}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm">
        <Row label="Market Value" value={formatMoney(holding.marketValueAud, 2)} />
        <Row label="Weight" value={formatPercent(holding.portfolioWeightPercent)} />
        <Row
          label="Unrealised P/L"
          value={`${formatMoney(holding.unrealisedPlAud, 2)} · ${formatPercent(holding.unrealisedPlPercent)}`}
          tone={positive ? "green" : "rose"}
        />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "green" | "rose";
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-800 pb-2 last:border-0 last:pb-0">
      <span className="text-slate-400">{label}</span>
      <span className={tone === "green" ? "font-semibold text-emerald-300" : tone === "rose" ? "font-semibold text-rose-300" : "font-semibold text-white"}>
        {value}
      </span>
    </div>
  );
}
