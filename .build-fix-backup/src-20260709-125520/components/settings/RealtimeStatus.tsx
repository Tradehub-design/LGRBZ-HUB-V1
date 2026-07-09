"use client";

import {

syncStatistics

} from "@/core/sync/statistics";

export default function RealtimeStatus(){

const stats=

syncStatistics();

return(

<div className="rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 p-5">

<h2 className="font-semibold">

Realtime Sync

</h2>

<div className="mt-4 space-y-2">

<div>

Queue:

<strong>

{stats.queued}

</strong>

</div>

<div>

Pending:

<strong>

{stats.pending}

</strong>

</div>

</div>

</div>

);

}
