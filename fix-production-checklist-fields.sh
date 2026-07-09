#!/usr/bin/env bash
set -e

echo "🔧 Adding checklist label/area fields..."

python3 <<'PY'
from pathlib import Path

p = Path("src/lib/system/productionChecklist.ts")
text = p.read_text()

text = text.replace(
'''  title: string;
  category: string;''',
'''  title: string;
  label: string;
  category: string;
  area: string;'''
)

text = text.replace(
'''title: "Dashboard",
    category: "Core",''',
'''title: "Dashboard",
    label: "Dashboard",
    category: "Core",
    area: "Core",'''
)

text = text.replace(
'''title: "Portfolio Engine",
    category: "Core",''',
'''title: "Portfolio Engine",
    label: "Portfolio Engine",
    category: "Core",
    area: "Core",'''
)

text = text.replace(
'''title: "Analytics",
    category: "Reporting",''',
'''title: "Analytics",
    label: "Analytics",
    category: "Reporting",
    area: "Reporting",'''
)

text = text.replace(
'''title: "Broker Sync",
    category: "Integrations",''',
'''title: "Broker Sync",
    label: "Broker Sync",
    category: "Integrations",
    area: "Integrations",'''
)

p.write_text(text)
PY

npm run build
