const diversification = [
  {
    metric: "Asset Classes",
    score: 84,
  },
  {
    metric: "Countries",
    score: 81,
  },
  {
    metric: "Sectors",
    score: 77,
  },
  {
    metric: "Currencies",
    score: 80,
  },
];

export function PortfolioDiversificationCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Diversification
      </h2>

      <div className="mt-5 space-y-4">
        {diversification.map((item) => (
          <div key={item.metric}>
            <div className="mb-2 flex justify-between text-sm">
              <span>{item.metric}</span>

              <span>{item.score}%</span>
            </div>

            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-slate-950"
                style={{
                  width: `${item.score}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
