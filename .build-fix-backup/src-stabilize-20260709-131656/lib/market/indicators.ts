import type { Candle } from "./charts/candles";

export type TechnicalSnapshot = {
  symbol: string;
  lastClose: number;
  sma20: number;
  sma50: number;
  trend: "Bullish" | "Bearish" | "Neutral";
  momentum: "Strong" | "Weak" | "Flat";
};

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function round(value: number) {
  return Math.round((value || 0) * 100) / 100;
}

export function calculateTechnicalSnapshot(symbol: string, candles: Candle[]): TechnicalSnapshot {
  const closes = candles.map((candle) => candle.close);
  const lastClose = closes[closes.length - 1] ?? 0;
  const sma20 = average(closes.slice(-20));
  const sma50 = average(closes.slice(-50));

  const trend =
    lastClose > sma20 && sma20 > sma50
      ? "Bullish"
      : lastClose < sma20 && sma20 < sma50
        ? "Bearish"
        : "Neutral";

  const previous = closes[closes.length - 6] ?? lastClose;
  const momentum = lastClose > previous ? "Strong" : lastClose < previous ? "Weak" : "Flat";

  return {
    symbol,
    lastClose: round(lastClose),
    sma20: round(sma20),
    sma50: round(sma50),
    trend,
    momentum,
  };
}
