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
