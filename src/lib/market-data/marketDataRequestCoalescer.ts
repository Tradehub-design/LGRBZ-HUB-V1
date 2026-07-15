import type {
  MarketDataCoalescedRequestInfo,
} from "./marketDataCacheTypes";

type PendingRequest<T> = {
  promise: Promise<T>;
  info: MarketDataCoalescedRequestInfo;
};

export class MarketDataRequestCoalescer {
  private readonly pending =
    new Map<
      string,
      PendingRequest<unknown>
    >();

  size():
    number {
    return this.pending.size;
  }

  has(
    key: string
  ):
    boolean {
    return this.pending.has(
      key
    );
  }

  getInfo():
    MarketDataCoalescedRequestInfo[] {
    return Array.from(
      this.pending.values()
    ).map(
      (
        request
      ) => ({
        ...request.info,
      })
    );
  }

  async run<T>(
    key: string,
    factory:
      () => Promise<T>,
    callbacks: {
      onCreated?:
        (
          info:
            MarketDataCoalescedRequestInfo
        ) => void;

      onJoined?:
        (
          info:
            MarketDataCoalescedRequestInfo
        ) => void;

      onResolved?:
        (
          info:
            MarketDataCoalescedRequestInfo
        ) => void;

      onRejected?:
        (
          info:
            MarketDataCoalescedRequestInfo,
          error:
            unknown
        ) => void;
    } = {}
  ):
    Promise<T> {
    const existing =
      this.pending.get(
        key
      ) as
        PendingRequest<T> |
        undefined;

    if (
      existing
    ) {
      existing.info = {
        ...existing.info,

        participantCount:
          existing.info
            .participantCount +
          1,

        state:
          "JOINED",
      };

      callbacks.onJoined?.({
        ...existing.info,
      });

      return existing.promise;
    }

    const info:
      MarketDataCoalescedRequestInfo = {
      key,

      createdAt:
        new Date()
          .toISOString(),

      participantCount:
        1,

      state:
        "CREATED",
    };

    callbacks.onCreated?.({
      ...info,
    });

    const promise =
      Promise.resolve()
        .then(
          factory
        )
        .then(
          (
            value
          ) => {
            const current =
              this.pending.get(
                key
              );

            const resolvedInfo:
              MarketDataCoalescedRequestInfo = {
              ...(
                current?.info ||
                info
              ),

              state:
                "RESOLVED",
            };

            callbacks.onResolved?.(
              resolvedInfo
            );

            return value;
          }
        )
        .catch(
          (
            error
          ) => {
            const current =
              this.pending.get(
                key
              );

            const rejectedInfo:
              MarketDataCoalescedRequestInfo = {
              ...(
                current?.info ||
                info
              ),

              state:
                "REJECTED",
            };

            callbacks.onRejected?.(
              rejectedInfo,
              error
            );

            throw error;
          }
        )
        .finally(
          () => {
            this.pending.delete(
              key
            );
          }
        );

    this.pending.set(
      key,
      {
        promise,
        info,
      }
    );

    return promise;
  }

  clear():
    void {
    this.pending.clear();
  }
}

let sharedRequestCoalescer:
  MarketDataRequestCoalescer | null =
    null;

export function getSharedMarketDataRequestCoalescer():
  MarketDataRequestCoalescer {
  if (
    !sharedRequestCoalescer
  ) {
    sharedRequestCoalescer =
      new MarketDataRequestCoalescer();
  }

  return sharedRequestCoalescer;
}

export function resetSharedMarketDataRequestCoalescer():
  MarketDataRequestCoalescer {
  sharedRequestCoalescer =
    new MarketDataRequestCoalescer();

  return sharedRequestCoalescer;
}
