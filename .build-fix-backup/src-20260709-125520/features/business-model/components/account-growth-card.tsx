import { riskProfile } from "../mock-data";
import { formatRiskMoney } from "../format";

export function AccountGrowthCard() {
  const growth =
    riskProfile.currentBalance -
    riskProfile.startingBalance;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Account Growth
      </h2>

      <div className="mt-6">
        <div className="text-4xl font-bold text-emerald-700">
          {formatRiskMoney(growth)}
        </div>

        <div className="mt-2 text-sm text-slate-500">
          Growth since account started.
        </div>
      </div>
    </div>
  );
}
