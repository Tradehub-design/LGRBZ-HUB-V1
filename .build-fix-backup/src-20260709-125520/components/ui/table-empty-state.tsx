type TableEmptyStateProps = {
  title?: string;
  description?: string;
};

export function TableEmptyState({
  title = "No records found",
  description = "Try changing your filters or adding new data.",
}: TableEmptyStateProps) {
  return (
    <div className="px-5 py-12 text-center">
      <div className="text-sm font-semibold text-slate-950">{title}</div>
      <div className="mt-1 text-sm text-slate-500">{description}</div>
    </div>
  );
}
