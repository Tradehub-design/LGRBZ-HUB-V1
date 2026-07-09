const loginHistory = [
  {
    device: "MacBook Pro",
    location: "Sydney, Australia",
    time: "07 Jul 2026 09:12",
  },
  {
    device: "iPhone",
    location: "Newcastle, Australia",
    time: "06 Jul 2026 19:45",
  },
  {
    device: "Windows PC",
    location: "Sydney, Australia",
    time: "05 Jul 2026 08:30",
  },
];

export function LoginHistoryCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Login History
      </h2>

      <div className="mt-5 space-y-3">
        {loginHistory.map((login) => (
          <div key={login.time} className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="flex justify-between">
              <span className="font-semibold">{login.device}</span>
              <span className="text-xs text-slate-500">{login.time}</span>
            </div>

            <div className="mt-1 text-sm text-slate-500">
              {login.location}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}