import type {

Portfolio

} from "@/core/portfolio/types";

import {

calculatePortfolioScore

} from "../scoring/portfolioScore";

import {

incomeForecast

} from "../watchers/incomeWatcher";

export function buildDashboardSummary(

portfolio:Portfolio

){

return{

health:

calculatePortfolioScore(

portfolio

),

income:

incomeForecast(

portfolio

),

positions:

portfolio.holdings.length,

cash:

portfolio.cash.totalCash

};

}
