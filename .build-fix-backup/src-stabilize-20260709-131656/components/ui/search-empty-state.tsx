type SearchEmptyStateProps = {
  query: string;
};

export function SearchEmptyState({
  query,
}: SearchEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
      <div className="text-lg font-semibold text-slate-900">
        No results found
      </div>

      <div className="mt-2 text-sm text-slate-500">
        No results matched "{query}".
      </div>
    </div>
  );
}
