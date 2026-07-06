import { riskProfile } from "../mock-data";
import { formatRiskMoney } from "../format";

export function RiskSummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card
        title="Starting Balance"
        value={formatRiskMoney(riskProfile.startingBalance)}
      />

      <Card
        title="Current Balance"
        value={formatRiskMoney(riskProfile.currentBalance)}
      />

      <Card
        title="Risk / Trade"
        value={`${riskProfile.riskPerTrade}%`}
      />

      <Card
        title="Average R:R"
        value={`${riskProfile.averageRR}:1`}
      />
    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>

      <div className="mt-3 text-2xl font-semibold text-slate-950">
        {value}
      </div>
    </div>
  );
}
