import type {

Holding

} from "@/core/portfolio/types";

export function opportunityScore(

holding:Holding

){

let score=50;

if(

holding.metrics.unrealisedPercent<-15

){

score+=30;

}

if(

holding.metrics.allocationPercent<5

){

score+=10;

}

return score;

}
