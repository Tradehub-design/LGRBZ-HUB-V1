import type { Portfolio } from "@/core/portfolio/types";

export function calculateConfidence(
portfolio:Portfolio
){

let confidence=100;

if(portfolio.holdings.length<5){

confidence-=15;

}

if(portfolio.performance.winRate<40){

confidence-=20;

}

if(portfolio.cash.totalCash<0){

confidence-=15;

}

return Math.max(0,confidence);

}
