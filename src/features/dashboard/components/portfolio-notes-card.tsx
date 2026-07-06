const notes = [
  {
    id: "1",
    title: "Keep NDQ as long-term growth position",
    body: "Continue regular contributions unless allocation becomes too concentrated.",
  },
  {
    id: "2",
    title: "Review single stock exposure",
    body: "NAB, COH and LIFE360 should be monitored separately from ETF positions.",
  },
  {
    id: "3",
    title: "Cash buffer target",
    body: "Current cash buffer is below the preferred $30,000 target.",
  },
];

export function PortfolioNotesCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-950">
        Portfolio Notes
      </h2>

      <div className="mt-5 space-y-3">
        {notes.map((note) => (
          <div key={note.id} className="rounded-xl bg-slate-50 px-4 py-3">
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
