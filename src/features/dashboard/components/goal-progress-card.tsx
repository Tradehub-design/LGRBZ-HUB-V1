import { formatMoney } from "../format";

const goals = [
  {
    name: "Long Term Portfolio",
    current: 128420.72,
    target: 250000,
  },
  {
    name: "Baby Investment Fund",
    current: 7820.4,
    target: 50000,
  },
  {
    name: "Cash Buffer",
    current: 20320,
    target: 30000,
  },
];

export function GoalProgressCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Goal Progress</h2>

      <div className="mt-5 space-y-5">
        {goals.map((goal) => {
          const percentage = Math.min((goal.current / goal.target) * 100, 100);

          return (
            <div key={goal.name}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-slate-950">
                    {goal.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatMoney(goal.current)} / {formatMoney(goal.target)}
                  </div>
                </div>

                <div className="text-sm font-semibold text-slate-950">
                  {percentage.toFixed(1)}%
                </div>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-slate-950"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
