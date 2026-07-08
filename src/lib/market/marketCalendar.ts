export type MarketCalendarEvent = {
  id: string;
  date: string;
  title: string;
  type: "Dividend" | "Earnings" | "Economic" | "Market";
  impact: "Low" | "Medium" | "High";
};

export function getDemoMarketCalendar(): MarketCalendarEvent[] {
  return [
    { id: "1", date: "2026-07-15", title: "VAS dividend estimate", type: "Dividend", impact: "Medium" },
    { id: "2", date: "2026-07-18", title: "US CPI release", type: "Economic", impact: "High" },
    { id: "3", date: "2026-07-22", title: "BHP quarterly update", type: "Earnings", impact: "Medium" },
    { id: "4", date: "2026-07-30", title: "RBA rate decision", type: "Economic", impact: "High" },
  ];
}
