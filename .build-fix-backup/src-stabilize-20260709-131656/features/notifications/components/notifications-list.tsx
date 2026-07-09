import { notifications } from "../mock-data";

export function NotificationsList() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Notification Centre
      </h2>

      <div className="mt-5 space-y-3">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={[
              "rounded-xl px-4 py-3",
              item.read ? "bg-slate-50" : "bg-blue-50",
            ].join(" ")}
          >
            <div className="flex justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-950">
                  {item.title}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  {item.message}
                </div>
              </div>

              <span className="text-xs font-semibold text-slate-500">
                {item.type}
              </span>
            </div>

            <div className="mt-2 text-xs text-slate-500">{item.createdAt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}