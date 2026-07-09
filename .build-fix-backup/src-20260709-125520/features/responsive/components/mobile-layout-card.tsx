const items = [
  "Stack cards vertically on mobile",
  "Allow horizontal scroll for wide tables",
  "Keep buttons full width on small screens",
  "Use compact spacing below 640px",
];

export function MobileLayoutCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Mobile Layout Rules
      </h2>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item} className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}