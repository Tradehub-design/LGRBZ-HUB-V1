import type {
  LiveQuoteStatusDescriptor,
  LiveQuoteStoreEntry,
} from "./liveQuoteClientTypes";
import type {
  NormalisedMarketQuote,
} from "../marketDataTypes";

function statusMessage(
  quote:
    NormalisedMarketQuote
): string {
  if (
    quote.isExpired
  ) {
    return "The stored market price has expired and should be refreshed.";
  }

  if (
    quote.isStale
  ) {
    return "The latest available market price is stale.";
  }

  if (
    quote.isIndicative
  ) {
    return "The displayed price is indicative and may differ from an executable price.";
  }

  if (
    quote.isDelayed
  ) {
    return "The displayed market price is delayed.";
  }

  if (
    quote.latencyClass ===
    "REAL_TIME"
  ) {
    return "The displayed market price is classified as real time.";
  }

  return quote.freshnessExplanation ||
    "The latest available market price is displayed.";
}

export function describeLiveQuote(
  quote:
    NormalisedMarketQuote |
    null
): LiveQuoteStatusDescriptor {
  if (
    !quote
  ) {
    return {
      label:
        "Price unavailable",

      shortLabel:
        "Unavailable",

      freshness:
        "UNKNOWN",

      qualityGrade:
        null,

      provider:
        null,

      live:
        false,

      delayed:
        false,

      stale:
        false,

      expired:
        false,

      indicative:
        false,

      usable:
        false,

      message:
        "No market price is currently available.",

      timestamp:
        null,

      ageSeconds:
        null,
    };
  }

  const live =
    quote.latencyClass ===
      "REAL_TIME" &&
    !quote.isDelayed &&
    !quote.isStale &&
    !quote.isExpired;

  let label =
    quote.freshnessLabel ||
    "Latest price";

  let shortLabel =
    "Latest";

  if (
    quote.isExpired
  ) {
    label =
      "Expired price";

    shortLabel =
      "Expired";
  } else if (
    quote.isStale
  ) {
    label =
      "Stale price";

    shortLabel =
      "Stale";
  } else if (
    quote.isIndicative
  ) {
    label =
      "Indicative price";

    shortLabel =
      "Indicative";
  } else if (
    quote.isDelayed
  ) {
    label =
      "Delayed price";

    shortLabel =
      "Delayed";
  } else if (
    live
  ) {
    label =
      "Live price";

    shortLabel =
      "Live";
  }

  return {
    label,
    shortLabel,

    freshness:
      quote.freshness,

    qualityGrade:
      quote.qualityGrade,

    provider:
      quote.provider,

    live,

    delayed:
      quote.isDelayed,

    stale:
      quote.isStale,

    expired:
      quote.isExpired,

    indicative:
      quote.isIndicative,

    usable:
      quote.isUsable,

    message:
      statusMessage(
        quote
      ),

    timestamp:
      quote.quoteTimestamp,

    ageSeconds:
      quote.ageSeconds,
  };
}

export function describeLiveQuoteEntry(
  entry:
    LiveQuoteStoreEntry |
    null
): LiveQuoteStatusDescriptor {
  return describeLiveQuote(
    entry?.quote ||
    null
  );
}

export function liveQuoteNeedsRefresh(
  entry:
    LiveQuoteStoreEntry |
    null,
  now =
    new Date()
): boolean {
  if (
    !entry ||
    !entry.quote
  ) {
    return true;
  }

  if (
    entry.quote.isExpired ||
    entry.quote.isStale
  ) {
    return true;
  }

  if (
    entry.nextRefreshAt
  ) {
    return (
      new Date(
        entry.nextRefreshAt
      ).getTime() <=
      now.getTime()
    );
  }

  return false;
}

export function liveQuoteDisplayTimestamp(
  quote:
    NormalisedMarketQuote |
    null,
  locale =
    "en-AU"
): string {
  if (
    !quote
  ) {
    return "No timestamp";
  }

  const timestamp =
    new Date(
      quote.quoteTimestamp
    );

  if (
    Number.isNaN(
      timestamp.getTime()
    )
  ) {
    return "Timestamp unavailable";
  }

  return new Intl.DateTimeFormat(
    locale,
    {
      dateStyle:
        "medium",

      timeStyle:
        "short",
    }
  ).format(
    timestamp
  );
}
