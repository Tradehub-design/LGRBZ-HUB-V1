"use client";

import {

useAISummaryStore

} from "@/store/ai/summaryStore";

export default function AIForecast(){

const {

summary

}=useAISummaryStore();

if(!summary){

return null;

}

return(

<div className="rounded-2xl border bg-card p-6 shadow-sm">

<h2 className="mb-5 text-lg font-semibold">

AI Forecast

</h2>

<div className="text-4xl font-bold">

$

{summary.forecast.expectedValue.toLocaleString()}

</div>

<div className="mt-3 text-sm text-muted-foreground">

5 Year Projection

</div>

<div className="mt-6">

{summary.narrative}

</div>

</div>

);

}
