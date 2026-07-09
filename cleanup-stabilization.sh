#!/usr/bin/env bash
set -e

echo "🧹 Cleaning stabilization issues..."

python3 <<'PY'
from pathlib import Path
import re

# --------------------------------------------------
# Fix every TS/TSX file
# --------------------------------------------------
for path in Path("src").rglob("*"):
    if path.suffix not in (".ts", ".tsx"):
        continue

    text = path.read_text(encoding="utf-8")

    # ------------------------------------------
    # Move "use client" to first line
    # ------------------------------------------
    if '"use client";' in text:
        text = text.replace('"use client";', '')
        text = text.lstrip()
        text = '"use client";\n\n' + text

    # ------------------------------------------
    # Remove accidental React import added above use client
    # ------------------------------------------
    text = re.sub(r'^import React from "react";\n', '', text)

    # ------------------------------------------
    # Add React import AFTER use client if needed
    # ------------------------------------------
    if "React." in text and 'import React from "react";' not in text:
        if text.startswith('"use client";'):
            text = text.replace(
                '"use client";\n\n',
                '"use client";\n\nimport React from "react";\n',
                1,
            )
        else:
            text = 'import React from "react";\n' + text

    # ------------------------------------------
    # safeTransaction must never import itself
    # ------------------------------------------
    if path.name == "safeTransaction.ts":
        text = re.sub(
            r'import\s+\{\s*getTransactionTotal\s*\}\s+from\s+"@/lib/portfolio/safeTransaction";\n?',
            "",
            text,
        )

    # ------------------------------------------
    # dashboard should not have local helper anymore
    # ------------------------------------------
    if path.name == "page.tsx" and "app/(dashboard)/dashboard" in str(path):
        text = re.sub(
            r'\nfunction getTransactionTotal\(transaction: unknown\)[\s\S]*?\n}\n\s*$',
            "\n",
            text,
            flags=re.MULTILINE,
        )

    path.write_text(text, encoding="utf-8")

print("Cleanup complete.")
PY

npm run build
