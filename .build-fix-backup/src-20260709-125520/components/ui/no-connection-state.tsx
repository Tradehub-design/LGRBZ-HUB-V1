interface NoConnectionStateProps {
  onRetry?: () => void;
}

export function NoConnectionState({
  onRetry,
}: NoConnectionStateProps) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
      <h2 className="text-xl font-semibold text-amber-900">
        No Internet Connection
      </h2>

      <p className="mt-2 text-sm text-amber-700">
        Live prices and cloud syncing are currently unavailable.
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 rounded-2xl bg-slate-950 px-4 py-2 text-white"
        >
          Retry
        </button>
      )}
    </div>
  );
}
