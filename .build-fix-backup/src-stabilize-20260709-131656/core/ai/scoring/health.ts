import type { Portfolio } from "@/core/portfolio/types";

export function healthScore(

portfolio:Portfolio

){

let score=100;

if(portfolio.holdings.length<5){

score-=15;

}

if(portfolio.performance.winRate<50){

score-=10;

}

if(portfolio.cash.totalCash<0){

score-=10;

}

return Math.max(0,score);

}
