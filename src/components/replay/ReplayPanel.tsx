"use client";

import ReplayBanner from "./ReplayBanner";
import ReplayControls from "./ReplayControls";
import ReplayPlayer from "./ReplayPlayer";
import ReplayProgress from "./ReplayProgress";
import ReplayTimeline from "./ReplayTimeline";

export default function ReplayPanel(){

return(

<div className="space-y-4">

<ReplayBanner/>

<div className="grid gap-4 lg:grid-cols-[1fr_auto]">

<ReplayTimeline/>

<ReplayControls/>
<ReplayPlayer/>
<ReplayProgress/>

</div>

</div>

);

}

