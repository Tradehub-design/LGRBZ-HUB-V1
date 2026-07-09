import { formatMoney } from "../format";

const currencies = [
  {
    code: "AUD",
    value: 92060.72,
    percentage: 71.69,
  },
  {
    code: "USD",
    value: 36360,
    percentage: 28.31,
  },
];

export function CurrencyExposureCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Currency Exposure
      </h2>

      <div className="mt-5 space-y-4">
        {currencies.map((currency) => (
          <div key={currency.code}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">
                {currency.code}
              </span>
              <span className="text-slate-500">
                {currency.percentage.toFixed(2)}%
              </span>
            </div>

            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-slate-950"
                style={{ width: `${currency.percentage}%` }}
              />
            </div>

            <div className="mt-1 text-xs text-slate-500">
              {formatMoney(currency.value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
