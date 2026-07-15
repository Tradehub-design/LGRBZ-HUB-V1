"use client";

function Skeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={[
        "animate-pulse",
        "rounded-xl",
        "bg-slate-800/70",
        "motion-reduce:animate-none",
        className,
      ].join(" ")}
    />
  );
}

export function PositionIntelligenceLoading() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading position intelligence"
      className="space-y-5 p-5 sm:p-6"
    >
      <div className="flex items-start gap-4">
        <Skeleton className="h-14 w-14 shrink-0 rounded-2xl" />

        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-8 w-64 max-w-full" />
          <Skeleton className="h-4 w-48 max-w-full" />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 8,
        }).map(
          (_, index) => (
            <Skeleton
              key={index}
              className="h-28"
            />
          )
        )}
      </div>

      <Skeleton className="h-12 w-full" />

      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </div>
  );
}
