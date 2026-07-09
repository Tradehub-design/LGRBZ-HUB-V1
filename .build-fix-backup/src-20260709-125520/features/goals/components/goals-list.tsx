import { goals } from "../mock-data";
import { formatGoalMoney } from "../format";

export function GoalsList() {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      {goals.map((goal) => {
        const progress =
          goal.targetAmount === 0
            ? 0
            : Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);

        return (
          <div
            key={goal.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  {goal.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {goal.description}
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                {goal.status}
              </span>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-500">
                  {formatGoalMoney(goal.currentAmount)}
                </span>
                <span className="font-semibold text-slate-950">
                  {formatGoalMoney(goal.targetAmount)}
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-slate-950"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-2 text-sm font-semibold text-slate-950">
                {progress.toFixed(2)}% complete
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Monthly</span>
                <span className="font-semibold text-slate-950">
                  {formatGoalMoney(goal.monthlyContribution)}
                </span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="text-slate-500">Target Date</span>
                <span className="font-semibold text-slate-950">
                  {goal.targetDate}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
