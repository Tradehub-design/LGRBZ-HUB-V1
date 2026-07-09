import type { Holding } from "@/core/portfolio/types";

export function drawdownAlerts(

holdings:Holding[]

){

return holdings

.filter(

h=>

h.metrics.unrealisedPercent<-20

)

.map(h=>({

ticker:h.ticker,

drawdown:h.metrics.unrealisedPercent

}));

}
