const notes = [
  {
    title: "NDQ concentration",
    body: "NDQ remains one of the largest growth positions. Review before adding more.",
  },
  {
    title: "VAS contribution option",
    body: "VAS can be prioritised if the goal is to increase broad market exposure.",
  },
  {
    title: "Single stock risk",
    body: "NAB and COH should remain monitored separately from ETF holdings.",
  },
];

export function HoldingsNotesCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Holding Notes
      </h2>

      <div className="mt-5 space-y-3">
        {notes.map((note) => (
          <div key={note.title} className="rounded-xl bg-slate-50 px-4 py-3">
            <div className="text-sm font-semibold text-slate-950">
              {note.title}
            </div>
            <p className="mt-1 text-sm text-slate-500">{note.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
