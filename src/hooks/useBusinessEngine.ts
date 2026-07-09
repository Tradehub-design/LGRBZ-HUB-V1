"use client";

import { useEffect } from "react";
import { useBusinessSnapshot } from "@/hooks/useBusinessSnapshot";

export default function useCompatHook() {
  const snapshot = useBusinessSnapshot();

  useEffect(() => {
    void snapshot;
  }, [snapshot]);
}
export { default as useBusinessEngine } from "./useBusinessEngine";
