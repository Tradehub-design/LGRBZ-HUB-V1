import { formatAnalyticsMoney } from "../format";

export function RealisedVsUnrealisedCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Realised vs Unrealised
      </h2>

      <div className="mt-5 grid gap-4">
        <Metric title="Realised Profit" value={2219.8} />
        <Metric title="Unrealised Profit" value={15680.72} />
      </div>
    </div>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="text-xs uppercase text-slate-500">
        {title}
      </div>

      <div className="mt-2 text-xl font-semibold text-emerald-700">
        {formatAnalyticsMoney(value)}
      </div>
    </div>
  );
}
