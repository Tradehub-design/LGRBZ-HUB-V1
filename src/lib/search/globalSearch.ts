export type SearchResult = {
  id: string;
  title: string;
  description?: string;
  href: string;
  category?: string;
};

const WORKSPACE_RESULTS: SearchResult[] = [
  { id: "dashboard", title: "Dashboard", href: "/dashboard", category: "Core" },
  { id: "holdings", title: "Holdings", href: "/holdings", category: "Portfolio" },
  { id: "transactions", title: "Transactions", href: "/transactions", category: "Portfolio" },
  { id: "analytics", title: "Analytics", href: "/analytics", category: "Reports" },
  { id: "dividends", title: "Dividends", href: "/dividends", category: "Income" },
  { id: "income-intelligence", title: "Income Intelligence", href: "/income-intelligence", category: "Income" },
  { id: "reports", title: "Reports", href: "/reports", category: "Reports" },
  { id: "tax-centre", title: "Tax Centre", href: "/tax-centre", category: "Tax" },
  { id: "settings", title: "Settings", href: "/settings", category: "System" },
];

export function searchWorkspace(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return WORKSPACE_RESULTS;

  return WORKSPACE_RESULTS.filter((item) =>
    [item.title, item.description, item.category, item.href]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(q)
  );
}
