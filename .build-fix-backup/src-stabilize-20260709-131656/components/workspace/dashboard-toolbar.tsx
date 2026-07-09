"use client";

import { Grid2x2, LayoutDashboard, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function DashboardToolbar(){

return(

<div className="mb-6 flex flex-wrap gap-3">

<Button variant="secondary" leftIcon={<LayoutDashboard size={16}/>}>
Dashboard Layout
</Button>

<Button variant="secondary" leftIcon={<Grid2x2 size={16}/>}>
Widgets
</Button>

<Button variant="secondary" leftIcon={<RefreshCw size={16}/>}>
Refresh
</Button>

</div>

)

}
