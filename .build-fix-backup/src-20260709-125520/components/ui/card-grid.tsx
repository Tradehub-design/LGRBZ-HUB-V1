import type { ReactNode } from "react";

type CardGridProps = {
  children: ReactNode;
  columns?: 2 | 3 | 4;
};

export function CardGrid({ children, columns = 4 }: CardGridProps) {
  const gridClass =
    columns === 2
      ? "xl:grid-cols-2"
      : columns === 3
        ? "xl:grid-cols-3"
        : "xl:grid-cols-4";

  return (
    <div className={["grid gap-4 md:grid-cols-2", gridClass].join(" ")}>
      {children}
    </div>
  );
}
