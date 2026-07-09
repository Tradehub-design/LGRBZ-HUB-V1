import { formatMoney } from "../format";

const contributions = [
  {
    label: "Monthly ETF Plan",
    amount: 525,
    frequency: "Monthly",
  },
  {
    label: "Baby NDQ Plan",
    amount: 100,
    frequency: "Monthly",
  },
  {
    label: "Annual Top-Up",
    amount: 1000,
    frequency: "Yearly",
  },
];

export function ContributionCard() {
  const monthlyTotal = contributions
    .filter((item) => item.frequency === "Monthly")
    .reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-950">
            Contributions
          </h2>
          <p className="mt-1 text-sm text-slate-500">Planned investing flow</p>
        </div>

        <div className="text-right">
          <div className="text-xl font-semibold text-slate-950">
            {formatMoney(monthlyTotal)}
          </div>
          <div className="text-xs text-slate-500">per month</div>
        </div>
      </div>

      <div className="mt-5 divide-y divide-slate-100">
        {contributions.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
          >
            <div>
              <div className="text-sm font-semibold text-slate-950">
                {item.label}
              </div>
              <div className="text-xs text-slate-500">{item.frequency}</div>
            </div>

            <div className="text-sm font-semibold text-slate-950">
              {formatMoney(item.amount)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
