import type {
  MarketDataAdapterError,
  MarketDataAdapterErrorCode,
} from "./marketDataAdapterTypes";
import type {
  MarketDataProviderId,
} from "./marketDataTypes";

export type MarketDataHttpResponse<T> = {
  data: T;
  status: number;
  headers: Headers;
  durationMs: number;
};

export type MarketDataHttpRequestOptions = {
  provider: MarketDataProviderId;
  timeoutMs: number;

  signal?: AbortSignal;

  headers?: Record<string, string>;

  method?: "GET" | "POST";

  body?: BodyInit | null;
};

function combineAbortSignals(
  externalSignal: AbortSignal | undefined,
  timeoutSignal: AbortSignal
): AbortSignal {
  if (
    !externalSignal
  ) {
    return timeoutSignal;
  }

  if (
    typeof AbortSignal.any ===
    "function"
  ) {
    return AbortSignal.any([
      externalSignal,
      timeoutSignal,
    ]);
  }

  const controller =
    new AbortController();

  const abort =
    () => {
      controller.abort();
    };

  externalSignal.addEventListener(
    "abort",
    abort,
    {
      once: true,
    }
  );

  timeoutSignal.addEventListener(
    "abort",
    abort,
    {
      once: true,
    }
  );

  return controller.signal;
}

function errorCodeForStatus(
  status: number
): MarketDataAdapterErrorCode {
  if (
    status === 401 ||
    status === 403
  ) {
    return "AUTHENTICATION_FAILED";
  }

  if (
    status === 404
  ) {
    return "SYMBOL_NOT_FOUND";
  }

  if (
    status === 408
  ) {
    return "TIMEOUT";
  }

  if (
    status === 429
  ) {
    return "RATE_LIMITED";
  }

  if (
    status >= 500
  ) {
    return "PROVIDER_UNAVAILABLE";
  }

  return "INVALID_RESPONSE";
}

export function createAdapterError(
  provider: MarketDataProviderId,
  code: MarketDataAdapterErrorCode,
  message: string,
  options: {
    retryable?: boolean;
    rateLimited?: boolean;
    timedOut?: boolean;
    statusCode?: number | null;
    rawError?: unknown;
  } = {}
): MarketDataAdapterError {
  return {
    provider,
    code,
    message,

    retryable:
      options.retryable ??
      [
        "RATE_LIMITED",
        "TIMEOUT",
        "NETWORK_ERROR",
        "PROVIDER_UNAVAILABLE",
      ].includes(
        code
      ),

    rateLimited:
      options.rateLimited ??
      code ===
      "RATE_LIMITED",

    timedOut:
      options.timedOut ??
      code ===
      "TIMEOUT",

    statusCode:
      options.statusCode ??
      null,

    rawError:
      options.rawError ??
      null,
  };
}

export async function marketDataHttpJson<T>(
  url: string,
  options: MarketDataHttpRequestOptions
): Promise<MarketDataHttpResponse<T>> {
  const startedAt =
    performance.now();

  const timeoutController =
    new AbortController();

  const timeout =
    setTimeout(
      () => {
        timeoutController.abort();
      },
      Math.max(
        100,
        options.timeoutMs
      )
    );

  const signal =
    combineAbortSignals(
      options.signal,
      timeoutController.signal
    );

  try {
    const response =
      await fetch(
        url,
        {
          method:
            options.method ||
            "GET",

          headers: {
            Accept:
              "application/json",

            ...options.headers,
          },

          body:
            options.body,

          signal,

          cache:
            "no-store",
        }
      );

    const durationMs =
      performance.now() -
      startedAt;

    if (
      !response.ok
    ) {
      let body =
        "";

      try {
        body =
          await response.text();
      } catch {
        body =
          "";
      }

      const code =
        errorCodeForStatus(
          response.status
        );

      throw createAdapterError(
        options.provider,
        code,
        body ||
          `${options.provider} returned HTTP ${response.status}.`,
        {
          statusCode:
            response.status,

          rateLimited:
            response.status ===
            429,

          timedOut:
            response.status ===
            408,
        }
      );
    }

    let data:
      T;

    try {
      data =
        await response.json() as T;
    } catch (
      error
    ) {
      throw createAdapterError(
        options.provider,
        "INVALID_RESPONSE",
        `${options.provider} returned invalid JSON.`,
        {
          statusCode:
            response.status,

          rawError:
            error,
        }
      );
    }

    return {
      data,
      status:
        response.status,
      headers:
        response.headers,
      durationMs,
    };
  } catch (
    error
  ) {
    if (
      isMarketDataAdapterError(
        error
      )
    ) {
      throw error;
    }

    if (
      error instanceof DOMException &&
      error.name ===
      "AbortError"
    ) {
      throw createAdapterError(
        options.provider,
        "TIMEOUT",
        `${options.provider} request timed out after ${options.timeoutMs}ms.`,
        {
          timedOut:
            true,

          rawError:
            error,
        }
      );
    }

    throw createAdapterError(
      options.provider,
      "NETWORK_ERROR",
      error instanceof Error
        ? error.message
        : `${options.provider} network request failed.`,
      {
        rawError:
          error,
      }
    );
  } finally {
    clearTimeout(
      timeout
    );
  }
}

export function isMarketDataAdapterError(
  value: unknown
): value is MarketDataAdapterError {
  if (
    !value ||
    typeof value !==
    "object"
  ) {
    return false;
  }

  const candidate =
    value as
      Partial<
        MarketDataAdapterError
      >;

  return (
    typeof candidate.provider ===
      "string" &&
    typeof candidate.code ===
      "string" &&
    typeof candidate.message ===
      "string" &&
    typeof candidate.retryable ===
      "boolean"
  );
}
