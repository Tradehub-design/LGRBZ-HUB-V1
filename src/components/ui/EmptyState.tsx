type EmptyStateProps = {
  title?: string;
  description?: string;
};

export default function EmptyState({
  title = "Nothing here yet",
  description = "There is no data to show.",
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center">
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </div>
  );
}

export { EmptyState };
