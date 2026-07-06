import { riskProfile } from "../mock-data";
import { formatRiskMoney } from "../format";

export function RiskProfileTable() {
  const dailyLoss =
    (riskProfile.currentBalance * riskProfile.dailyRiskPercent) / 100;

  const weeklyLoss =
    (riskProfile.currentBalance * riskProfile.weeklyRiskPercent) / 100;

  const monthlyLoss =
    (riskProfile.currentBalance * riskProfile.monthlyRiskPercent) / 100;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold">
          Risk Profile
        </h2>
      </div>

      <table className="min-w-full text-sm">
        <tbody>
          <Row title="Starting Balance" value={formatRiskMoney(riskProfile.startingBalance)} />
          <Row title="Current Balance" value={formatRiskMoney(riskProfile.currentBalance)} />
          <Row title="Daily Max Loss" value={formatRiskMoney(dailyLoss)} />
          <Row title="Weekly Max Loss" value={formatRiskMoney(weeklyLoss)} />
          <Row title="Monthly Max Loss" value={formatRiskMoney(monthlyLoss)} />
          <Row title="Risk Per Trade" value={`${riskProfile.riskPerTrade}%`} />
          <Row title="Average RR" value={`${riskProfile.averageRR}:1`} />
          <Row title="Maximum Open Trades" value={riskProfile.maxOpenTrades.toString()} />
        </tbody>
      </table>
    </div>
  );
}

function Row({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <tr className="border-b border-slate-100">
      <td className="px-5 py-4 font-medium text-slate-600">
        {title}
      </td>

      <td className="px-5 py-4 text-right font-semibold">
        {value}
      </td>
    </tr>
  );
}
