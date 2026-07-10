import type { LedgerRow } from "@/store/portfolioStore";

export type LedgerHolding = {
  id: string;
  ticker: string;
  assetTicker: string;
  name: string;
  platform: string;
  assetClass: string;
  sector: string;
  country: string;
  currency: string;
  status: "Open" | "Closed";
  quantity: number;
  averageCostAud: number;
  marketPriceAud: number;
  marketValueAud: number;
  costBaseAud: number;
  realisedPlAud: number;
  unrealisedPlAud: number;
  unrealisedPlPercent: number;
  portfolioWeightPercent: number;
};

function n(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function actionIncludes(tx: LedgerRow, word: string): boolean {
  return String(tx.action ?? "").toLowerCase().includes(word);
}

function makeHolding(tx: LedgerRow): LedgerHolding {
  const ticker = String(tx.ticker ?? tx.assetTicker ?? "UNKNOWN").toUpperCase();

  return {
    id: ticker,
    ticker,
    assetTicker: ticker,
    name: ticker,
    platform: String(tx.platform ?? "Manual"),
    assetClass: String(tx.assetClass ?? "Stock"),
    sector: String(tx.sector ?? "Unknown"),
    country: String(tx.country ?? "Australia"),
    currency: String(tx.currency ?? "AUD"),
    status: "Open",
    quantity: 0,
    averageCostAud: 0,
    marketPriceAud: n(tx.marketPriceAud ?? tx.priceAud ?? tx.price),
    marketValueAud: 0,
    costBaseAud: 0,
    realisedPlAud: 0,
    unrealisedPlAud: 0,
    unrealisedPlPercent: 0,
    portfolioWeightPercent: 0,
  };
}

export function calculateHoldingsFromLedger(transactions: LedgerRow[]): LedgerHolding[] {
  const map = new Map<string, LedgerHolding>();

  const sorted = [...transactions].sort((a, b) => String(a.date).localeCompare(String(b.date)));

  for (const tx of sorted) {
    if (!actionIncludes(tx, "buy") && !actionIncludes(tx, "sell")) continue;

    const ticker = String(tx.ticker ?? tx.assetTicker ?? "UNKNOWN").toUpperCase();
    const quantity = n(tx.quantity);
    const price = n(tx.priceAud ?? tx.price);
    const fees = n(tx.feesAud ?? tx.fiatFees ?? tx.fees);
    const total = n(tx.totalAud ?? tx.total ?? tx.amountAud ?? quantity * price + fees);

    let holding = map.get(ticker);
    if (!holding) {
      holding = makeHolding(tx);
      map.set(ticker, holding);
    }

    if (actionIncludes(tx, "buy")) {
      holding.quantity += quantity;
      holding.costBaseAud += total;
      holding.marketPriceAud = price || holding.marketPriceAud;
    }

    if (actionIncludes(tx, "sell")) {
      const avgCost = holding.quantity > 0 ? holding.costBaseAud / holding.quantity : 0;
      const costRemoved = avgCost * quantity;
      const realised = total - costRemoved - fees;

      holding.quantity -= quantity;
      holding.costBaseAud -= costRemoved;
      holding.realisedPlAud += realised;
      holding.marketPriceAud = price || holding.marketPriceAud;
    }

    if (holding.quantity < 0.000001) {
      holding.quantity = 0;
      holding.costBaseAud = 0;
      holding.status = "Closed";
    } else {
      holding.status = "Open";
    }

    holding.averageCostAud = holding.quantity ? holding.costBaseAud / holding.quantity : 0;
    holding.marketValueAud = holding.quantity * holding.marketPriceAud;
    holding.unrealisedPlAud = holding.marketValueAud - holding.costBaseAud;
    holding.unrealisedPlPercent = holding.costBaseAud
      ? (holding.unrealisedPlAud / holding.costBaseAud) * 100
      : 0;
  }

  const holdings = Array.from(map.values());
  const totalValue = holdings.reduce((sum, h) => sum + h.marketValueAud, 0);

  return holdings.map((holding) => ({
    ...holding,
    portfolioWeightPercent: totalValue ? (holding.marketValueAud / totalValue) * 100 : 0,
  }));
}
