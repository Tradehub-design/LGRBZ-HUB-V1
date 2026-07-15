"use client";

import type {
  MouseEvent,
  ReactNode,
} from "react";
import {
  ArrowRight,
} from "lucide-react";
import type {
  HoldingsVisualPosition,
} from "@/lib/holdings-professional/holdingsVisualModels";
import {
  usePositionIntelligenceDrawer,
} from "@/hooks/holdings-professional/usePositionIntelligenceDrawer";

type OpenPositionIntelligenceButtonProps = {
  position:
    HoldingsVisualPosition;

  children?: ReactNode;

  className?: string;

  showIcon?: boolean;

  ariaLabel?: string;
};

export function OpenPositionIntelligenceButton({
  position,
  children,
  className = "",
  showIcon = false,
  ariaLabel,
}: OpenPositionIntelligenceButtonProps) {
  const {
    openPosition,
  } =
    usePositionIntelligenceDrawer();

  const handleClick =
    (
      event:
        MouseEvent<HTMLButtonElement>
    ) => {
      event.preventDefault();
      event.stopPropagation();

      openPosition(
        position
      );
    };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={
        ariaLabel ||
        `Open ${position.symbol} position intelligence`
      }
      className={className}
    >
      {children}

      {showIcon ? (
        <ArrowRight className="h-4 w-4" />
      ) : null}
    </button>
  );
}
