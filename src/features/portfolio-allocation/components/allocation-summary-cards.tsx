const cards = [
  { label: "Total Portfolio", value: "$0.00" },
  { label: "Stocks", value: "0%" },
  { label: "ETFs", value: "0%" },
  { label: "Cash", value: "0%" },
];

export function AllocationSummaryCards() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">{card.label}</p>
          <p className="mt-2 text-2xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
