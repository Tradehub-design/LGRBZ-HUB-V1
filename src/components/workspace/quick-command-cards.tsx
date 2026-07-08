import Link from "next/link";
import { BarChart3, FileText, Flame, HeartPulse, Landmark, Newspaper, ReceiptText, RefreshCw, Sparkles, Wallet } from "lucide-react";

const commands = [
  { href: "/transactions", label: "Update Ledger", icon: RefreshCw },
  { href: "/holdings", label: "Review Holdings", icon: Wallet },
  { href: "/analytics", label: "Run Analytics", icon: BarChart3 },
  { href: "/portfolio-health", label: "Health Check", icon: HeartPulse },
  { href: "/tax", label: "Tax Centre", icon: ReceiptText },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/ai-insights", label: "AI Insights", icon: Sparkles },
  { href: "/fire-calculator", label: "FIRE", icon: Flame },
  { href: "/net-worth", label: "Net Worth", icon: Landmark },
  { href: "/daily-brief", label: "Daily Brief", icon: Newspaper },
];

export function QuickCommandCards() {
  return (
    <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
      {commands.map((command) => {
        const Icon = command.icon;

        return (
          <Link
            key={command.href}
            href={command.href}
            className="rounded-xl border border-[#173047] bg-[#0b1e30] p-4 text-center transition hover:-translate-y-1 hover:border-sky-500"
          >
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10 text-sky-300">
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-sm font-semibold text-white">{command.label}</p>
          </Link>
        );
      })}
    </div>
  );
}
