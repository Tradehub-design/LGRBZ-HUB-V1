import type {

Holding

} from "@/core/portfolio/types";

export function watchlistSuggestions(

holdings:Holding[]

){

return holdings

.filter(

h=>

h.metrics.unrealisedPercent<-8

)

.map(h=>({

ticker:h.ticker,

reason:

"Price weakness detected. Monitor for recovery."

}));

}
