import type {

Holding

} from "@/core/portfolio/types";

export function sectorExposure(

holdings:Holding[]

){

const exposure:

Record<string,number>={};

for(

const holding of holdings

){

const sector=

holding.sector||

"Unknown";

exposure[sector]=

(exposure[sector]||0)+

holding.metrics.marketValue;

}

return exposure;

}

