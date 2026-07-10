export function mapRowByHeaders(
  row: Record<string, unknown>,
  detectedHeaders: Record<string, string>,
) {
  function get(field: string, fallback: unknown = "") {
    const column = detectedHeaders[field];
    if (!column) return fallback;

    const value = row[column];
    return value === undefined || value === null || value === "" ? fallback : value;
  }

  return {
    Date: get("date"),
    Action: get("action"),
    "Asset Ticker": get("ticker"),
    "Crypto URL Name": get("cryptoUrlName"),
    Quantity: get("quantity", 0),
    Price: get("price", 0),
    "Fiat Fees": get("fees", 0),
    Currency: get("currency", "AUD"),
    Platform: get("platform"),
    "Asset Class": get("assetClass"),
    Sector: get("sector"),
    Country: get("country"),
    Strategy: get("strategy"),
    Notes: get("notes"),
    Total: get("total", 0),
  };
}
