import type { Portfolio } from "@/core/portfolio/types";

import { buildTimeline } from "../timeline/buildTimeline";

import { buildRecommendations } from "../recommendations/recommendations";

export function buildDashboardIntelligence(

portfolio:Portfolio

){

return{

timeline:

buildTimeline(portfolio),

recommendations:

buildRecommendations(

portfolio.holdings

)

};

}
