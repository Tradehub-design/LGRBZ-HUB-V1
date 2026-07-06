import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/cn";

type LogoProps = {
  collapsed?: boolean;
  className?: string;
};

export function Logo({ collapsed = false, className }: LogoProps) {
  return (
    <Link href="/dashboard" className={cn("flex items-center gap-3", className)}>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-base font-black tracking-[-0.08em] text-slate-950 shadow-[0_18px_40px_rgba(255,255,255,0.08)]">
        L
      </div>

      {!collapsed ? (
        <div className="leading-tight">
          <p className="text-lg font-semibold tracking-[-0.06em] text-white">{APP_NAME}</p>
          <p className="text-xs font-medium text-slate-500">Portfolio OS</p>
        </div>
      ) : null}
    </Link>
  );
}
