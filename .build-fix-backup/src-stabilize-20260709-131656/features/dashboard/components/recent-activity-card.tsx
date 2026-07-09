import { formatMoney } from "../format";

const activities = [
  {
    id: "1",
    type: "BUY",
    symbol: "NDQ",
    quantity: 10,
    price: 47.88,
    date: "2026-07-05",
  },
  {
    id: "2",
    type: "DIVIDEND",
    symbol: "VAS",
    quantity: 280,
    price: 0.72,
    date: "2026-07-03",
  },
  {
    id: "3",
    type: "BUY",
    symbol: "VAS",
    quantity: 8,
    price: 97.44,
    date: "2026-06-30",
  },
  {
    id: "4",
    type: "SELL",
    symbol: "NAB",
    quantity: 20,
    price: 37.26,
    date: "2026-06-27",
  },
];

export function RecentActivityCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Recent Activity
      </h2>

      <div className="mt-5 divide-y divide-slate-100">
        {activities.map((activity) => {
          const isBuy = activity.type === "BUY";
          const isSell = activity.type === "SELL";

          return (
            <div
              key={activity.id}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <span
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold",
                    isBuy
                      ? "bg-emerald-50 text-emerald-700"
                      : isSell
                        ? "bg-rose-50 text-rose-700"
                        : "bg-blue-50 text-blue-700",
                  ].join(" ")}
                >
                  {activity.type.slice(0, 1)}
                </span>

                <div>
                  <div className="text-sm font-semibold text-slate-950">
                    {activity.type} {activity.symbol}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(activity.date).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <div className="text-right text-sm">
                <div className="font-semibold text-slate-950">
                  {activity.quantity.toLocaleString("en-AU")} units
                </div>
                <div className="text-xs text-slate-500">
                  {formatMoney(activity.price)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
