"use client";

import HoldingsTable from "../dashboard/HoldingsTable";
import PositionDetails from "./PositionDetails";
import HoldingTransactions from "./HoldingTransactions";
import HoldingDividends from "./HoldingDividends";
import CompanyProfile from "./CompanyProfile";
import AllocationGauge from "./AllocationGauge";
import WatchlistCard from "./WatchlistCard";
import HoldingNotes from "./HoldingNotes";
import QuickActions from "./QuickActions";

export default function HoldingsWorkspace(){

return(

<div className="grid gap-6 xl:grid-cols-12">

<div className="xl:col-span-8">

<HoldingsTable/>

</div>

<div className="xl:col-span-4 space-y-6">
<PositionDetails/>
<HoldingTransactions/>
<HoldingDividends/>
<CompanyProfile/>
<AllocationGauge/>
<WatchlistCard/>
<QuickActions/>
<HoldingNotes/>
</div>

</div>

);

}

