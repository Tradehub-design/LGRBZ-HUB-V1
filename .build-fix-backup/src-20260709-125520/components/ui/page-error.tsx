type PageErrorProps = {
  title?: string;
  description?: string;
};

export function PageError({
  title = "Something went wrong",
  description = "The page could not be loaded. Please try again.",
}: PageErrorProps) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
      <h2 className="text-lg font-semibold text-rose-900">{title}</h2>
      <p className="mt-2 text-sm text-rose-700">{description}</p>
    </div>
  );
}
