import type { HTMLAttributes, ReactNode, ThHTMLAttributes, TdHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Table({ className, children, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full border-separate border-spacing-0 text-left text-sm", className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function THead({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn("text-xs uppercase tracking-[0.14em] text-slate-500", className)} {...props}>
      {children}
    </thead>
  );
}

export function TBody({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("divide-y divide-white/8", className)} {...props}>
      {children}
    </tbody>
  );
}

export function TR({ className, children, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn("transition hover:bg-white/[0.03]", className)} {...props}>
      {children}
    </tr>
  );
}

export function TH({ className, children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={cn("whitespace-nowrap px-4 py-3 font-medium", className)} {...props}>
      {children}
    </th>
  );
}

export function TD({ className, children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("whitespace-nowrap px-4 py-4 text-slate-300", className)} {...props}>
      {children}
    </td>
  );
}

export function TableCard({ children }: { children: ReactNode }) {
  return <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/55">{children}</div>;
}
