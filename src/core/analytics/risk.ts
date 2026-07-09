import type { Portfolio } from "@/core/portfolio/types";

export interface RiskMetrics{

volatility:number;

beta:number;

alpha:number;

sharpe:number;

sortino:number;

calmar:number;

ulcer:number;

maxDrawdown:number;

}

export function calculateRisk(

portfolio:Portfolio

):RiskMetrics{

return{

volatility:0,

beta:0,

alpha:0,

sharpe:0,

sortino:0,

calmar:0,

ulcer:0,

maxDrawdown:0

};

}

