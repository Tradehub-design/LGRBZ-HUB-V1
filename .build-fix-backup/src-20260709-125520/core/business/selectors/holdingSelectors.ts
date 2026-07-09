import type {

Holding

} from "@/core/portfolio/types";

export function largestHolding(

holdings:Holding[]

){

return holdings

.slice()

.sort(

(a,b)=>

b.metrics.marketValue-

a.metrics.marketValue

)[0];

}

export function winners(

holdings:Holding[]

){

return holdings.filter(

h=>

h.metrics.unrealisedProfit>0

);

}

export function losers(

holdings:Holding[]

){

return holdings.filter(

h=>

h.metrics.unrealisedProfit<0

);

}

