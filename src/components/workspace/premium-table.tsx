import type { ReactNode } from "react";

export function PremiumTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#173047]">
      <table className="w-full text-left text-xs">{children}</table>
    </div>
  );
}

export function PremiumTableHead({ children }: { children: ReactNode }) {
  return <thead className="bg-[#0b1e30] text-slate-400">{children}</thead>;
}

export function PremiumTableBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-slate-800">{children}</tbody>;
}

export function PremiumRow({ children }: { children: ReactNode }) {
  return <tr className="text-slate-300 transition hover:bg-slate-800/40">{children}</tr>;
}

export function PremiumTh({ children, align = "left" }: { children: ReactNode; align?: "left" | "right" }) {
  return <th className={`px-3 py-3 font-medium ${align === "right" ? "text-right" : "text-left"}`}>{children}</th>;
}

export function PremiumTd({
  children,
  align = "left",
  strong = false,
}: {
  children: ReactNode;
  align?: "left" | "right";
  strong?: boolean;
}) {
  return (
    <td className={`px-3 py-3 ${align === "right" ? "text-right" : "text-left"} ${strong ? "font-semibold text-white" : ""}`}>
      {children}
    </td>
  );
}
