const devices = [
  {
    name: "MacBook Pro",
    browser: "Chrome",
    active: true,
  },
  {
    name: "iPhone 16 Pro",
    browser: "Safari",
    active: true,
  },
  {
    name: "Windows Desktop",
    browser: "Edge",
    active: false,
  },
];

export function ConnectedDevicesCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Connected Devices
      </h2>

      <div className="mt-5 space-y-3">
        {devices.map((device) => (
          <div
            key={device.name}
            className="flex justify-between rounded-xl bg-slate-50 px-4 py-3"
          >
            <div>
              <div className="font-semibold">
                {device.name}
              </div>

              <div className="text-xs text-slate-500">
                {device.browser}
              </div>
            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                device.active
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {device.active ? "Active" : "Inactive"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}