const notes = [
  "Reports can be exported as PDF, Excel or CSV.",
  "Tax reports should be reviewed before lodgement.",
  "Dividend and performance reports use current portfolio assumptions.",
];

export function ReportNotesCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">Report Notes</h2>

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
