import type { Holding } from "@/core/portfolio/types";

import type { AIInsight } from "../models/types";

export function diversificationInsights(

holdings:Holding[]

):AIInsight[]{

if(

holdings.length>=10

){

return[];

}

return[{

id:crypto.randomUUID(),

title:"Portfolio could be more diversified",

summary:"Less than 10 holdings detected.",

details:"Adding additional high-quality positions may reduce concentration risk over time.",

severity:"warning",

score:82,

category:"Diversification",

created:new Date().toISOString()

}];

}
