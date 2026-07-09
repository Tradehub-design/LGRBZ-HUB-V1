import type { Holding } from "@/core/portfolio/types";
import { getQuote } from "./marketService";

export async function revaluePortfolio(
  holdings:Holding[]
){

  return Promise.all(

    holdings.map(async holding=>{

      const quote=await getQuote(
        holding.ticker
      );

      const marketValue=
        quote.price*
        holding.quantity;

      const unrealised=
        marketValue-
        holding.metrics.costBasis;

      return{

        ...holding,

        metrics:{

          ...holding.metrics,

          marketPrice:quote.price,

          marketValue,

          unrealisedProfit:unrealised,

          unrealisedPercent:
            holding.metrics.costBasis===0
            ?0
            :(unrealised/
            holding.metrics.costBasis)*100

        }

      };

    })

  );

}
