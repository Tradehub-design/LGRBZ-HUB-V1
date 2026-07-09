const checklist = [
  {
    label: "Update current prices",
    done: true,
  },
  {
    label: "Review target allocation",
    done: true,
  },
  {
    label: "Check dividend calendar",
    done: true,
  },
  {
    label: "Confirm next contribution allocation",
    done: false,
  },
  {
    label: "Review tax position",
    done: false,
  },
];

export function ReviewChecklistCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Review Checklist
      </h2>

      <div className="mt-5 space-y-3">
        {checklist.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
          >
            <span className="text-sm font-medium text-slate-700">
              {item.label}
            </span>

            <span
              className={[
                "rounded-full px-2.5 py-1 text-xs font-semibold",
                item.done
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-200 text-slate-700",
              ].join(" ")}
            >
              {item.done ? "Done" : "Pending"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
