const history = [
  {
    id: "1",
    broker: "CommSec",
    time: "2026-07-07 09:12",
    result: "Success",
    imported: 12,
  },
  {
    id: "2",
    broker: "CommSec Pocket",
    time: "2026-07-07 09:08",
    result: "Success",
    imported: 4,
  },
  {
    id: "3",
    broker: "CommSec",
    time: "2026-07-06 18:30",
    result: "Success",
    imported: 0,
  },
];

export function SyncHistoryCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Sync History</h2>

      <div className="mt-5 divide-y divide-slate-100">
        {history.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-3">
            <div>
              <div className="text-sm font-semibold text-slate-950">
                {item.broker}
              </div>
              <div className="text-xs text-slate-500">{item.time}</div>
            </div>

            <div className="text-right">
              <div className="text-sm font-semibold text-emerald-700">
                {item.result}
              </div>
              <div className="text-xs text-slate-500">
                {item.imported} imported
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
