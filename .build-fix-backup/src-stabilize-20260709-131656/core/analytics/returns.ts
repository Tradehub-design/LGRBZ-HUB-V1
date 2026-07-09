import type { Portfolio } from "@/core/portfolio/types";

export interface ReturnMetrics{

daily:number;

weekly:number;

monthly:number;

quarterly:number;

yearly:number;

cagr:number;

moneyWeighted:number;

timeWeighted:number;

}

export function calculateReturns(

portfolio:Portfolio

):ReturnMetrics{

const invested=

portfolio.cash.totalDeposits-

portfolio.cash.totalWithdrawals;

const current=

portfolio.performance

.allTime

.marketValue+

portfolio.cash.totalCash;

const total=

invested===0

?0

:(current-invested)/invested;

return{

daily:0,

weekly:0,

monthly:0,

quarterly:0,

yearly:total,

cagr:0,

moneyWeighted:0,

timeWeighted:0

};

}

