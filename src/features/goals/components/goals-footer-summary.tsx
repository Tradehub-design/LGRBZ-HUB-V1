import { goals } from "../mock-data";
import { formatGoalMoney } from "../format";

export function GoalsFooterSummary() {
  const current = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const target = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const monthly = goals.reduce((sum, goal) => sum + goal.monthlyContribution, 0);
  const progress = target === 0 ? 0 : (current / target) * 100;

  return (
    <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm">
      <div className="grid gap-4 md:grid-cols-4">
        <Metric title="Current" value={formatGoalMoney(current)} />
        <Metric title="Target" value={formatGoalMoney(target)} />
        <Metric title="Monthly" value={formatGoalMoney(monthly)} />
        <Metric title="Progress" value={`${progress.toFixed(2)}%`} />
      </div>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase text-slate-400">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
