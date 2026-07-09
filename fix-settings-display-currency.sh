#!/usr/bin/env bash
set -e

echo "🔧 Adding displayCurrency to settings..."

python3 <<'PY'
from pathlib import Path

p = Path("src/store/settingsStore.ts")
text = p.read_text()

text = text.replace(
  "currency: string;",
  "currency: string;\n  displayCurrency: string;",
)

text = text.replace(
  'currency: "AUD",',
  'currency: "AUD",\n  displayCurrency: "AUD",',
)

p.write_text(text)
PY

npm run build
