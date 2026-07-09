type FilterChipProps = {
  label: string;
  active?: boolean;
};

export function FilterChip({ label, active }: FilterChipProps) {
  return (
    <span
      className={[
        "rounded-full px-3 py-1 text-xs font-semibold",
        active
          ? "bg-slate-950 text-white"
          : "bg-slate-100 text-slate-700",
      ].join(" ")}
    >
      {label}
    </span>
  );
}
