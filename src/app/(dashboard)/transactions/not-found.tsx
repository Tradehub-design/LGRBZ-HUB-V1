import Link from "next/link";
import {
  ArrowLeft,
  FileQuestion,
} from "lucide-react";

export default function TransactionsNotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center">
      <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          <FileQuestion className="h-7 w-7" />
        </span>

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
          Transaction view not found
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          The requested Transactions view is unavailable. Return to the main Transactions workspace.
        </p>

        <Link
          href="/transactions"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Transactions
        </Link>
      </section>
    </main>
  );
}
