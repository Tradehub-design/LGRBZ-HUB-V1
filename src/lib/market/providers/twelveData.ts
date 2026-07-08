import type { MarketQuote } from "../provider";

const API_KEY = process.env.NEXT_PUBLIC_MARKET_API_KEY;
const BASE_URL = "https://api.twelvedata.com";

export async function fetchTwelveQuote(symbol: string): Promise<MarketQuote> {
  const response = await fetch(
    `${BASE_URL}/quote?symbol=${encodeURIComponent(symbol)}&apikey=${API_KEY}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Unable to load market quote");
  }

  const json = await response.json();

  const price = Number(json.close);
  const previousClose = Number(json.previous_close);

  return {
    symbol,
    price,
    previousClose,
    change: price - previousClose,
    changePercent: Number(json.percent_change),
    currency: json.currency || "AUD",
    updatedAt: new Date().toISOString(),
    mode: "live",
  };
}
