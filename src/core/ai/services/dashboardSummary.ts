import type {

Portfolio

} from "@/core/portfolio/types";

import type {

PortfolioSnapshot

} from "@/core/business/models/PortfolioSnapshot";

import {

forecastPortfolio

} from "../forecast/forecastEngine";

import {

buildNarrative

} from "./portfolioNarrative";

export function buildAISummary(

portfolio:Portfolio,

snapshot:PortfolioSnapshot

){

return{

forecast:

forecastPortfolio(

portfolio

),

narrative:

buildNarrative(

snapshot

)

};

}
