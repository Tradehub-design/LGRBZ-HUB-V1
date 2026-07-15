"use client";

import MetricChip from "./MetricChip";

export default function AnalyticsHeader(){

return(

<div
className="
flex
flex-wrap
gap-3
mb-6
"
>

<MetricChip
label="Return"
value="+18.6%"
colour="green"
/>

<MetricChip
label="Sharpe"
value="1.84"
/>

<MetricChip
label="Drawdown"
value="-9.2%"
colour="red"
/>

<MetricChip
label="Weight"
value="8.1%"
colour="blue"
/>

<MetricChip
label="Volatility"
value="14.8%"
colour="yellow"
/>

</div>

);

}
