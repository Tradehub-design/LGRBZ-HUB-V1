import type { AllocationSlice } from "@/lib/portfolio-engine";

export function allocationToPie(
  allocation: AllocationSlice[],
) {
  return allocation.map((item) => ({
    name: item.label,
    value: item.value,
    percent: item.percent,
  }));
}

export function allocationToBar(
  allocation: AllocationSlice[],
) {
  return allocation.map((item) => ({
    label: item.label,
    value: item.value,
  }));
}
