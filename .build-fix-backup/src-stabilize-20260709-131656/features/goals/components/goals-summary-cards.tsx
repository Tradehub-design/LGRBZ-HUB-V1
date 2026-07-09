import { goals } from "../mock-data";
import { formatGoalMoney } from "../format";

export function GoalsSummaryCards() {
  const totalCurrent = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const monthly = goals.reduce((sum, goal) => sum + goal.monthlyContribution, 0);
  const progress = totalTarget === 0 ? 0 : (totalCurrent / totalTarget) * 100;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card title="Current Progress" value={formatGoalMoney(totalCurrent)} />
      <Card title="Target Amount" value={formatGoalMoney(totalTarget)} />
      <Card title="Monthly Contribution" value={formatGoalMoney(monthly)} />
      <Card title="Overall Progress" value={`${progress.toFixed(2)}%`} />
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="mt-3 text-2xl font-semibold text-slate-950">{value}</div>
    </div>
  );
}
