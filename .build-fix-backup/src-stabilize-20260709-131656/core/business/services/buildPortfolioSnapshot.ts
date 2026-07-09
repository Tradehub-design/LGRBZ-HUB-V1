import type {

Portfolio

} from "@/core/portfolio/types";

import {

calculateHoldingTotals

} from "../calculators/holdingsCalculator";

import {

calculateCash

} from "../calculators/cashCalculator";

import {

calculatePerformance

} from "../calculators/performanceCalculator";

export function buildPortfolioSnapshot(

portfolio:Portfolio

){

const holdings=

calculateHoldingTotals(

portfolio.holdings

);

const cash=

calculateCash(

portfolio.transactions

);

const perf=

calculatePerformance(

holdings.costBasis,

holdings.marketValue,

portfolio.performance.realisedPnL,

cash.dividends

);

return{

generatedAt:

new Date().toISOString(),

marketValue:

holdings.marketValue,

costBasis:

holdings.costBasis,

cash:

cash.cash,

portfolioValue:

holdings.marketValue+

cash.cash,

realisedPnL:

portfolio.performance.realisedPnL,

unrealisedPnL:

holdings.unrealised,

dividends:

cash.dividends,

interest:

cash.interest,

fees:

cash.fees,

returnDollar:

perf.profit,

returnPercent:

perf.percent,

positions:

portfolio.holdings.length,

winRate:

portfolio.performance.winRate

};

}

