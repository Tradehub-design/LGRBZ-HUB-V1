import type {
  MarketHolidayDefinition,
} from "./marketHoursTypes";
import type {
  MarketDataExchange,
} from "./marketDataTypes";

function holiday(
  exchange: MarketDataExchange,
  date: string,
  name: string,
  options: {
    closed?: boolean;
    earlyCloseTime?: string | null;
  } = {}
): MarketHolidayDefinition {
  return {
    exchange,
    date,
    name,
    closed:
      options.closed ??
      true,

    earlyCloseTime:
      options.earlyCloseTime ??
      null,
  };
}

const SHARED_US_EXCHANGES:
  MarketDataExchange[] = [
    "NASDAQ",
    "NYSE",
    "NYSE_ARCA",
    "AMEX",
    "OTC",
  ];

function forExchanges(
  exchanges: MarketDataExchange[],
  date: string,
  name: string,
  options: {
    closed?: boolean;
    earlyCloseTime?: string | null;
  } = {}
): MarketHolidayDefinition[] {
  return exchanges.map(
    (
      exchange
    ) =>
      holiday(
        exchange,
        date,
        name,
        options
      )
  );
}

export const MARKET_HOLIDAYS:
  MarketHolidayDefinition[] = [
    holiday("ASX", "2026-01-01", "New Year's Day"),
    holiday("ASX", "2026-01-26", "Australia Day"),
    holiday("ASX", "2026-04-03", "Good Friday"),
    holiday("ASX", "2026-04-06", "Easter Monday"),
    holiday("ASX", "2026-06-08", "King's Birthday"),
    holiday("ASX", "2026-12-25", "Christmas Day"),
    holiday("ASX", "2026-12-28", "Boxing Day Observed"),

    ...forExchanges(
      SHARED_US_EXCHANGES,
      "2026-01-01",
      "New Year's Day"
    ),

    ...forExchanges(
      SHARED_US_EXCHANGES,
      "2026-01-19",
      "Martin Luther King Jr. Day"
    ),

    ...forExchanges(
      SHARED_US_EXCHANGES,
      "2026-02-16",
      "Presidents Day"
    ),

    ...forExchanges(
      SHARED_US_EXCHANGES,
      "2026-04-03",
      "Good Friday"
    ),

    ...forExchanges(
      SHARED_US_EXCHANGES,
      "2026-05-25",
      "Memorial Day"
    ),

    ...forExchanges(
      SHARED_US_EXCHANGES,
      "2026-06-19",
      "Juneteenth"
    ),

    ...forExchanges(
      SHARED_US_EXCHANGES,
      "2026-07-03",
      "Independence Day Observed"
    ),

    ...forExchanges(
      SHARED_US_EXCHANGES,
      "2026-09-07",
      "Labor Day"
    ),

    ...forExchanges(
      SHARED_US_EXCHANGES,
      "2026-11-26",
      "Thanksgiving Day"
    ),

    ...forExchanges(
      SHARED_US_EXCHANGES,
      "2026-11-27",
      "Day After Thanksgiving",
      {
        closed: false,
        earlyCloseTime: "13:00",
      }
    ),

    ...forExchanges(
      SHARED_US_EXCHANGES,
      "2026-12-25",
      "Christmas Day"
    ),

    holiday("LSE", "2026-01-01", "New Year's Day"),
    holiday("LSE", "2026-04-03", "Good Friday"),
    holiday("LSE", "2026-04-06", "Easter Monday"),
    holiday("LSE", "2026-05-04", "Early May Bank Holiday"),
    holiday("LSE", "2026-05-25", "Spring Bank Holiday"),
    holiday("LSE", "2026-08-31", "Summer Bank Holiday"),
    holiday("LSE", "2026-12-25", "Christmas Day"),
    holiday("LSE", "2026-12-28", "Boxing Day Observed"),

    holiday("TSX", "2026-01-01", "New Year's Day"),
    holiday("TSX", "2026-02-16", "Family Day"),
    holiday("TSX", "2026-04-03", "Good Friday"),
    holiday("TSX", "2026-05-18", "Victoria Day"),
    holiday("TSX", "2026-07-01", "Canada Day"),
    holiday("TSX", "2026-08-03", "Civic Holiday"),
    holiday("TSX", "2026-09-07", "Labour Day"),
    holiday("TSX", "2026-10-12", "Thanksgiving"),
    holiday("TSX", "2026-12-25", "Christmas Day"),
    holiday("TSX", "2026-12-28", "Boxing Day Observed"),

    holiday("NZX", "2026-01-01", "New Year's Day"),
    holiday("NZX", "2026-01-02", "Day After New Year's Day"),
    holiday("NZX", "2026-02-06", "Waitangi Day"),
    holiday("NZX", "2026-04-03", "Good Friday"),
    holiday("NZX", "2026-04-06", "Easter Monday"),
    holiday("NZX", "2026-04-27", "ANZAC Day Observed"),
    holiday("NZX", "2026-06-01", "King's Birthday"),
    holiday("NZX", "2026-06-19", "Matariki"),
    holiday("NZX", "2026-10-26", "Labour Day"),
    holiday("NZX", "2026-12-25", "Christmas Day"),
    holiday("NZX", "2026-12-28", "Boxing Day Observed"),

    holiday("HKEX", "2026-01-01", "New Year's Day"),
    holiday("HKEX", "2026-02-17", "Lunar New Year"),
    holiday("HKEX", "2026-02-18", "Lunar New Year"),
    holiday("HKEX", "2026-02-19", "Lunar New Year"),
    holiday("HKEX", "2026-04-03", "Good Friday"),
    holiday("HKEX", "2026-04-06", "Easter Monday"),
    holiday("HKEX", "2026-05-01", "Labour Day"),
    holiday("HKEX", "2026-07-01", "HKSAR Establishment Day"),
    holiday("HKEX", "2026-10-01", "National Day"),
    holiday("HKEX", "2026-12-25", "Christmas Day"),

    holiday("TSE", "2026-01-01", "New Year's Day"),
    holiday("TSE", "2026-01-02", "Market Holiday"),
    holiday("TSE", "2026-01-12", "Coming of Age Day"),
    holiday("TSE", "2026-02-11", "National Foundation Day"),
    holiday("TSE", "2026-02-23", "Emperor's Birthday"),
    holiday("TSE", "2026-03-20", "Vernal Equinox"),
    holiday("TSE", "2026-04-29", "Showa Day"),
    holiday("TSE", "2026-05-04", "Greenery Day"),
    holiday("TSE", "2026-05-05", "Children's Day"),
    holiday("TSE", "2026-05-06", "Constitution Memorial Substitute"),
    holiday("TSE", "2026-07-20", "Marine Day"),
    holiday("TSE", "2026-08-11", "Mountain Day"),
    holiday("TSE", "2026-09-21", "Respect for the Aged Day"),
    holiday("TSE", "2026-09-22", "Citizens Holiday"),
    holiday("TSE", "2026-09-23", "Autumnal Equinox"),
    holiday("TSE", "2026-10-12", "Sports Day"),
    holiday("TSE", "2026-11-03", "Culture Day"),
    holiday("TSE", "2026-11-23", "Labour Thanksgiving Day"),
    holiday("TSE", "2026-12-31", "Market Holiday"),
  ];

export function marketHoliday(
  exchange: MarketDataExchange,
  date: string
): MarketHolidayDefinition | null {
  return (
    MARKET_HOLIDAYS.find(
      (
        item
      ) =>
        item.exchange === exchange &&
        item.date === date
    ) ||
    null
  );
}

export function isMarketHoliday(
  exchange: MarketDataExchange,
  date: string
): boolean {
  return Boolean(
    marketHoliday(
      exchange,
      date
    )
  );
}

export function addMarketHoliday(
  definition: MarketHolidayDefinition,
  holidays:
    MarketHolidayDefinition[] =
      MARKET_HOLIDAYS
): MarketHolidayDefinition[] {
  return [
    ...holidays.filter(
      (
        item
      ) =>
        !(
          item.exchange === definition.exchange &&
          item.date === definition.date
        )
    ),

    definition,
  ];
}
