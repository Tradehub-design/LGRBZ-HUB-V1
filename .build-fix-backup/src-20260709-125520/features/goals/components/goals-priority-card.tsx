import { goals } from "../mock-data";
import { formatGoalMoney } from "../format";

export function GoalsPriorityCard() {
  const sortedGoals = [...goals].sort((a, b) => {
    const aProgress = a.currentAmount / a.targetAmount;
    const bProgress = b.currentAmount / b.targetAmount;
    return aProgress - bProgress;
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Priority Goals
      </h2>

      <div className="mt-5 space-y-3">
        {sortedGoals.map((goal) => (
          <div key={goal.id} className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold text-slate-950">{goal.name}</span>
              <span className="text-sm font-semibold text-slate-600">
                {formatGoalMoney(goal.targetAmount - goal.currentAmount)}
              </span>
            </div>
            <div className="mt-1 text-xs text-slate-500">Remaining gap</div>
          </div>
        ))}
      </div>
    </div>
  );
}
