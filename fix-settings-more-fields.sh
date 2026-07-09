#!/usr/bin/env bash
set -e

echo "🔧 Adding remaining settings fields..."

python3 <<'PY'
from pathlib import Path

p = Path("src/store/settingsStore.ts")
text = p.read_text()

text = text.replace(
  "showDemoWarnings: boolean;",
  "showDemoWarnings: boolean;\n  enableAnimations: boolean;\n  enableOfflineMode: boolean;",
)

text = text.replace(
  "showDemoWarnings: true,",
  "showDemoWarnings: true,\n  enableAnimations: true,\n  enableOfflineMode: false,",
)

p.write_text(text)
PY

npm run build
