const shortcuts = [
  {
    name: "Holdings",
    href: "/holdings",
  },

  {
    name: "Performance",
    href: "/performance",
  },

  {
    name: "Reports",
    href: "/reports",
  },

  {
    name: "Dividend Forecast",
    href: "/dividend-forecast",
  },

  {
    name: "Portfolio Health",
    href: "/portfolio-health",
  },

  {
    name: "Watchlist",
    href: "/watchlist",
  },
];

export function QuickNavigationCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Quick Navigation
      </h2>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {shortcuts.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold hover:bg-slate-100"
          >
            {item.name}
          </a>
        ))}
      </div>
    </div>
  );
}
