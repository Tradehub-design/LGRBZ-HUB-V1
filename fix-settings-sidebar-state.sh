#!/usr/bin/env bash
set -e

echo "🔧 Fixing settings sidebar state..."

python3 <<'PY'
from pathlib import Path

candidates = list(Path("src").rglob("*settings*store*.ts")) + list(Path("src").rglob("*settingsStore*.ts"))

if not candidates:
    raise SystemExit("Could not find settings store file")

p = candidates[0]
print(f"Patching {p}")

text = p.read_text()

# Add properties to SettingsState type/interface
text = text.replace(
  "settings:",
  "sidebarCollapsed: boolean;\n  toggleSidebar: () => void;\n  settings:",
  1
)

# Add implementation into create/store object
text = text.replace(
  "settings:",
  "sidebarCollapsed: false,\n  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),\n  settings:",
  1
)

p.write_text(text)
PY

npm run build
