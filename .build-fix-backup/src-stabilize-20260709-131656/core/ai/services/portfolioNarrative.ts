import type {

PortfolioSnapshot

} from "@/core/business/models/PortfolioSnapshot";

export function buildNarrative(

snapshot:PortfolioSnapshot

){

if(

snapshot.returnPercent>15

){

return "Portfolio is performing strongly above target.";

}

if(

snapshot.returnPercent>0

){

return "Portfolio remains positive with stable growth.";

}

return "Portfolio is currently below cost basis. Monitor risk and opportunities.";

}
