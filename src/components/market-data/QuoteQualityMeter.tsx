"use client";

type QuoteQualityMeterProps = {
  qualityScore:
    number |
    null |
    undefined;

  confidenceScore?:
    number |
    null;

  compact?: boolean;
};

function clamp(
  value:
    number
): number {
  return Math.max(
    0,
    Math.min(
      100,
      value
    )
  );
}

function qualityLabel(
  score:
    number
): string {
  if (
    score >=
    90
  ) {
    return "Institutional";
  }

  if (
    score >=
    75
  ) {
    return "High";
  }

  if (
    score >=
    60
  ) {
    return "Good";
  }

  if (
    score >=
    40
  ) {
    return "Moderate";
  }

  return "Low";
}

function meterClass(
  score:
    number
): string {
  if (
    score >=
    75
  ) {
    return "bg-emerald-400";
  }

  if (
    score >=
    55
  ) {
    return "bg-sky-400";
  }

  if (
    score >=
    35
  ) {
    return "bg-amber-400";
  }

  return "bg-rose-400";
}

export function QuoteQualityMeter({
  qualityScore,
  confidenceScore,
  compact =
    false,
}: QuoteQualityMeterProps) {
  if (
    qualityScore ===
      null ||
    qualityScore ===
      undefined
  ) {
    return (
      <span className="text-xs text-slate-500">
        Quality unavailable
      </span>
    );
  }

  const quality =
    clamp(
      qualityScore
    );

  const confidence =
    confidenceScore ===
      null ||
    confidenceScore ===
      undefined
      ? null
      : clamp(
          confidenceScore
        );

  if (
    compact
  ) {
    return (
      <div
        title={[
          `Quote quality ${quality.toFixed(
            0
          )}/100`,
          confidence ===
          null
            ? null
            : `Confidence ${confidence.toFixed(
                0
              )}/100`,
        ]
          .filter(
            Boolean
          )
          .join(
            " · "
          )}
        className="flex min-w-[92px] items-center gap-2"
      >
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
          <div
            className={[
              "h-full",
              "rounded-full",
              meterClass(
                quality
              ),
            ].join(
              " "
            )}
            style={{
              width: `${quality}%`,
            }}
          />
        </div>

        <span className="w-7 text-right text-[11px] font-semibold text-slate-300">
          {quality.toFixed(
            0
          )}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-slate-400">
          Quote quality
        </span>

        <span className="text-xs font-semibold text-white">
          {qualityLabel(
            quality
          )} ·{" "}
          {quality.toFixed(
            0
          )}
          /100
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div
          className={[
            "h-full",
            "rounded-full",
            "transition-[width]",
            "duration-500",
            meterClass(
              quality
            ),
          ].join(
            " "
          )}
          style={{
            width: `${quality}%`,
          }}
        />
      </div>

      {confidence !==
      null ? (
        <p className="text-[11px] text-slate-500">
          Provider confidence{" "}
          {confidence.toFixed(
            0
          )}
          /100
        </p>
      ) : null}
    </div>
  );
}
