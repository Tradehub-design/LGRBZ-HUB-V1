import { formatAccountMoney } from "../format";

const flows = [
  { label: "Deposits", value: 3750 },
  { label: "Withdrawals", value: 0 },
  { label: "Net Cash Flow", value: 3750 },
  { label: "Available Cash", value: 22770.22 },
];

export function AccountCashFlowCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Cash Flow</h2>

      <div className="mt-5 divide-y divide-slate-100">
        {flows.map((flow) => (
          <div key={flow.label} className="flex justify-between py-3">
            <span className="text-sm font-medium text-slate-600">{flow.label}</span>
            <span className="text-sm font-semibold text-slate-950">
              {formatAccountMoney(flow.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
