"use client";

import type {
  PortfolioDividendApiResult,
} from "../dividends/contracts";

const STORAGE_KEY =
  "lgrbz.portfolio-engine.dividend-intelligence.v1";

const MAX_AGE_MS =
  24 *
  60 *
  60 *
  1000;

type RetainedDividendPayload = {
  version: 1;

  savedAt: string;
  portfolioIdentity: string;

  response:
    PortfolioDividendApiResult;
};

function storageAvailable():
  boolean {
  return (
    typeof window !==
      "undefined" &&
    typeof window.localStorage !==
      "undefined"
  );
}

function validResponse(
  value:
    unknown,
): value is PortfolioDividendApiResult {
  if (
    !value ||
    typeof value !==
      "object"
  ) {
    return false;
  }

  const response =
    value as
      Partial<
        PortfolioDividendApiResult
      >;

  return (
    response.ok === true &&
    Array.isArray(
      response.events,
    ) &&
    Array.isArray(
      response.eligibility,
    ) &&
    Boolean(
      response.summary,
    ) &&
    Array.isArray(
      response.providersUsed,
    ) &&
    Array.isArray(
      response.unresolvedSymbols,
    )
  );
}

export function loadRetainedDividendResponse(
  portfolioIdentity:
    string,
): PortfolioDividendApiResult | null {
  if (!storageAvailable()) {
    return null;
  }

  try {
    const raw =
      window.localStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return null;
    }

    const parsed =
      JSON.parse(raw) as
        Partial<
          RetainedDividendPayload
        >;

    if (
      parsed.version !== 1 ||
      parsed.portfolioIdentity !==
        portfolioIdentity ||
      !parsed.savedAt ||
      !validResponse(
        parsed.response,
      )
    ) {
      return null;
    }

    const savedAt =
      Date.parse(
        parsed.savedAt,
      );

    if (
      !Number.isFinite(
        savedAt,
      ) ||
      Date.now() -
        savedAt >
        MAX_AGE_MS
    ) {
      return null;
    }

    return parsed.response;
  } catch {
    return null;
  }
}

export function saveRetainedDividendResponse(input: {
  portfolioIdentity:
    string;

  response:
    PortfolioDividendApiResult;
}): void {
  if (
    !storageAvailable() ||
    !validResponse(
      input.response,
    )
  ) {
    return;
  }

  const payload:
    RetainedDividendPayload = {
      version: 1,

      savedAt:
        new Date().toISOString(),

      portfolioIdentity:
        input.portfolioIdentity,

      response:
        input.response,
  };

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        payload,
      ),
    );
  } catch {
    /**
     * Dividend retention is a resilience layer. Storage failure must never
     * prevent the active dividend result being used.
     */
  }
}

export function retainedDividendStorageKey():
  string {
  return STORAGE_KEY;
}

export function retainedDividendMaximumAgeMs():
  number {
  return MAX_AGE_MS;
}
