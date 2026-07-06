interface ComingSoonCardProps {
  title: string;
  description: string;
}

export function ComingSoonCard({
  title,
  description,
}: ComingSoonCardProps) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 py-16 text-center">
      <h2 className="text-xl font-semibold text-slate-900">
        {title}
      </h2>

      <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}
