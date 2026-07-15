"use client";

import {
  useEffect,
  useRef,
} from "react";
import type {
  PositionIntelligenceContextValue,
} from "@/lib/holdings-professional/positionIntelligenceModels";
import {
  PositionIntelligenceHeader,
} from "./PositionIntelligenceHeader";
import {
  PositionIntelligenceMetrics,
} from "./PositionIntelligenceMetrics";
import {
  PositionIntelligenceTabs,
} from "./PositionIntelligenceTabs";

type PositionIntelligenceDrawerProps = Pick<
  PositionIntelligenceContextValue,
  | "isOpen"
  | "summary"
  | "activeTab"
  | "closePosition"
  | "setActiveTab"
>;

export function PositionIntelligenceDrawer({
  isOpen,
  summary,
  activeTab,
  closePosition,
  setActiveTab,
}: PositionIntelligenceDrawerProps) {
  const drawerRef =
    useRef<
      HTMLDivElement |
      null
    >(
      null
    );

  useEffect(
    () => {
      if (!isOpen) {
        return;
      }

      const previousOverflow =
        document.body.style
          .overflow;

      document.body.style.overflow =
        "hidden";

      const onKeyDown =
        (
          event:
            KeyboardEvent
        ) => {
          if (
            event.key ===
            "Escape"
          ) {
            closePosition();
          }
        };

      window.addEventListener(
        "keydown",
        onKeyDown
      );

      const focusTimer =
        window.setTimeout(
          () => {
            drawerRef.current
              ?.focus();
          },
          20
        );

      return () => {
        document.body.style.overflow =
          previousOverflow;

        window.removeEventListener(
          "keydown",
          onKeyDown
        );

        window.clearTimeout(
          focusTimer
        );
      };
    },
    [
      closePosition,
      isOpen,
    ]
  );

  if (
    !isOpen ||
    !summary
  ) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label="Close position intelligence backdrop"
        onClick={closePosition}
        className="absolute inset-0 cursor-default bg-slate-950/75 backdrop-blur-sm motion-safe:animate-in motion-safe:fade-in motion-reduce:animate-none"
      />

      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="position-intelligence-title"
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-full flex-col overflow-hidden border-l border-slate-800 bg-[#030b12] shadow-[-30px_0_90px_rgba(0,0,0,0.4)] outline-none motion-safe:animate-in motion-safe:slide-in-from-right motion-safe:duration-300 motion-reduce:animate-none sm:w-[94vw] lg:w-[82vw] xl:w-[74vw] 2xl:w-[68vw]"
      >
        <div className="min-h-0 flex-1 overflow-y-auto">
          <PositionIntelligenceHeader
            summary={
              summary
            }
            onClose={
              closePosition
            }
          />

          <div className="p-4 sm:p-6">
            <PositionIntelligenceMetrics
              summary={
                summary
              }
            />
          </div>

          <PositionIntelligenceTabs
            summary={
              summary
            }
            activeTab={
              activeTab
            }
            onTabChange={
              setActiveTab
            }
          />
        </div>
      </div>
    </div>
  );
}
