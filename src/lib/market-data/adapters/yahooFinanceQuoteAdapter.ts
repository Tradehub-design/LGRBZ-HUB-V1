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

type YahooQuoteItem = {
  symbol?: string;
  regularMarketPrice?: number;
  regularMarketPreviousClose?: number;
  regularMarketOpen?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketVolume?: number;
  marketCap?: number;
  currency?: string;
  fullExchangeName?: string;
  exchange?: string;
  regularMarketTime?: number;
  marketState?: string;
  quoteType?: string;
};

type YahooResponse = {
  quoteResponse?: {
    result?: YahooQuoteItem[];
    error?: unknown;
  };
};

function tradingStatus(
  value:
    string |
    undefined
):
  RawMarketQuote[
    "tradingStatus"
  ] {
  const state =
    String(
      value ||
      ""
    )
      .trim()
      .toUpperCase();

  if (
    state ===
    "REGULAR"
  ) {
    return "OPEN";
  }

  if (
    state ===
    "PRE"
  ) {
    return "PRE_MARKET";
  }

  if (
    state ===
      "POST" ||
    state ===
      "POSTPOST"
  ) {
    return "AFTER_HOURS";
  }

  if (
    state ===
      "CLOSED" ||
    state ===
      "PREPRE"
  ) {
    return "CLOSED";
  }

  return "UNKNOWN";
}

export class YahooFinanceQuoteAdapter
extends BaseMarketDataQuoteAdapter {
  readonly providerId =
    "YAHOO_FINANCE" as const;

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
        "Yahoo Finance provider definition is missing."
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

    const url =
      new URL(
        "https://query1.finance.yahoo.com/v7/finance/quote"
      );

    url.searchParams.set(
      "symbols",
      symbol.providerSymbol
    );

    const response =
      await marketDataHttpJson<YahooResponse>(
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

    const item =
      response.data
        .quoteResponse
        ?.result?.[
          0
        ];

    if (
      !item ||
      typeof item
        .regularMarketPrice !==
        "number"
    ) {
      throw createAdapterError(
        this.providerId,
        "SYMBOL_NOT_FOUND",
        `Yahoo Finance did not return a quote for ${symbol.providerSymbol}.`,
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
          item.symbol ||
          symbol.providerSymbol,

        price:
          item.regularMarketPrice,

        previousClose:
          item.regularMarketPreviousClose ??
          null,

        open:
          item.regularMarketOpen ??
          null,

        high:
          item.regularMarketDayHigh ??
          null,

        low:
          item.regularMarketDayLow ??
          null,

        change:
          item.regularMarketChange ??
          null,

        changePercent:
          item.regularMarketChangePercent ??
          null,

        volume:
          item.regularMarketVolume ??
          null,

        marketCap:
          item.marketCap ??
          null,

        currency:
          item.currency ||
          null,

        exchange:
          item.fullExchangeName ||
          item.exchange ||
          null,

        timestamp:
          item.regularMarketTime ||
          null,

        receivedAt:
          new Date()
            .toISOString(),

        latencyClass:
          "DELAYED",

        tradingStatus:
          tradingStatus(
            item.marketState
          ),

        provider:
          this.providerId,

        source:
          "Yahoo Finance",

        isDelayed:
          true,

        isIndicative:
          false,
      },
    };
  }
}
