import type { Holding } from "@/core/portfolio/types";

export function allocationDiagnostics(

holdings:Holding[]

){

return holdings

.sort(

(a,b)=>

b.metrics.allocationPercent-

a.metrics.allocationPercent

)

.map(h=>({

ticker:h.ticker,

allocation:h.metrics.allocationPercent,

status:

h.metrics.allocationPercent>20

?"High"

:h.metrics.allocationPercent<2

?"Low"

:"Healthy"

}));

}
