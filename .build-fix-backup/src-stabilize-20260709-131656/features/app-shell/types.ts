export interface GlobalSearchResult {
  id: string;
  title: string;
  subtitle: string;
  category:
    | "Holding"
    | "Transaction"
    | "Dividend"
    | "Report"
    | "Watchlist"
    | "Notification";

  href: string;
}
