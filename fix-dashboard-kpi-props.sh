#!/usr/bin/env bash
set -e

echo "🔧 Updating dashboard helper prop types..."

python3 <<'PY'
from pathlib import Path

p = Path("src/app/(dashboard)/dashboard/page.tsx")
text = p.read_text()

text = text.replace(
'''type AnimatedKpiCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
};''',
'''type AnimatedKpiCardProps = {
  icon?: React.ReactNode;
  title?: string;
  label?: string;
  value: string | number;
  subtitle?: string;
  helper?: string;
  trend?: string;
};'''
)

text = text.replace(
'''function AnimatedKpiCard({ title, value, subtitle, trend }: AnimatedKpiCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
      {subtitle || trend ? (
        <p className="mt-1 text-sm text-slate-500">{subtitle ?? trend}</p>
      ) : null}
    </section>
  );
}''',
'''function AnimatedKpiCard({ icon, title, label, value, subtitle, helper, trend }: AnimatedKpiCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label ?? title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
        </div>
        {icon ? <div className="rounded-xl bg-slate-100 p-2 text-slate-700">{icon}</div> : null}
      </div>
      {subtitle || helper || trend ? (
        <p className="mt-1 text-sm text-slate-500">{helper ?? subtitle ?? trend}</p>
      ) : null}
    </section>
  );
}'''
)

p.write_text(text)
PY

npm run build
