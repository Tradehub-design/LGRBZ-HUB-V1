import { Sparkles } from "lucide-react";

export function InsightFeed({
  insights,
}: {
  insights: { id: string; title: string; detail: string; category?: string }[];
}) {
  return (
    <div className="space-y-3">
      {insights.slice(0, 6).map((insight) => (
        <div
          key={insight.id}
          className="rounded-2xl border border-[#173047] bg-[#0b1e30] p-4 transition hover:border-sky-500/70"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sky-300">
              <Sparkles className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">{insight.title}</p>
              <p className="mt-1 text-sm text-slate-400">{insight.detail}</p>
              {insight.category ? (
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">
                  {insight.category}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
