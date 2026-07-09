import type { Portfolio }

from "@/core/portfolio/types";

import type { PortfolioSnapshot }

from "@/core/business/models/PortfolioSnapshot";

import {

calculateConfidence

} from "../confidence/confidenceEngine";

import {

allocationDiagnostics

} from "../diagnostics/allocation";

import {

drawdownAlerts

} from "../diagnostics/drawdown";

import {

rebalanceSuggestions

} from "../diagnostics/rebalancing";

export function buildAIWorkspace(

portfolio:Portfolio,

snapshot:PortfolioSnapshot

){

return{

confidence:

calculateConfidence(

portfolio

),

allocation:

allocationDiagnostics(

portfolio.holdings

),

drawdowns:

drawdownAlerts(

portfolio.holdings

),

rebalance:

rebalanceSuggestions(

portfolio.holdings

),

portfolioValue:

snapshot.portfolioValue

};

}
