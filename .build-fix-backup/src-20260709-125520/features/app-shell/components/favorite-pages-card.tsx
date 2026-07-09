const favourites = [
  "Dashboard",
  "Portfolio Health",
  "Reports",
  "Watchlist",
  "Dividend Forecast",
];

export function FavouritePagesCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold">
        Favourite Pages
      </h2>

      <div className="mt-5 flex flex-wrap gap-2">
        {favourites.map((page) => (
          <div
            key={page}
            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold"
          >
            {page}
          </div>
        ))}
      </div>
    </div>
  );
}
