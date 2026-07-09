import type {

Holding

} from "@/core/portfolio/types";

export function concentrationWarnings(

holdings:Holding[]

){

return holdings

.filter(

h=>

h.metrics.allocationPercent>15

)

.map(h=>({

ticker:h.ticker,

allocation:

h.metrics.allocationPercent

}));

}
