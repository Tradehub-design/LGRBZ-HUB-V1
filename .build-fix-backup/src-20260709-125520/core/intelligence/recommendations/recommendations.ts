import type { Holding } from "@/core/portfolio/types";

export function buildRecommendations(

holdings:Holding[]

){

const output=[];

const cashHeavy=

holdings.every(

h=>h.metrics.allocationPercent<15

);

if(cashHeavy){

output.push({

title:

"Diversification looks healthy.",

score:90

});

}

const concentrated=

holdings.find(

h=>h.metrics.allocationPercent>25

);

if(concentrated){

output.push({

title:

`Consider reducing ${concentrated.ticker} concentration.`,

score:95

});

}

return output;

}
