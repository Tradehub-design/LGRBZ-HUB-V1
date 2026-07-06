"use client";

type IconRendererProps = {
  name: string;
  className?: string;
};

const icons: Record<string, string> = {
  ArrowLeftRight: "⇄",
  BadgeDollarSign: "$",
  BriefcaseBusiness: "▣",
  CalendarDays: "◷",
  ChartNoAxesCombined: "↗",
  FileDown: "⇩",
  LayoutDashboard: "▦",
  NotebookPen: "✎",
  ReceiptText: "▤",
  Search: "⌕",
  Settings: "⚙",
  TrendingUp: "↗",
  UploadCloud: "⇧",
  WalletCards: "▣",
};

export function IconRenderer({ name, className }: IconRendererProps) {
  return (
    <span
      aria-hidden="true"
      className={[
        "inline-flex items-center justify-center text-base leading-none",
        className ?? "",
      ].join(" ")}
    >
      {icons[name] ?? "•"}
    </span>
  );
}
