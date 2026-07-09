import fifoEngine from "./fifo";

import {
  Portfolio,
  PortfolioCalculator,
  PortfolioEngineResult,
  PortfolioTransaction
} from "./types";

import { calculateCash } from "./cash";
import { calculatePerformance } from "./performance";
import { calculateDividends } from "./dividends";
import { buildTimeline } from "./timeline";

export class TradeHubPortfolioCalculator
implements PortfolioCalculator {

  calculate(
    transactions:PortfolioTransaction[]
  ):PortfolioEngineResult{

    const ordered=[...transactions].sort(
      (a,b)=>{

        const ad=new Date(a.date).getTime();
        const bd=new Date(b.date).getTime();

        if(ad!==bd){
          return ad-bd;
        }

        return a.sourceRow-b.sourceRow;

      }
    );

    const fifo=fifoEngine.process(ordered);

    const cash=calculateCash(ordered);

    const dividends=calculateDividends(
      ordered
    );

    const performance=
      calculatePerformance(
        ordered,
        fifo.holdings,
        cash,
        dividends
      );

    const timeline=
      buildTimeline(
        ordered,
        fifo.holdings,
        cash
      );


    const portfolio:Portfolio={

      generatedAt:
        new Date().toISOString(),

      transactions:ordered,

      holdings:fifo.holdings,

      realisedTrades:
        fifo.realisedTrades,

      cash,

      dividends,

      performance,

      timeline,

      replay:{

        replayEnabled:false,

        replayDate:"",

        snapshot:null

      },

      dashboard:{

        portfolioValue:0,

        investedCapital:0,

        availableCash:
          cash.totalCash,

        totalProfit:0,

        totalProfitPercent:0,

        dividendsReceived:
          dividends.total,

        interestReceived:
          cash.totalInterest,

        totalFees:
          cash.totalFees,

        openPositions:
          fifo.holdings.length,

        closedPositions:0,

        highestHolding:"",

        highestHoldingValue:0,

        bestPerformer:"",

        worstPerformer:""

      }

    };


    return{

      portfolio,

      validation:{

        valid:true,

        warnings:[]

      }

    };

  }

}

export const portfolioCalculator=
new TradeHubPortfolioCalculator();

export default portfolioCalculator;

