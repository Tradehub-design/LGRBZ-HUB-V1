import { RangeSelector } from "./range-selector";

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Portfolio performance, allocation, holdings and account overview.
        </p>
      </div>

      <RangeSelector />
    </div>
  );
}
