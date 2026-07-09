import { riskProfile } from "../mock-data";
import { formatRiskMoney } from "../format";

export function RiskCalculatorCard() {
  const riskAmount =
    (riskProfile.currentBalance * riskProfile.riskPerTrade) / 100;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Risk Calculator
      </h2>

      <div className="mt-6 text-center">
        <div className="text-xs uppercase text-slate-500">
          Maximum Risk Per Trade
        </div>

        <div className="mt-3 text-4xl font-bold text-slate-950">
          {formatRiskMoney(riskAmount)}
        </div>

        <div className="mt-2 text-sm text-slate-500">
          {riskProfile.riskPerTrade}% of account
        </div>
      </div>
    </div>
  );
}
