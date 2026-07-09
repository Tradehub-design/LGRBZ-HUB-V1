import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Divider({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("h-px w-full bg-white/10", className)} {...props} />;
}
