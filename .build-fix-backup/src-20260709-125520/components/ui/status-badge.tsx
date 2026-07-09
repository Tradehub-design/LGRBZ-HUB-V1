interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({
  status,
}: StatusBadgeProps) {
  const colour =
    status === "Healthy" ||
    status === "Completed" ||
    status === "Ready"
      ? "bg-emerald-100 text-emerald-700"
      : status === "Warning" ||
        status === "Needs Review"
      ? "bg-amber-100 text-amber-700"
      : "bg-slate-100 text-slate-700";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${colour}`}
    >
      {status}
    </span>
  );
}
