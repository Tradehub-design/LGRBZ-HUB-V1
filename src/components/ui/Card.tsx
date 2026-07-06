import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  interactive?: boolean;
  glass?: boolean;
};

export function Card({ children, className, interactive = false, glass = true, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-white/10",
        glass
          ? "bg-slate-950/55 shadow-[0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl"
          : "bg-slate-950",
        interactive && "transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-slate-900/70",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={cn("flex items-start justify-between gap-4 px-5 pt-5 md:px-6 md:pt-6", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { children: ReactNode }) {
  return (
    <h3 className={cn("text-base font-semibold tracking-[-0.02em] text-white", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement> & { children: ReactNode }) {
  return (
    <p className={cn("mt-1 text-sm leading-6 text-slate-400", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div className={cn("px-5 pb-5 pt-4 md:px-6 md:pb-6", className)} {...props}>
      {children}
    </div>
  );
}
