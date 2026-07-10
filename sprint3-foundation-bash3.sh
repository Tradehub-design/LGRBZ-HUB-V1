#!/usr/bin/env bash
set -e

echo "🔧 Sprint 3 Bash 3: sidebar visibility and dashboard shell polish..."

cat > 'src/app/(dashboard)/layout.tsx' <<'TSX'
"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import PortfolioPersistenceProvider from "@/providers/PortfolioPersistenceProvider";
import { useSettingsStore } from "@/store/settingsStore";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const collapsed = useSettingsStore((state) => state.sidebarCollapsed);

  return (
    <PortfolioPersistenceProvider>
      <div className="min-h-screen bg-[#061421] text-white">
        <Sidebar />

        <main
          className={
            collapsed
              ? "min-h-screen transition-all duration-300 lg:pl-[84px]"
              : "min-h-screen transition-all duration-300 lg:pl-[264px]"
          }
        >
          <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-[1800px]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </PortfolioPersistenceProvider>
  );
}
TSX

python3 <<'PY'
from pathlib import Path

p = Path("src/components/layout/Sidebar.tsx")
text = p.read_text()

text = text.replace(
  '"fixed left-0 top-0 z-40 hidden h-dvh border-r border-[#173047] bg-[#071827] transition-all duration-300 lg:block",',
  '"fixed left-0 top-0 z-50 hidden h-dvh overflow-hidden border-r border-[#173047] bg-[#071827] transition-all duration-300 lg:block",'
)

text = text.replace(
  '<nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">',
  '<nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4 pb-10">'
)

p.write_text(text)
PY

npm run build
