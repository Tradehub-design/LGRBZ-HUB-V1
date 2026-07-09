"use client";

import { useEffect } from "react";
import { registerDefaultMarketProvider } from "@/core/market/registerDefaultProvider";

export default function useRegisterMarketProvider() {
  useEffect(() => {
    registerDefaultMarketProvider();
  }, []);
}
