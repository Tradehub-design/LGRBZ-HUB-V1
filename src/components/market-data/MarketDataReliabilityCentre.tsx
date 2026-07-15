"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Database,
  Gauge,
  Globe2,
  Loader2,
  RefreshCcw,
  Server,
  ShieldAlert,
  ShieldCheck,
  Signal,
  Wifi,
  XCircle,
  Zap,
} from "lucide-react";
import {
  fetchMarketDataReliabilitySnapshot,
} from "@/lib/market-data/client/marketDataReliabilityClient";
import type {
  MarketDataReliabilitySnapshot,
  MarketDataReliabilityStatus,
} from "@/lib/market-data/marketDataReliabilityTypes";

function statusClasses(
  status:
    MarketDataReliabilityStatus
): string {
  if (
    status === "HEALTHY"
  ) {
    return [
      "border-emerald-400/25",
      "bg-emerald-400/10",
      "text-emerald-200",
    ].join(" ");
  }

  if (
    status === "DEGRADED"
  ) {
    return [
      "border-amber-400/25",
      "bg-amber-400/10",
      "text-amber-200",
    ].join(" ");
  }

  if (
    status === "CRITICAL"
  ) {
    return [
      "border-rose-400/25",
      "bg-rose-400/10",
      "text-rose-200",
    ].join(" ");
  }

  return [
    "border-slate-700",
    "bg-slate-800/70",
    "text-slate-300",
  ].join(" ");
}

function StatusIcon({
  status,
  className = "h-4 w-4",
}: {
  status:
    MarketDataReliabilityStatus;

  className?: string;
}) {
  if (
    status === "HEALTHY"
  ) {
    return (
      <CheckCircle2
        className={[
          className,
          "text-emerald-300",
        ].join(" ")}
      />
    );
  }

  if (
    status === "DEGRADED"
  ) {
    return (
      <AlertTriangle
        className={[
          className,
          "text-amber-300",
        ].join(" ")}
      />
    );
  }

  if (
    status === "CRITICAL"
  ) {
    return (
      <XCircle
        className={[
          className,
          "text-rose-300",
        ].join(" ")}
      />
    );
  }

  return (
    <Clock3
      className={[
        className,
        "text-slate-400",
      ].join(" ")}
    />
  );
}

function numberText(
  value: number,
  digits = 0
): string {
  return new Intl.NumberFormat(
    "en-AU",
    {
      maximumFractionDigits:
        digits,
    }
  ).format(value);
}

function percentText(
  value: number
): string {
  return `${numberText(
    value,
    1
  )}%`;
}

function metricCard():
  string {
  return [
    "rounded-xl",
    "border",
    "border-slate-800",
    "bg-slate-950/45",
    "p-4",
  ].join(" ");
}

export function MarketDataReliabilityCentre() {
  const [
    snapshot,
    setSnapshot,
  ] =
    useState<
      MarketDataReliabilitySnapshot |
      null
    >(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    error,
    setError,
  ] =
    useState<
      string |
      null
    >(
      null
    );

  const refresh =
    useCallback(
      async () => {
        setLoading(true);
        setError(null);

        const controller =
          new AbortController();

        try {
          const nextSnapshot =
            await fetchMarketDataReliabilitySnapshot(
              controller.signal
            );

          setSnapshot(
            nextSnapshot
          );
        } catch (
          caught
        ) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Unable to load market-data diagnostics."
          );
        } finally {
          setLoading(false);
        }

        return () => {
          controller.abort();
        };
      },
      []
    );

  useEffect(
    () => {
      void refresh();

      const timer =
        window.setInterval(
          () => {
            void refresh();
          },
          60_000
        );

      return () => {
        window.clearInterval(
          timer
        );
      };
    },
    [
      refresh,
    ]
  );

  const providerSuccessRate =
    useMemo(
      () => {
        if (
          !snapshot ||
          snapshot.providers.length ===
          0
        ) {
          return 0;
        }

        return (
          snapshot.providers.reduce(
            (
              total,
              provider
            ) =>
              total +
              provider.successRate,
            0
          ) /
          snapshot.providers.length
        );
      },
      [
        snapshot,
      ]
    );

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#071522] shadow-[0_18px_60px_rgba(0,0,0,0.2)]">
        <div className="border-b border-slate-800 bg-gradient-to-r from-cyan-500/10 via-violet-500/5 to-transparent p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300">
                  Institutional Data Operations
                </p>

                {snapshot ? (
                  <span
                    className={[
                      "inline-flex",
                      "items-center",
                      "gap-1.5",
                      "rounded-full",
                      "border",
                      "px-2.5",
                      "py-1",
                      "text-[11px]",
                      "font-semibold",
                      statusClasses(
                        snapshot.status
                      ),
                    ].join(" ")}
                  >
                    <StatusIcon
                      status={
                        snapshot.status
                      }
                      className="h-3.5 w-3.5"
                    />

                    {snapshot.status}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-2 text-2xl font-semibold text-white">
                Market Data Reliability Centre
              </h1>

              <p className="mt-1 max-w-3xl text-sm text-slate-400">
                Unified diagnostics for providers, API routes, quote cache,
                refresh coordination, market hours and browser quote state.
              </p>
            </div>

            <button
              type="button"
              disabled={
                loading
              }
              onClick={() => {
                void refresh();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RefreshCcw className="h-3.5 w-3.5" />
              )}

              Run diagnostics
            </button>
          </div>
        </div>

        {error ? (
          <div className="border-b border-rose-400/20 bg-rose-400/5 px-5 py-4">
            <div className="flex items-start gap-3">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />

              <div>
                <p className="text-xs font-semibold text-rose-200">
                  Diagnostics failed
                </p>

                <p className="mt-1 text-[11px] text-rose-100/70">
                  {error}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-6">
          <div className={metricCard()}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                System status
              </span>

              <ShieldCheck className="h-4 w-4 text-cyan-300" />
            </div>

            <p className="mt-2 text-xl font-semibold text-white">
              {snapshot?.status ||
                (
                  loading
                    ? "Testing"
                    : "Unknown"
                )}
            </p>

            <p className="mt-1 text-[11px] text-slate-500">
              Unified reliability state
            </p>
          </div>

          <div className={metricCard()}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                API endpoints
              </span>

              <Globe2 className="h-4 w-4 text-sky-300" />
            </div>

            <p className="mt-2 text-xl font-semibold text-white">
              {snapshot
                ? `${snapshot.summary.endpointOnlineCount}/${snapshot.summary.endpointTotalCount}`
                : "—"}
            </p>

            <p className="mt-1 text-[11px] text-slate-500">
              Endpoints online
            </p>
          </div>

          <div className={metricCard()}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Providers
              </span>

              <Server className="h-4 w-4 text-violet-300" />
            </div>

            <p className="mt-2 text-xl font-semibold text-white">
              {snapshot
                ? `${snapshot.summary.configuredProviderCount}/${snapshot.summary.providerCount}`
                : "—"}
            </p>

            <p className="mt-1 text-[11px] text-slate-500">
              Providers configured
            </p>
          </div>

          <div className={metricCard()}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Provider success
              </span>

              <Signal className="h-4 w-4 text-emerald-300" />
            </div>

            <p className="mt-2 text-xl font-semibold text-white">
              {snapshot
                ? percentText(
                    providerSuccessRate
                  )
                : "—"}
            </p>

            <p className="mt-1 text-[11px] text-slate-500">
              Average provider success
            </p>
          </div>

          <div className={metricCard()}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Cache hit rate
              </span>

              <Database className="h-4 w-4 text-amber-300" />
            </div>

            <p className="mt-2 text-xl font-semibold text-white">
              {snapshot
                ? percentText(
                    snapshot.cache.hitRate
                  )
                : "—"}
            </p>

            <p className="mt-1 text-[11px] text-slate-500">
              {snapshot
                ? `${snapshot.cache.entryCount} entries`
                : "Cache pending"}
            </p>
          </div>

          <div className={metricCard()}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Client quality
              </span>

              <Gauge className="h-4 w-4 text-rose-300" />
            </div>

            <p className="mt-2 text-xl font-semibold text-white">
              {snapshot
                ? `${numberText(
                    snapshot.client.averageQualityScore
                  )}/100`
                : "—"}
            </p>

            <p className="mt-1 text-[11px] text-slate-500">
              Browser quote quality
            </p>
          </div>
        </div>
      </section>

      {snapshot?.warnings.length ? (
        <section className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />

            <div>
              <h2 className="text-sm font-semibold text-amber-100">
                Reliability warnings
              </h2>

              <div className="mt-2 space-y-1">
                {snapshot.warnings.map(
                  (
                    warning
                  ) => (
                    <p
                      key={warning}
                      className="text-xs text-amber-100/70"
                    >
                      {warning}
                    </p>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-800 bg-[#071522]">
          <div className="flex items-center justify-between border-b border-slate-800 p-4">
            <div>
              <h2 className="text-sm font-semibold text-white">
                API endpoint health
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Current production-route availability
              </p>
            </div>

            <Globe2 className="h-4 w-4 text-cyan-300" />
          </div>

          <div className="divide-y divide-slate-800">
            {(snapshot?.endpoints ||
              []).map(
              (
                endpoint
              ) => {
                const mappedStatus:
                  MarketDataReliabilityStatus =
                    endpoint.status ===
                    "ONLINE"
                      ? "HEALTHY"
                      : endpoint.status ===
                          "DEGRADED"
                        ? "DEGRADED"
                        : endpoint.status ===
                            "OFFLINE"
                          ? "CRITICAL"
                          : "UNKNOWN";

                return (
                  <div
                    key={endpoint.key}
                    className="flex items-start justify-between gap-4 p-4"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <StatusIcon
                        status={
                          mappedStatus
                        }
                      />

                      <div className="min-w-0">
                        <p className="font-medium text-white">
                          {endpoint.label}
                        </p>

                        <p className="mt-0.5 truncate font-mono text-[11px] text-slate-500">
                          {endpoint.path}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400">
                          {endpoint.message}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-xs font-semibold text-white">
                        {endpoint.responseStatus ||
                          "—"}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-600">
                        {endpoint.durationMs ===
                        null
                          ? "Untested"
                          : `${endpoint.durationMs} ms`}
                      </p>
                    </div>
                  </div>
                );
              }
            )}

            {!snapshot?.endpoints.length ? (
              <div className="p-6 text-center text-sm text-slate-500">
                {loading
                  ? "Testing market-data endpoints…"
                  : "No endpoint diagnostics available."}
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-[#071522]">
          <div className="flex items-center justify-between border-b border-slate-800 p-4">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Provider reliability
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Configuration, latency and success rates
              </p>
            </div>

            <Server className="h-4 w-4 text-violet-300" />
          </div>

          <div className="divide-y divide-slate-800">
            {(snapshot?.providers ||
              []).map(
              (
                provider
              ) => (
                <div
                  key={provider.provider}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <StatusIcon
                        status={
                          provider.status
                        }
                      />

                      <div>
                        <p className="font-medium text-white">
                          {provider.provider.replaceAll(
                            "_",
                            " "
                          )}
                        </p>

                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {provider.message}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">
                        {percentText(
                          provider.successRate
                        )}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-600">
                        {provider.averageLatencyMs ===
                        null
                          ? "No latency"
                          : `${numberText(
                              provider.averageLatencyMs
                            )} ms`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={[
                        "h-full",
                        "rounded-full",
                        provider.status ===
                        "HEALTHY"
                          ? "bg-emerald-400"
                          : provider.status ===
                              "DEGRADED"
                            ? "bg-amber-400"
                            : "bg-rose-400",
                      ].join(" ")}
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(
                            100,
                            provider.successRate
                          )
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-600">
                    <span>
                      {provider.successfulRequests} successful
                    </span>

                    <span>
                      {provider.failedRequests} failed
                    </span>
                  </div>
                </div>
              )
            )}

            {!snapshot?.providers.length ? (
              <div className="p-6 text-center text-sm text-slate-500">
                Provider diagnostics will appear after provider activity is recorded.
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-slate-800 bg-[#071522] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Cache reliability
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Freshness and request efficiency
              </p>
            </div>

            <Database className="h-4 w-4 text-sky-300" />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <StatusIcon
              status={
                snapshot?.cache.status ||
                "UNKNOWN"
              }
              className="h-5 w-5"
            />

            <p className="text-sm font-semibold text-white">
              {snapshot?.cache.status ||
                "UNKNOWN"}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              [
                "Entries",
                snapshot?.cache.entryCount,
              ],
              [
                "Fresh",
                snapshot?.cache.freshEntryCount,
              ],
              [
                "Stale",
                snapshot?.cache.staleEntryCount,
              ],
              [
                "Expired",
                snapshot?.cache.expiredEntryCount,
              ],
              [
                "Hits",
                snapshot?.cache.hitCount,
              ],
              [
                "Misses",
                snapshot?.cache.missCount,
              ],
            ].map(
              (
                item
              ) => (
                <div
                  key={
                    item[0] as string
                  }
                  className="rounded-lg border border-slate-800 bg-slate-950/45 p-3"
                >
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    {item[0]}
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {item[1] ??
                      "—"}
                  </p>
                </div>
              )
            )}
          </div>

          <p className="mt-4 text-xs text-slate-500">
            {snapshot?.cache.message ||
              "Cache diagnostics pending."}
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-[#071522] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Refresh coordination
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Background job execution
              </p>
            </div>

            <Zap className="h-4 w-4 text-amber-300" />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <StatusIcon
              status={
                snapshot?.refresh.status ||
                "UNKNOWN"
              }
              className="h-5 w-5"
            />

            <p className="text-sm font-semibold text-white">
              {snapshot?.refresh.status ||
                "UNKNOWN"}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              [
                "Queued",
                snapshot?.refresh.queuedCount,
              ],
              [
                "Running",
                snapshot?.refresh.runningCount,
              ],
              [
                "Completed",
                snapshot?.refresh.completedCount,
              ],
              [
                "Failed",
                snapshot?.refresh.failedCount,
              ],
              [
                "Deferred",
                snapshot?.refresh.deferredCount,
              ],
              [
                "Success rate",
                snapshot
                  ? percentText(
                      snapshot.refresh.successRate
                    )
                  : "—",
              ],
            ].map(
              (
                item
              ) => (
                <div
                  key={
                    item[0] as string
                  }
                  className="rounded-lg border border-slate-800 bg-slate-950/45 p-3"
                >
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    {item[0]}
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {item[1] ??
                      "—"}
                  </p>
                </div>
              )
            )}
          </div>

          <p className="mt-4 text-xs text-slate-500">
            {snapshot?.refresh.message ||
              "Refresh diagnostics pending."}
          </p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-[#071522] p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Browser quote state
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Current client-side quote health
              </p>
            </div>

            <Wifi className="h-4 w-4 text-emerald-300" />
          </div>

          <div className="mt-4 flex items-center gap-3">
            <StatusIcon
              status={
                snapshot?.client.status ||
                "UNKNOWN"
              }
              className="h-5 w-5"
            />

            <p className="text-sm font-semibold text-white">
              {snapshot?.client.status ||
                "UNKNOWN"}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              [
                "Tracked",
                snapshot?.client.trackedSymbolCount,
              ],
              [
                "Live",
                snapshot?.client.liveQuoteCount,
              ],
              [
                "Delayed",
                snapshot?.client.delayedQuoteCount,
              ],
              [
                "Stale",
                snapshot?.client.staleQuoteCount,
              ],
              [
                "Expired",
                snapshot?.client.expiredQuoteCount,
              ],
              [
                "Errors",
                snapshot?.client.errorCount,
              ],
            ].map(
              (
                item
              ) => (
                <div
                  key={
                    item[0] as string
                  }
                  className="rounded-lg border border-slate-800 bg-slate-950/45 p-3"
                >
                  <p className="text-[10px] uppercase tracking-wider text-slate-600">
                    {item[0]}
                  </p>

                  <p className="mt-1 font-semibold text-white">
                    {item[1] ??
                      "—"}
                  </p>
                </div>
              )
            )}
          </div>

          <p className="mt-4 text-xs text-slate-500">
            {snapshot?.client.message ||
              "Client diagnostics pending."}
          </p>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-[#071522] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Reliability refresh policy
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              This page automatically reruns diagnostics every 60 seconds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-cyan-300" />
              API checks
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5 text-sky-300" />
              Cache checks
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Server className="h-3.5 w-3.5 text-violet-300" />
              Provider checks
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              Queue checks
            </span>
          </div>
        </div>

        {snapshot ? (
          <p className="mt-4 border-t border-slate-800 pt-3 text-[11px] text-slate-600">
            Last generated{" "}
            {new Intl.DateTimeFormat(
              "en-AU",
              {
                dateStyle: "medium",
                timeStyle: "medium",
              }
            ).format(
              new Date(
                snapshot.generatedAt
              )
            )}
          </p>
        ) : null}
      </section>
    </div>
  );
}
