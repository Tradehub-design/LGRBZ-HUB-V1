import { Portfolio } from "@/core/portfolio/types";

export interface PortfolioHealth {

  score:number;

  diversification:number;

  concentration:number;

  cash:number;

  dividends:number;

  risk:number;

  message:string;

}

export function calculateHealth(

  portfolio:Portfolio

):PortfolioHealth{

  const holdings=portfolio.holdings;

  const total=

    holdings.reduce(

      (s,h)=>

        s+h.metrics.marketValue,

      0

    );

  const largest=

    holdings.length===0

      ?0

      :Math.max(

          ...holdings.map(

            h=>h.metrics.marketValue

          )

        );

  const concentration=

    total===0

      ?0

      :(largest/total)*100;

  const diversification=

    Math.min(

      holdings.length*5,

      100

    );

  const cash=

    Math.min(

      portfolio.cash.totalCash/

      Math.max(total,1)*100,

      100

    );

  const dividends=

    Math.min(

      portfolio.dividends.yearly/

      Math.max(total,1)*1000,

      100

    );

  const risk=

    Math.max(

      0,

      100-concentration

    );

  const score=Math.round(

    diversification*0.25+

    cash*0.10+

    dividends*0.15+

    risk*0.50

  );

  return{

    score,

    diversification,

    concentration,

    cash,

    dividends,

    risk,

    message:

      score>=85

      ?"Excellent"

      :score>=70

      ?"Healthy"

      :score>=55

      ?"Average"

      :"Needs Improvement"

  };

}

