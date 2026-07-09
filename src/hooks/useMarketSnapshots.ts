"use client";

import { useEffect } from "react";
import { useMarketSnapshotStore } from "@/store/marketSnapshotStore";

export default function useMarketSnapshots() {
  const update = useMarketSnapshotStore((state) => state.update);

  useEffect(() => {
    update([]);
  }, [update]);
}
