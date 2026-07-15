"use client";

import {
  useCallback,
  useMemo,
  useState,
} from "react";
import type {
  ReactNode,
} from "react";
import type {
  HoldingsVisualPosition,
  HoldingsVisualSnapshot,
} from "@/lib/holdings-professional/holdingsVisualModels";
import type {
  PositionIntelligenceSummary,
  PositionIntelligenceTab,
} from "@/lib/holdings-professional/positionIntelligenceModels";
import {
  createPositionIntelligence,
} from "@/lib/holdings-professional/positionIntelligenceEngine";
import {
  PositionIntelligenceContext,
} from "@/hooks/holdings-professional/usePositionIntelligenceDrawer";
import {
  PositionIntelligenceDrawer,
} from "./PositionIntelligenceDrawer";

type PositionIntelligenceProviderProps = {
  children:
    ReactNode;

  snapshot:
    HoldingsVisualSnapshot;
};

export function PositionIntelligenceProvider({
  children,
  snapshot,
}: PositionIntelligenceProviderProps) {
  const [
    selectedPosition,
    setSelectedPosition,
  ] =
    useState<
      HoldingsVisualPosition |
      null
    >(
      null
    );

  const [
    activeTab,
    setActiveTab,
  ] =
    useState<
      PositionIntelligenceTab
    >(
      "OVERVIEW"
    );

  const summary:
    PositionIntelligenceSummary |
    null =
      useMemo(
        () => {
          if (
            !selectedPosition
          ) {
            return null;
          }

          return createPositionIntelligence({
            position:
              selectedPosition,

            snapshot,
          });
        },
        [
          selectedPosition,
          snapshot,
        ]
      );

  const openPosition =
    useCallback(
      (
        position:
          HoldingsVisualPosition
      ) => {
        setSelectedPosition(
          position
        );

        setActiveTab(
          "OVERVIEW"
        );
      },
      []
    );

  const closePosition =
    useCallback(
      () => {
        setSelectedPosition(
          null
        );

        setActiveTab(
          "OVERVIEW"
        );
      },
      []
    );

  const contextValue =
    useMemo(
      () => ({
        isOpen:
          Boolean(
            selectedPosition
          ),

        selectedPosition,
        summary,

        activeTab,

        openPosition,
        closePosition,
        setActiveTab,
      }),
      [
        activeTab,
        closePosition,
        openPosition,
        selectedPosition,
        summary,
      ]
    );

  return (
    <PositionIntelligenceContext.Provider
      value={
        contextValue
      }
    >
      {children}

      <PositionIntelligenceDrawer
        isOpen={
          contextValue.isOpen
        }
        summary={
          summary
        }
        activeTab={
          activeTab
        }
        closePosition={
          closePosition
        }
        setActiveTab={
          setActiveTab
        }
      />
    </PositionIntelligenceContext.Provider>
  );
}
