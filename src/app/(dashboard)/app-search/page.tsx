import { AppActionsCard } from "@/features/app-shell/components/app-actions-card";
import { ApplicationHealthCard } from "@/features/app-shell/components/application-health-card";
import { AppOverviewCard } from "@/features/app-shell/components/app-overview-card";
import { AppShellFooter } from "@/features/app-shell/components/app-shell-footer";
import { FavouritePagesCard } from "@/features/app-shell/components/favorite-pages-card";
import { GlobalCommandPalette } from "@/features/app-shell/components/global-command-palette";
import { GlobalSearchBar } from "@/features/app-shell/components/global-search-bar";
import { QuickNavigationCard } from "@/features/app-shell/components/quick-navigation-card";
import { RecentActivityCard } from "@/features/app-shell/components/recent-activity-card";
import { RecentSearchesCard } from "@/features/app-shell/components/recent-searches-card";
import { SystemStatusCard } from "@/features/app-shell/components/system-status-card";

export default function AppSearchPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Application Hub
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Search, navigate and manage every feature across the portfolio platform.
        </p>
      </div>

      <GlobalSearchBar />

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentSearchesCard />
        <SystemStatusCard />
      </div>

      <QuickNavigationCard />

      <div className="grid gap-6 xl:grid-cols-2">
        <FavouritePagesCard />
        <RecentActivityCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <AppOverviewCard />
        <ApplicationHealthCard />
      </div>

      <GlobalCommandPalette />

      <AppActionsCard />

      <AppShellFooter />
    </div>
  );
}
