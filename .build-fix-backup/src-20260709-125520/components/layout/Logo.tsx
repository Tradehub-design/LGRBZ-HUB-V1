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
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1f8cff] text-sm font-black text-white shadow-[0_0_30px_rgba(31,140,255,0.35)]">
        L
      </div>

      {!collapsed ? (
        <div className="leading-tight">
          <p className="text-xl font-semibold tracking-tight text-white">{APP_NAME}</p>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
            Portfolio OS
          </p>
        </div>
      ) : null}
    </Link>
  );
}
