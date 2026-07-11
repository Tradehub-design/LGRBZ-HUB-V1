"use client";

type Props = {
  rows?: number;
};

function SkeletonBlock({
  className,
}: {
  className: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`}
    />
  );
}

export function TransactionLoadingState({
  rows = 8,
}: Props) {
  return (
    <div
      className="space-y-4"
      aria-busy="true"
      aria-label="Loading transactions"
    >
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({
          length: 5,
        }).map((_, index) => (
          <article
            key={index}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
          >
            <SkeletonBlock className="h-3 w-24" />
            <SkeletonBlock className="mt-3 h-7 w-32" />
            <SkeletonBlock className="mt-2 h-3 w-20" />
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <SkeletonBlock className="h-4 w-40" />
            <SkeletonBlock className="mt-2 h-3 w-64 max-w-full" />
          </div>

          <div className="flex flex-wrap gap-2">
            <SkeletonBlock className="h-9 w-24" />
            <SkeletonBlock className="h-9 w-24" />
            <SkeletonBlock className="h-9 w-24" />
            <SkeletonBlock className="h-9 w-28" />
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-5">
          <SkeletonBlock className="h-10 lg:col-span-2" />
          <SkeletonBlock className="h-10" />
          <SkeletonBlock className="h-10" />
          <SkeletonBlock className="h-10" />
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="grid grid-cols-[44px_1fr_1fr_1fr_1fr_1fr] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <SkeletonBlock
              key={index}
              className="h-3"
            />
          ))}
        </div>

        {Array.from({
          length: rows,
        }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[44px_1fr_1fr_1fr_1fr_1fr] gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0 dark:border-slate-900"
          >
            <SkeletonBlock className="h-4 w-4" />
            <SkeletonBlock className="h-4" />
            <SkeletonBlock className="h-4" />
            <SkeletonBlock className="h-4" />
            <SkeletonBlock className="h-4" />
            <SkeletonBlock className="h-4" />
          </div>
        ))}
      </section>
    </div>
  );
}
