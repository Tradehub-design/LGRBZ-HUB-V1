interface SuccessBannerProps {
  message: string;
}

export function SuccessBanner({
  message,
}: SuccessBannerProps) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
      <div className="font-semibold text-emerald-800">
        Success
      </div>

      <div className="mt-1 text-sm text-emerald-700">
        {message}
      </div>
    </div>
  );
}
