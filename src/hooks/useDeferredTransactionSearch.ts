"use client";

import {
  useDeferredValue,
  useEffect,
  useState,
} from "react";

export function useDeferredTransactionSearch(
  value: string,
  delay = 120
) {
  const [debouncedValue, setDebouncedValue] =
    useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () =>
      window.clearTimeout(timeout);
  }, [value, delay]);

  return useDeferredValue(debouncedValue);
}
