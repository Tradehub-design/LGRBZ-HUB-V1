import { formatMoney } from "../format";

const incomeForecast = [
  {
    label: "Next 3 Months",
    value: 740.2,
  },
  {
    label: "Next 6 Months",
    value: 1480.4,
  },
  {
    label: "Next 12 Months",
    value: 2960.8,
  },
];

export function IncomeForecastCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Income Forecast
      </h2>

      <div className="mt-5 grid gap-3">
        {incomeForecast.map((item) => (
          <div
            key={item.label}
            className="rounded-xl bg-slate-50 px-4 py-4"
          >
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {item.label}
            </div>
            <div className="mt-2 text-xl font-semibold text-slate-950">
              {formatMoney(item.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
