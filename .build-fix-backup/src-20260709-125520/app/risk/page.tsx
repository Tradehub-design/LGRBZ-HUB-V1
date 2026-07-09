import RiskDashboard from "@/components/risk/RiskDashboard";
import PositionExposure from "@/components/risk/PositionExposure";
import ConcentrationHeatmap from "@/components/risk/ConcentrationHeatmap";

export default function RiskPage(){

return(

<div className="mx-auto max-w-[1900px] px-10 py-8 space-y-6">

<RiskDashboard/>

<div className="grid gapx-10 py-8 xl:grid-cols-12">

<div className="xl:col-span-7">

<PositionExposure/>

</div>

<div className="xl:col-span-5">

<ConcentrationHeatmap/>

</div>

</div>

</div>

);

}
