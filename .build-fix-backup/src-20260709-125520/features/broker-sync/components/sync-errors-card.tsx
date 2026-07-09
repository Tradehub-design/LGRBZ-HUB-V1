const errors = [
  {
    id: "1",
    title: "Missing symbol mapping",
    detail: "One imported row requires manual ticker confirmation.",
  },
  {
    id: "2",
    title: "Duplicate transaction check",
    detail: "Two rows look similar to existing transactions.",
  },
];

export function SyncErrorsCard() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
      <h2 className="text-base font-semibold text-amber-950">
        Sync Review Items
      </h2>

      <div className="mt-5 space-y-3">
        {errors.map((error) => (
          <div key={error.id} className="rounded-xl bg-white px-4 py-3">
            <div className="text-sm font-semibold text-amber-950">
              {error.title}
            </div>
            <p className="mt-1 text-sm text-amber-800">{error.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
