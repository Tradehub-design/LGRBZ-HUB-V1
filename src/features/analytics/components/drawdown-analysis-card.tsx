export function DrawdownAnalysisCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Drawdown Analysis
      </h2>

      <div className="mt-5 grid gap-3">
        <DrawdownRow
          title="Maximum Drawdown"
          value="-5.82%"
        />

        <DrawdownRow
          title="Recovery Time"
          value="14 Days"
        />

        <DrawdownRow
          title="Current Drawdown"
          value="0%"
        />
      </div>
    </div>
  );
}

function DrawdownRow({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3">
      <div className="text-xs uppercase text-slate-500">
        {title}
      </div>

      <div className="mt-2 text-xl font-semibold">
        {value}
      </div>
    </div>
  );
}
