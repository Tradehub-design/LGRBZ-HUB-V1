import {
  providerById,
} from "../providerRegistry";
import {
  marketDataHttpJson,
  createAdapterError,
} from "../marketDataHttpClient";
import type {
  ProviderQuoteRequest,
} from "../marketDataAdapterTypes";
import type {
  MarketDataProviderDefinition,
  MarketDataSymbol,
  RawMarketQuote,
} from "../marketDataTypes";
import {
  BaseMarketDataQuoteAdapter,
} from "./baseQuoteAdapter";

type FinnhubQuoteResponse = {
  c?: number;
  d?: number;
  dp?: number;
  h?: number;
  l?: number;
  o?: number;
  pc?: number;
  t?: number;
};

export class FinnhubQuoteAdapter
extends BaseMarketDataQuoteAdapter {
  readonly providerId =
    "FINNHUB" as const;

  getDefinition():
    MarketDataProviderDefinition {
    const provider =
      providerById(
        this.providerId
      );

    if (
      !provider
    ) {
      throw new Error(
        "Finnhub provider definition is missing."
      );
    }

    return provider;
  }

  async fetchRawQuote(
    request:
      ProviderQuoteRequest,
    symbol:
      MarketDataSymbol
  ): Promise<{
    quote:
      RawMarketQuote;
    statusCode:
      number;
  }> {
    const provider =
      this.getDefinition();

    const environment =
      request.environment ||
      process.env;

    const apiKey =
      environment
        .FINNHUB_API_KEY;

    if (
      !apiKey
    ) {
      throw createAdapterError(
        this.providerId,
        "NOT_CONFIGURED",
        "FINNHUB_API_KEY is not configured.",
        {
          retryable:
            false,
        }
      );
    }

    const url =
      new URL(
        "https://finnhub.io/api/v1/quote"
      );

    url.searchParams.set(
      "symbol",
      symbol.providerSymbol
    );

    url.searchParams.set(
      "token",
      apiKey
    );

    const response =
      await marketDataHttpJson<FinnhubQuoteResponse>(
        url.toString(),
        {
          provider:
            this.providerId,

          timeoutMs:
            request.timeoutMs ||
            provider.defaultTimeoutMs,

          signal:
            request.signal,
        }
      );

    if (
      !response.data.c ||
      response.data.c <=
      0
    ) {
      throw createAdapterError(
        this.providerId,
        "SYMBOL_NOT_FOUND",
        `Finnhub did not return a usable quote for ${symbol.providerSymbol}.`,
        {
          statusCode:
            response.status,

          retryable:
            false,
        }
      );
    }

    return {
      statusCode:
        response.status,

      quote: {
        symbol:
          symbol.providerSymbol,

        price:
          response.data.c,

        previousClose:
          response.data.pc ??
          null,

        open:
          response.data.o ??
          null,

        high:
          response.data.h ??
          null,

        low:
          response.data.l ??
          null,

        change:
          response.data.d ??
          null,

        changePercent:
          response.data.dp ??
          null,

        timestamp:
          response.data.t ??
          null,

        receivedAt:
          new Date()
            .toISOString(),

        currency:
          symbol.currency,

        exchange:
          symbol.exchange,

        latencyClass:
          "REAL_TIME",

        tradingStatus:
          "UNKNOWN",

        provider:
          this.providerId,

        source:
          "Finnhub",

        isDelayed:
          false,

        isIndicative:
          false,
      },
    };
  }
}
