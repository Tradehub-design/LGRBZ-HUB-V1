import type { Portfolio }

from "@/core/portfolio/types";

import type { PortfolioSnapshot }

from "@/core/business/models/PortfolioSnapshot";

import { diversificationInsights }

from "../engines/diversification";

import { incomeInsights }

from "../engines/income";

import { riskInsights }

from "../engines/risk";

import { performanceInsights }

from "../engines/performance";

export function buildInsights(

portfolio:Portfolio,

snapshot:PortfolioSnapshot

){

return[

...riskInsights(

portfolio.holdings

),

...incomeInsights(

portfolio

),

...performanceInsights(

snapshot

),

...diversificationInsights(

portfolio.holdings

)

].sort(

(a,b)=>b.score-a.score

);

}
