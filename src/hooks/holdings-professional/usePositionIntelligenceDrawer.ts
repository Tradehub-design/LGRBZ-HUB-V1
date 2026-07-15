"use client";

import {
  createContext,
  useContext,
} from "react";
import type {
  PositionIntelligenceContextValue,
} from "@/lib/holdings-professional/positionIntelligenceModels";

export const PositionIntelligenceContext =
  createContext<
    PositionIntelligenceContextValue |
    null
  >(
    null
  );

export function usePositionIntelligenceDrawer():
  PositionIntelligenceContextValue {
  const context =
    useContext(
      PositionIntelligenceContext
    );

  if (!context) {
    throw new Error(
      "usePositionIntelligenceDrawer must be used inside PositionIntelligenceProvider."
    );
  }

  return context;
}
