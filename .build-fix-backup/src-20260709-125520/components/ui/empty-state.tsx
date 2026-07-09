interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-white py-20 text-center">
      <div className="mx-auto max-w-sm">
        <h3 className="text-lg font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-3 text-sm text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}
