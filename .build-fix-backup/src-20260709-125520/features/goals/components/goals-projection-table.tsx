import { goals } from "../mock-data";
import { formatGoalMoney } from "../format";

export function GoalsProjectionTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-950">
          Goal Projection
        </h2>
      </div>

      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-5 py-3 text-left font-semibold text-slate-600">Goal</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">Current</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">Target</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">Gap</th>
            <th className="px-5 py-3 text-right font-semibold text-slate-600">Monthly</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {goals.map((goal) => (
            <tr key={goal.id}>
              <td className="px-5 py-4 font-semibold text-slate-950">
                {goal.name}
              </td>
              <td className="px-5 py-4 text-right">
                {formatGoalMoney(goal.currentAmount)}
              </td>
              <td className="px-5 py-4 text-right">
                {formatGoalMoney(goal.targetAmount)}
              </td>
              <td className="px-5 py-4 text-right font-semibold text-slate-950">
                {formatGoalMoney(goal.targetAmount - goal.currentAmount)}
              </td>
              <td className="px-5 py-4 text-right">
                {formatGoalMoney(goal.monthlyContribution)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
