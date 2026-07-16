"use client";

import type {
  QuoteSnapshot,
} from "../contracts";

import {
  canonicalQuotePriority,
  selectStrongestPortfolioQuote,
} from "../adapters/live-market-quote-adapter";

const STORAGE_KEY =
  "lgrbz.portfolio-engine.valid-quotes.v1";

const MAX_RETAINED_AGE_MS =
  72 * 60 * 60 * 1000;

type RetainedQuoteRecord = {
  version: 1;
  savedAt: string;
  quotes:
    Record<string, QuoteSnapshot>;
};

function validPositivePrice(
  quote: QuoteSnapshot,
): boolean {
  return (
    Number.isFinite(quote.price) &&
    quote.price > 0 &&
    quote.source !== "UNAVAILABLE" &&
    quote.quality !== "UNAVAILABLE"
  );
}

function quoteAgeAnchor(
  quote: QuoteSnapshot,
): number {
  const received =
    Date.parse(quote.receivedAt);

  if (Number.isFinite(received)) {
    return received;
  }

  if (quote.quotedAt) {
    const quoted =
      Date.parse(quote.quotedAt);

    if (Number.isFinite(quoted)) {
      return quoted;
    }
  }

  return 0;
}

function withinRetentionAge(
  quote: QuoteSnapshot,
  now = Date.now(),
): boolean {
  const anchor =
    quoteAgeAnchor(quote);

  return (
    anchor > 0 &&
    now - anchor <=
      MAX_RETAINED_AGE_MS
  );
}

function browserStorageAvailable(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.localStorage !==
      "undefined"
  );
}

export function loadRetainedPortfolioQuotes():
  Record<string, QuoteSnapshot> {
  if (!browserStorageAvailable()) {
    return {};
  }

  try {
    const raw =
      window.localStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return {};
    }

    const parsed =
      JSON.parse(raw) as
        Partial<RetainedQuoteRecord>;

    if (
      parsed.version !== 1 ||
      !parsed.quotes ||
      typeof parsed.quotes !==
        "object"
    ) {
      return {};
    }

    const now =
      Date.now();

    return Object.fromEntries(
      Object.entries(
        parsed.quotes,
      ).filter(
        (
          entry,
        ): entry is [
          string,
          QuoteSnapshot,
        ] => {
          const quote =
            entry[1] as
              QuoteSnapshot;

          return (
            Boolean(quote) &&
            validPositivePrice(
              quote,
            ) &&
            withinRetentionAge(
              quote,
              now,
            )
          );
        },
      ),
    );
  } catch {
    return {};
  }
}

export function saveRetainedPortfolioQuotes(
  quotes:
    Readonly<
      Record<string, QuoteSnapshot>
    >,
): void {
  if (!browserStorageAvailable()) {
    return;
  }

  const now =
    Date.now();

  const validQuotes =
    Object.fromEntries(
      Object.entries(quotes).filter(
        (
          entry,
        ): entry is [
          string,
          QuoteSnapshot,
        ] => {
          const quote =
            entry[1];

          return (
            validPositivePrice(
              quote,
            ) &&
            withinRetentionAge(
              quote,
              now,
            )
          );
        },
      ),
    );

  const payload:
    RetainedQuoteRecord = {
      version: 1,

      savedAt:
        new Date(now).toISOString(),

      quotes:
        validQuotes,
    };

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(payload),
    );
  } catch {
    /**
     * Storage failure must never prevent the in-memory Portfolio Engine from
     * continuing with its active quote set.
     */
  }
}

function retainedQuote(
  quote: QuoteSnapshot,
  receivedAt: string,
): QuoteSnapshot {
  return {
    ...quote,

    source:
      quote.source === "PREVIOUS_CLOSE"
        ? "PREVIOUS_CLOSE"
        : "CACHE",

    quality:
      "STALE",

    provider:
      `${quote.provider}:LAST_KNOWN_VALID`,

    receivedAt,

    cacheExpiresAt:
      null,

    error:
      "The latest provider refresh did not produce a stronger valid quote. The last-known valid price was retained.",
  };
}

/**
 * Combines:
 *
 * - current provider results;
 * - the previous render's valid quote map;
 * - browser-persisted valid quotes.
 *
 * Invalid refresh responses never enter this function because the adapter
 * rejects them first.
 */
export function mergeResilientPortfolioQuotes(input: {
  current:
    Readonly<
      Record<string, QuoteSnapshot>
    >;

  previous:
    Readonly<
      Record<string, QuoteSnapshot>
    >;

  persisted:
    Readonly<
      Record<string, QuoteSnapshot>
    >;

  securityIds:
    readonly string[];

  now?: string;
}): Record<string, QuoteSnapshot> {
  const now =
    input.now ??
    new Date().toISOString();

  const nowTimestamp =
    Date.parse(now);

  const safeNow =
    Number.isFinite(nowTimestamp)
      ? nowTimestamp
      : Date.now();

  const result:
    Record<string, QuoteSnapshot> = {};

  for (
    const securityId of
    input.securityIds
  ) {
    const current =
      input.current[securityId];

    const previous =
      input.previous[securityId];

    const persisted =
      input.persisted[securityId];

    const retainedCandidates =
      [
        previous,
        persisted,
      ]
        .filter(
          (
            quote,
          ): quote is QuoteSnapshot =>
            Boolean(quote) &&
            validPositivePrice(
              quote,
            ) &&
            withinRetentionAge(
              quote,
              safeNow,
            ),
        )
        .map((quote) =>
          retainedQuote(
            quote,
            now,
          ),
        );

    const strongestRetained =
      selectStrongestPortfolioQuote(
        retainedCandidates,
      );

    if (
      current &&
      validPositivePrice(current)
    ) {
      if (!strongestRetained) {
        result[securityId] =
          current;

        continue;
      }

      /**
       * A fresh provider quote always replaces retained data. A degraded,
       * stale or previous-close response replaces retained data only when it
       * has at least equivalent canonical strength.
       */
      if (
        current.source === "LIVE" &&
        (
          current.quality === "LIVE" ||
          current.quality === "DELAYED"
        )
      ) {
        result[securityId] =
          current;

        continue;
      }

      result[securityId] =
        canonicalQuotePriority(current) >=
        canonicalQuotePriority(
          strongestRetained,
        )
          ? current
          : strongestRetained;

      continue;
    }

    if (strongestRetained) {
      result[securityId] =
        strongestRetained;
    }
  }

  return result;
}

export function retainedQuoteStorageKey():
  string {
  return STORAGE_KEY;
}

export function retainedQuoteMaximumAgeMs():
  number {
  return MAX_RETAINED_AGE_MS;
}
