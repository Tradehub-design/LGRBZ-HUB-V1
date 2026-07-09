#!/usr/bin/env bash
set -e

echo "🔧 Adding missing dashboard helper components..."

python3 <<'PY'
from pathlib import Path

p = Path("src/app/(dashboard)/dashboard/page.tsx")
text = p.read_text()

if "function PortfolioScore(" not in text:
    text += r'''

type PortfolioScoreProps = {
  score: number;
  title: string;
  subtitle?: string;
};

function PortfolioScore({ score, title, subtitle }: PortfolioScoreProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          {subtitle ? <h3 className="mt-1 text-2xl font-bold text-slate-900">{subtitle}</h3> : null}
        </div>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-xl font-bold text-white">
          {Math.round(score)}
        </div>
      </div>
    </section>
  );
}

type AnimatedKpiCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
};

function AnimatedKpiCard({ title, value, subtitle, trend }: AnimatedKpiCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
      {subtitle || trend ? (
        <p className="mt-1 text-sm text-slate-500">{subtitle ?? trend}</p>
      ) : null}
    </section>
  );
}

type GlassStatProps = {
  label: string;
  value: string | number;
  helper?: string;
};

function GlassStat({ label, value, helper }: GlassStatProps) {
  return (
    <div className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-sm backdrop-blur">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-slate-900">{value}</p>
      {helper ? <p className="mt-1 text-sm text-slate-500">{helper}</p> : null}
    </div>
  );
}
'''

p.write_text(text)
PY

npm run build
