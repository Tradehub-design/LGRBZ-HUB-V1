import { getTransactionTotal } from "@/lib/portfolio/safeTransaction";
import type { CalculatedHolding, HoldingLot, LedgerRow } from "./types";
import { round } from "@/utils/math";

export function calculateHoldings(rows: LedgerRow[]): CalculatedHolding[] {
  const holdings = new Map<string, CalculatedHolding>();

  const ordered = [...rows].sort((a, b) => a.date.localeCompare(b.date));

  for (const row of ordered) {
    if (
      row.action !== "Buy" &&
      row.action !== "Sell" &&
      row.action !== "Cash Dividend"
    ) {
      continue;
    }

    const key = `${row.platform}_${row.assetTicker}`;

    if (!holdings.has(key)) {
      holdings.set(key, {
        id: key,
        ticker: row.assetTicker,
        platform: row.platform,
        assetClass: row.assetClass,
        sector: row.sector,
        country: row.country,
        risk:
          row.strategy === "Low Risk" ||
          row.strategy === "Medium Risk" ||
          row.strategy === "High Risk" ||
          row.strategy === "Dividend"
            ? row.strategy
            : "Unrated",
        currency: row.currency,
        quantity: 0,
        totalCostAud: 0,
        averageCostAud: 0,
        realisedPlAud: 0,
        dividendsAud: 0,
        status: "Open",
        lots: [],
      });
    }

    const holding = holdings.get(key)!;

    //---------------------------------------
    // BUY
    //---------------------------------------

    if (row.action === "Buy") {
      const lot: HoldingLot = {
        id: row.id,
        ticker: row.assetTicker,
        platform: row.platform,
        date: row.date,
        quantity: row.quantity,
        remainingQuantity: row.quantity,
        costAud: getTransactionTotal(row),
        feesAud: row.fiatFees,
      };

      holding.quantity += row.quantity;
      holding.totalCostAud += getTransactionTotal(row);
      holding.lots.push(lot);
    }

    //---------------------------------------
    // DIVIDEND
    //---------------------------------------

    if (row.action === "Cash Dividend") {
      holding.dividendsAud +=
        getTransactionTotal(row) || row.totalAud || row.price;
    }

    //---------------------------------------
    // SELL (FIFO)
    //---------------------------------------

    if (row.action === "Sell") {
      let quantityToSell = row.quantity;

      while (quantityToSell > 0) {
        const lot = holding.lots.find((x) => x.remainingQuantity > 0);

        if (!lot) break;

        const sellQty = Math.min(
          quantityToSell,
          lot.remainingQuantity,
        );

        const lotAverage =
          lot.costAud / lot.quantity;

        const costRemoved =
          sellQty * lotAverage;

        const proceeds =
          (getTransactionTotal(row) / row.quantity) *
          sellQty;

        holding.realisedPlAud +=
          proceeds - costRemoved;

        holding.totalCostAud -= costRemoved;

        holding.quantity -= sellQty;

        lot.remainingQuantity -= sellQty;

        quantityToSell -= sellQty;
      }
    }
  }

  //---------------------------------------
  // FINALISE
  //---------------------------------------

  return Array.from(holdings.values()).map((holding) => {
    holding.quantity = round(holding.quantity, 8);

    holding.totalCostAud = round(
      holding.totalCostAud,
      2,
    );

    holding.realisedPlAud = round(
      holding.realisedPlAud,
      2,
    );

    holding.dividendsAud = round(
      holding.dividendsAud,
      2,
    );

    holding.averageCostAud =
      holding.quantity > 0
        ? round(
            holding.totalCostAud /
              holding.quantity,
            6,
          )
        : 0;

    holding.status =
      holding.quantity > 0
        ? "Open"
        : "Closed";

    return holding;
  });
}
