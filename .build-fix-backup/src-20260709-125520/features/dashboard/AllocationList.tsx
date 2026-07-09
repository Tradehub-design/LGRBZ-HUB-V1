"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCurrency } from "@/lib/formatters";
import type { AllocationSlice } from "@/lib/portfolio-engine/types";

type AllocationListProps = {
  title: string;
  description: string;
  data: AllocationSlice[];
};

export function AllocationList({ title, description, data }: AllocationListProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {data.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-[24px] bg-white/[0.03] text-sm text-slate-500">
            Waiting for ledger data
          </div>
        ) : (
          <div className="space-y-4">
            {data.slice(0, 8).map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{item.label}</p>
                    <p className="text-xs text-slate-500">{formatCurrency(item.value)}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-200">{item.percent.toFixed(1)}%</p>
                </div>
                <ProgressBar value={item.percent} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
