const notes = [
  "Capital gains and losses are grouped by tax year.",
  "Dividend income should be reconciled with broker statements.",
  "Brokerage fees are tracked separately for reporting.",
];

export function TaxNotesCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Tax Notes</h2>

      <div className="mt-5 space-y-3">
        {notes.map((note) => (
          <div key={note} className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            {note}
          </div>
        ))}
      </div>
    </div>
  );
}
