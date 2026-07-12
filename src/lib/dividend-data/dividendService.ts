import {
  normaliseMarketSymbols,
} from "@/lib/market-data";
import {
  calculateDividendEligibility,
} from "./dividendEligibility";
import {
  createDividendForecastEvents,
} from "./dividendForecast";
import {
  createReceivedDividendEvents,
} from "./dividendLedger";
import {
  createDividendPortfolioSummary,
} from "./dividendSummary";
import type {
  DividendEvent,
  DividendIntelligenceRequest,
  DividendIntelligenceResponse,
} from "./dividendTypes";
import {
  deduplicateDividendEvents,
  inferDividendFrequency,
} from "./dividendUtils";
import {
  configuredDividendProviders,
} from "./providers";

function defaultDates() {
  const now =
    new Date();

  const start =
    new Date(now);

  start.setUTCFullYear(
    start.getUTCFullYear() -
      5
  );

  const end =
    new Date(now);

  end.setUTCFullYear(
    end.getUTCFullYear() +
      1
  );

  return {
    startDate:
      start.toISOString(),
    endDate:
      end.toISOString(),
  };
}

export async function getDividendIntelligence(
  request:
    DividendIntelligenceRequest
): Promise<DividendIntelligenceResponse> {
  const defaults =
    defaultDates();

  const startDate =
    request.startDate ||
    defaults.startDate;

  const endDate =
    request.endDate ||
    defaults.endDate;

  const securities =
    request.securities ||
    request.holdings?.map(
      (holding) => ({
        symbol:
          holding.symbol,
        exchange:
          holding.exchange,
        currency:
          holding.currency,
      })
    ) ||
    [];

  const symbols =
    normaliseMarketSymbols(
      securities
    );

  const providers =
    configuredDividendProviders();

  const events:
    DividendEvent[] = [];

  const providersUsed =
    new Set<
      DividendEvent["provider"]
    >();

  const unresolvedSymbols:
    string[] = [];

  for (
    const symbol of symbols
  ) {
    let resolved =
      false;

    for (
      const provider of providers
    ) {
      const result =
        await provider.getDividends(
          symbol,
          startDate,
          endDate
        );

      if (
        result.events.length >
        0
      ) {
        events.push(
          ...result.events
        );

        providersUsed.add(
          provider.id
        );

        resolved =
          true;

        break;
      }
    }

    if (!resolved) {
      unresolvedSymbols.push(
        symbol.canonicalSymbol
      );
    }
  }

  const withFrequency =
    events.map(
      (event) => ({
        ...event,
        frequency:
          inferDividendFrequency(
            events.filter(
              (candidate) =>
                candidate.symbol ===
                event.symbol
            )
          ),
      })
    );

  const forecasts =
    createDividendForecastEvents(
      withFrequency,
      endDate
    );

  const ledgerEvents =
    createReceivedDividendEvents(
      request.transactions ||
      []
    );

  const combined =
    deduplicateDividendEvents([
      ...withFrequency,
      ...forecasts,
      ...ledgerEvents,
    ]);

  const eligibility =
    calculateDividendEligibility(
      combined,
      request.holdings ||
      [],
      request.transactions ||
      []
    );

  const summary =
    createDividendPortfolioSummary(
      combined,
      eligibility,
      request.holdings ||
        [],
      request.transactions ||
        [],
      request.baseCurrency ||
        "AUD"
    );

  for (
    const event of forecasts
  ) {
    providersUsed.add(
      event.provider
    );
  }

  for (
    const event of ledgerEvents
  ) {
    providersUsed.add(
      event.provider
    );
  }

  return {
    ok: true,

    events:
      combined,
    eligibility,
    summary,

    providersUsed:
      Array.from(
        providersUsed
      ),
    unresolvedSymbols,

    message:
      providers.length === 0
        ? "No dividend provider API key is configured. Forecasts can only use supplied history and ledger records."
        : undefined,
  };
}
