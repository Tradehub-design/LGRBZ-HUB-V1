"use client";

import DashboardHeader from "./DashboardHeader";
import MarketStatusBanner from "@/components/market/MarketStatusBanner";
import LGRBZMarketOverview from "@/components/market/LGRBZMarketOverview";
import WatchlistPanel from "@/components/market/WatchlistPanel";
import MarketNews from "@/components/market/MarketNews";
import UpcomingEvents from "@/components/market/UpcomingEvents";
import useLivePrices from "@/hooks/useLivePrices";
import useRegisterMarketProvider from "@/hooks/useRegisterMarketProvider";
import usePortfolioLiveSync from "@/hooks/usePortfolioLiveSync";
import useBusinessEngine from "@/hooks/useBusinessEngine";
import useBackgroundSync from "@/hooks/useBackgroundSync";
import useEnterprisePlatform from "@/hooks/useEnterprisePlatform";
import useRealtimeDatabase from "@/hooks/useRealtimeDatabase";
import useEnterpriseSync from "@/hooks/useEnterpriseSync";
import usePortfolioIntelligence from "@/hooks/usePortfolioIntelligence";
import usePortfolioTimeline from "@/hooks/usePortfolioTimeline";
import useDashboardSummary from "@/hooks/useDashboardSummary";
import useMarketRuntime from "@/hooks/useMarketRuntime";
import usePortfolioRefresh from "@/hooks/usePortfolioRefresh";
import useRuntimeScheduler from "@/hooks/useRuntimeScheduler";
import useMarketSnapshots from "@/hooks/useMarketSnapshots";
import useAIEngine from "@/hooks/useAIEngine";
import useAISummary from "@/hooks/useAISummary";
import useAIWorkspace from "@/hooks/useAIWorkspace";
import useImportPlatform from "@/hooks/useImportPlatform";
import usePortfolioIntelligence from "@/hooks/usePortfolioIntelligence";
import useAdvancedBusinessEngine from "@/hooks/useAdvancedBusinessEngine";
import ReplayPanel from "@/components/replay/ReplayPanel";
import HistoricalEquityChart from "@/components/replay/HistoricalEquityChart";
import AnimatedPortfolioValue from "@/components/replay/AnimatedPortfolioValue";
import ReplayStatistics from "@/components/replay/ReplayStatistics";
import HistoricalHoldings from "@/components/replay/HistoricalHoldings";
import PerformanceCalendar from "@/components/calendar/PerformanceCalendar";
import MonthlySummary from "@/components/calendar/MonthlySummary";
import BestWorstDays from "@/components/calendar/BestWorstDays";
import PortfolioSummary
import PortfolioIntelligence
import PortfolioTimeline from "./PortfolioSummary";
import PortfolioHealthCard from "./PortfolioHealthCard";
import CashPositionCard from "./CashPositionCard";
import PortfolioAllocation from "./PortfolioAllocation";
import SectorAllocation from "./SectorAllocation";
import WinnersLosers from "./WinnersLosers";
import LargestPositionCard from "./LargestPositionCard";
import DividendIncomeCard from "./DividendIncomeCard";
import AssetAllocation from "./AssetAllocation";
import PortfolioInsights from "@/components/ai/PortfolioInsights";
import HoldingsTable from "./HoldingsTable";

export default function DashboardGrid(){

useRegisterMarketProvider();
useLivePrices();
usePortfolioLiveSync();
useBusinessEngine();
useEnterprisePlatform();
useBackgroundSync();
useRealtimeDatabase();
useEnterpriseSync();
usePortfolioIntelligence();
usePortfolioTimeline();
useDashboardSummary();
useMarketRuntime();
usePortfolioRefresh();
useRuntimeScheduler();
useMarketSnapshots();
useAIEngine();
useAISummary();
useAIWorkspace();
useImportPlatform();
useAdvancedBusinessEngine();

return(

<div className="mx-auto max-w-[1800px] p-6">

<DashboardHeader/>

<MarketStatusBanner/>

<LGRBZMarketOverview/>

<div className="mt-6 grid gap-6 xl:grid-cols-12">
<div className="xl:col-span-4"><WatchlistPanel/></div>
<div className="xl:col-span-4"><UpcomingEvents/></div>
<div className="xl:col-span-4"><MarketNews/></div>
</div>

<ReplayPanel/>

<div className="mt-6 grid gap-6 xl:grid-cols-12">
<div className="xl:col-span-4"><AnimatedPortfolioValue/></div>
<div className="xl:col-span-8"><ReplayStatistics/></div>
<div className="xl:col-span-12"><HistoricalEquityChart/></div>
<div className="xl:col-span-12"><HistoricalHoldings/>

<div className="mt-6 grid gap-6 xl:grid-cols-12">
<div className="xl:col-span-8"><PerformanceCalendar/></div>
<div className="xl:col-span-4"><MonthlySummary/></div>
<div className="xl:col-span-12"><BestWorstDays/></div>
</div></div>
</div>

<div className="mt-6">

<PortfolioSummary/>
<PortfolioIntelligence/>
<PortfolioTimeline/>

</div>

<div className="mt-6 grid gap-6 xl:grid-cols-12">

<div className="xl:col-span-3">

<PortfolioHealthCard/>

</div>

<div className="xl:col-span-3">

<CashPositionCard/>

</div>

<div className="xl:col-span-6">

<PortfolioAllocation/>

</div>

<div className="xl:col-span-3"><LargestPositionCard/></div>

<div className="xl:col-span-3"><DividendIncomeCard/></div>

<div className="xl:col-span-3"><AssetAllocation/></div>

<div className="xl:col-span-3"><SectorAllocation/>
<PortfolioInsights/></div>

<div className="xl:col-span-8">

<WinnersLosers/>

</div>

<div className="xl:col-span-12">

<HoldingsTable/>

</div>

</div>

</div>

);

}

