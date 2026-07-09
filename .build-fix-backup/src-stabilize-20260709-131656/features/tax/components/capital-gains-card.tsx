import { taxEvents } from "../mock-data";
import { formatTaxMoney } from "../format";

export function CapitalGainsCard() {
  const gains = taxEvents.filter((event) => event.type === "Capital Gain");
  const losses = taxEvents.filter((event) => event.type === "Capital Loss");

  const totalGains = gains.reduce((sum, event) => sum + event.amount, 0);
  const totalLosses = losses.reduce((sum, event) => sum + event.amount, 0);
  const net = totalGains + totalLosses;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Capital Gains</h2>

      <div className="mt-5 space-y-3">
        <Row label="Realised Gains" value={formatTaxMoney(totalGains)} />
        <Row label="Realised Losses" value={formatTaxMoney(totalLosses)} />
        <Row label="Net Capital Gain" value={formatTaxMoney(net)} strong />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-600">{label}</span>
      <span className={strong ? "text-sm font-semibold text-slate-950" : "text-sm font-medium"}>
        {value}
      </span>
    </div>
  );
}
