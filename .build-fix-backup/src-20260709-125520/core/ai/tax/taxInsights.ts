import type {

Holding

} from "@/core/portfolio/types";

export function taxInsights(

holdings:Holding[]

){

return holdings

.filter(

h=>

h.metrics.unrealisedProfit>0

)

.map(h=>({

ticker:h.ticker,

message:

"Potential capital gains event if sold."

}));

}
