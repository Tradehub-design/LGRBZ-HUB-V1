import { goals } from "../mock-data";
import { formatGoalMoney } from "../format";

export function GoalsContributionCard() {
  const totalMonthly = goals.reduce(
    (sum, goal) => sum + goal.monthlyContribution,
    0
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Contribution Plan
      </h2>

      <div className="mt-5 text-3xl font-semibold text-slate-950">
        {formatGoalMoney(totalMonthly)}
      </div>

      <div className="mt-1 text-sm text-slate-500">per month</div>

      <div className="mt-5 divide-y divide-slate-100">
        {goals.map((goal) => (
          <div key={goal.id} className="flex justify-between py-3">
            <span className="text-sm font-medium text-slate-600">
              {goal.name}
            </span>
            <span className="text-sm font-semibold text-slate-950">
              {formatGoalMoney(goal.monthlyContribution)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
