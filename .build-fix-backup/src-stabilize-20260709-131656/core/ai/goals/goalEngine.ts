import type { PortfolioSnapshot }

from "@/core/business/models/PortfolioSnapshot";

export function progressToGoal(

snapshot:PortfolioSnapshot,

goal:number

){

return{

goal,

current:

snapshot.portfolioValue,

progress:

goal===0

?0

:(snapshot.portfolioValue/goal)*100

};

}
