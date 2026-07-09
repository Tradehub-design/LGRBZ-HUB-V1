#!/usr/bin/env bash
set -e

echo "🔧 Updating GlassStat props..."

python3 <<'PY'
from pathlib import Path

p = Path("src/app/(dashboard)/dashboard/page.tsx")
text = p.read_text()

text = text.replace(
'''type GlassStatProps = {
  label: string;
  value: string | number;
  helper?: string;
};''',
'''type GlassStatProps = {
  title?: string;
  label?: string;
  value: string | number;
  helper?: string;
};'''
)

text = text.replace(
'''function GlassStat({ label, value, helper }: GlassStatProps) {
  return (
    <div className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-sm backdrop-blur">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-slate-900">{value}</p>
      {helper ? <p className="mt-1 text-sm text-slate-500">{helper}</p> : null}
    </div>
  );
}''',
'''function GlassStat({ title, label, value, helper }: GlassStatProps) {
  return (
    <div className="rounded-2xl border border-white/50 bg-white/70 p-4 shadow-sm backdrop-blur">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label ?? title}</p>
      <p className="mt-2 text-xl font-bold text-slate-900">{value}</p>
      {helper ? <p className="mt-1 text-sm text-slate-500">{helper}</p> : null}
    </div>
  );
}'''
)

p.write_text(text)
PY

npm run build
