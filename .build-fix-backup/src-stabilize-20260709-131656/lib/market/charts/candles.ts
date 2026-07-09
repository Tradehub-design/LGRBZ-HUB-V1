export type Candle = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export function buildDemoCandles(days = 120): Candle[] {
  const candles: Candle[] = [];
  let price = 100;

  for (let i = 0; i < days; i++) {
    const open = price;
    const move = (Math.random() - 0.5) * 6;
    const close = open + move;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;

    candles.push({
      time: new Date(Date.now() - (days - i) * 86400000)
        .toISOString()
        .slice(0, 10),
      open,
      high,
      low,
      close,
      volume: Math.round(Math.random() * 2000000),
    });

    price = close;
  }

  return candles;
}
