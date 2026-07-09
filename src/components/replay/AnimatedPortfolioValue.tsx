"use client";

import CountUp from "react-countup";
import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot";

export default function AnimatedPortfolioValue() {
  const { portfolioValue, cashAccounts } = useBusinessSnapshot();

  return (
    <div className="rounded-2xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">Portfolio Value</p>
      <p className="mt-2 text-3xl font-bold">
        $<CountUp end={portfolioValue} separator="," duration={0.8} />
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Cash ${cashAccounts.totalCash.toLocaleString()}
      </p>
    </div>
  );
}
