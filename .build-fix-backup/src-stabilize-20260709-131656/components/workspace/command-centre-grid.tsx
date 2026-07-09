import { Activity, AlertTriangle, BadgeDollarSign, LineChart, ShieldCheck, Wallet } from "lucide-react";
import { formatMoney, formatPercent } from "@/lib/portfolio-engine/format";

export function CommandCentreGrid({ data }: { data: any }) {
  const widgets = [
    {
      label: "Market Value",
      value: formatMoney(data.valuation?.marketValueAud ?? 0, 2),
      helper: "Holdings only",
      icon: <LineChart className="h-5 w-5" />,
      tone: "text-sky-300 bg-sky-500/10",
    },
    {
      label: "Cash",
      value: formatMoney(data.totalCashAud ?? 0, 2),
      helper: "Available cash",
      icon: <Wallet className="h-5 w-5" />,
      tone: "text-violet-300 bg-violet-500/10",
    },
    {
      label: "Income Yield",
      value: formatPercent(data.incomeMetrics?.incomeYieldPercent ?? 0),
      helper: "Annualised",
      icon: <BadgeDollarSign className="h-5 w-5" />,
      tone: "text-emerald-300 bg-emerald-500/10",
    },
    {
      label: "Health",
      value: `${data.health?.score ?? 0}/100`,
      helper: data.health?.rating ?? "Pending",
      icon: <ShieldCheck className="h-5 w-5" />,
      tone: "text-blue-300 bg-blue-500/10",
    },
    {
      label: "Risk",
      value: `${data.risk?.riskScore ?? 0}/100`,
      helper: data.risk?.concentrationLevel ?? "Pending",
      icon: <AlertTriangle className="h-5 w-5" />,
      tone: "text-amber-300 bg-amber-500/10",
    },
    {
      label: "Activity",
      value: String(data.transactions?.length ?? 0),
      helper: "Ledger records",
      icon: <Activity className="h-5 w-5" />,
      tone: "text-slate-300 bg-slate-500/10",
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {widgets.map((widget) => (
        <div
          key={widget.label}
          className="rounded-2xl border border-[#173047] bg-[#0b1e30] p-4 transition hover:border-sky-500/70"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-400">{widget.label}</p>
              <p className="mt-2 text-xl font-semibold text-white">{widget.value}</p>
              <p className="mt-1 text-xs text-slate-500">{widget.helper}</p>
            </div>

            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${widget.tone}`}>
              {widget.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
