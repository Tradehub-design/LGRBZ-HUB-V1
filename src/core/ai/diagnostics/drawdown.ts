export function drawdownAlerts(holdings: any[] = []) {
  return holdings.map((holding) => ({
    ticker: holding.ticker ?? holding.assetTicker ?? "UNKNOWN",
    drawdown: Number(holding?.metrics?.unrealisedPercent ?? holding.unrealisedPlPercent ?? 0),
  }));
}

export function diagnoseDrawdown(holdings: any[] = []) {
  return drawdownAlerts(holdings);
}

export default drawdownAlerts;
