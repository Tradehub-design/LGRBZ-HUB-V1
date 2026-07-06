"use client";

import {
  ArrowLeftRight,
  BadgeDollarSign,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesCombined,
  FileDown,
  LayoutDashboard,
  NotebookPen,
  ReceiptText,
  Search,
  Settings,
  TrendingUp,
  UploadCloud,
  WalletCards,
} from "lucide-react";

const icons = {
  ArrowLeftRight,
  BadgeDollarSign,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesCombined,
  FileDown,
  LayoutDashboard,
  NotebookPen,
  ReceiptText,
  Search,
  Settings,
  TrendingUp,
  UploadCloud,
  WalletCards,
};

type IconRendererProps = {
  name: string;
  className?: string;
};

export function IconRenderer({ name, className }: IconRendererProps) {
  const Icon = icons[name as keyof typeof icons] ?? LayoutDashboard;
  return <Icon className={className} />;
}
