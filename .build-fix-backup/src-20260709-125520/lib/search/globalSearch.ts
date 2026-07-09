export type GlobalSearchItem = {
  id: string;
  title: string;
  href: string;
  type: string;
};

export function globalSearch(query: string): GlobalSearchItem[] {
  const q = query.toLowerCase();

  return [
    { id: "dashboard", title: "Dashboard", href: "/", type: "page" },
    { id: "holdings", title: "Holdings", href: "/holdings", type: "page" },
    { id: "transactions", title: "Transactions", href: "/transactions", type: "page" },
    { id: "analytics", title: "Analytics", href: "/analytics", type: "page" },
    { id: "risk", title: "Risk", href: "/risk", type: "page" },
    { id: "dividends", title: "Dividends", href: "/dividends", type: "page" },
    { id: "research", title: "Research", href: "/research", type: "page" },
    { id: "settings", title: "Settings", href: "/settings", type: "page" }
  ].filter(item => item.title.toLowerCase().includes(q));
}
