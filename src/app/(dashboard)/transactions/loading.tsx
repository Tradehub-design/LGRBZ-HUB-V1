export default function TransactionsLoading() {
  return (
    <main
      className="space-y-5"
      aria-busy="true"
      aria-label="Loading Transactions workspace"
    >
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-800">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex gap-2">
                <div className="h-7 w-36 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-7 w-32 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
              </div>

              <div className="mt-4 h-8 w-56 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />

              <div className="mt-3 h-4 w-full max-w-2xl animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

              <div className="mt-2 h-4 w-full max-w-xl animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            </div>

            <div className="h-11 w-40 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>

        <div className="grid gap-3 p-4 lg:grid-cols-2">
          <div className="h-24 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-24 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="h-4 w-44 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-3 h-7 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-3 h-4 w-full max-w-2xl animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="flex gap-2">
            <div className="h-10 w-32 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
            <div className="h-10 w-36 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({
          length: 5,
        }).map((_, index) => (
          <article
            key={index}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="h-3 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-3 h-7 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="h-4 w-40 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-2 h-3 w-72 max-w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>

          <div className="flex flex-wrap gap-2">
            {Array.from({
              length: 5,
            }).map((_, index) => (
              <div
                key={index}
                className="h-9 w-24 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800"
              />
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-5">
          <div className="h-10 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800 lg:col-span-2" />
          <div className="h-10 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-10 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-10 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="grid grid-cols-[48px_repeat(6,minmax(100px,1fr))] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          {Array.from({
            length: 7,
          }).map((_, index) => (
            <div
              key={index}
              className="h-3 animate-pulse rounded bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>

        {Array.from({
          length: 8,
        }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-[48px_repeat(6,minmax(100px,1fr))] gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0 dark:border-slate-900"
          >
            {Array.from({
              length: 7,
            }).map((_, columnIndex) => (
              <div
                key={columnIndex}
                className="h-4 animate-pulse rounded bg-slate-100 dark:bg-slate-900"
              />
            ))}
          </div>
        ))}
      </section>
    </main>
  );
}
