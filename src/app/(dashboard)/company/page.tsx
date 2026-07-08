"use client";

import { PriceChart } from "@/components/market/price-chart";
import {
Workspace,
WorkspaceHeader,
WorkspacePanel
} from "@/components/workspace";

export default function CompanyWorkspace(){

return(

<Workspace>

<WorkspaceHeader

eyebrow="Research"

title="Company Workspace"

description="Company overview with interactive market chart."

/>

<WorkspacePanel title="Price History">

<PriceChart/>

</WorkspacePanel>

</Workspace>

)

}
