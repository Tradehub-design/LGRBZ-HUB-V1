import type { Holding } from "@/core/portfolio/types";

export function rebalanceSuggestions(

holdings:Holding[]

){

return holdings

.filter(

h=>

h.metrics.allocationPercent>15

)

.map(h=>({

ticker:h.ticker,

target:10,

current:h.metrics.allocationPercent

}));

}
