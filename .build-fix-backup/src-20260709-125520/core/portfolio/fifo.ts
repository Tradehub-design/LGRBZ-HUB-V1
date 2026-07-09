import {
  Holding,
  PortfolioLot,
  PortfolioTransaction,
  RealisedTrade,
} from "./types";

const BUY_ACTIONS = new Set([
  "Buy",
]);

const SELL_ACTIONS = new Set([
  "Sell",
]);

interface WorkingLot extends PortfolioLot {
  originalQuantity:number;
}

export class FIFOEngine {

  private lots = new Map<string, WorkingLot[]>();

  private realised:RealisedTrade[] = [];

  process(transactions:PortfolioTransaction[]) {

    this.lots.clear();

    this.realised = [];

    const ordered = [...transactions].sort(
      (a,b)=>
        new Date(a.date).getTime()-
        new Date(b.date).getTime()
    );

    for(const tx of ordered){

      if(BUY_ACTIONS.has(tx.action)){
        this.processBuy(tx);
        continue;
      }

      if(SELL_ACTIONS.has(tx.action)){
        this.processSell(tx);
      }

    }

    return {

      realisedTrades:this.realised,

      remainingLots:this.flattenLots(),

      holdings:this.buildHoldings()

    };

  }

  private processBuy(
    tx:PortfolioTransaction
  ){

    const list=this.lots.get(tx.assetTicker) ?? [];

    const lot:WorkingLot={

      id:tx.id,

      ticker:tx.assetTicker,

      purchaseDate:tx.date,

      quantity:tx.quantity,

      remaining:tx.quantity,

      purchasePrice:tx.price,

      fees:tx.fees,

      currency:tx.currency,

      originalQuantity:tx.quantity

    };

    list.push(lot);

    this.lots.set(
      tx.assetTicker,
      list
    );

  }


  private processSell(
    tx:PortfolioTransaction
  ){

    const lots=this.lots.get(tx.assetTicker);

    if(!lots) return;

    let remainingSell=tx.quantity;

    while(
      remainingSell>0 &&
      lots.length>0
    ){

      const lot=lots[0];

      const qty=Math.min(
        remainingSell,
        lot.remaining
      );

      lot.remaining-=qty;

      remainingSell-=qty;

      const cost=qty*lot.purchasePrice;

      const proceeds=qty*tx.price;

      this.realised.push({

        sellTransactionId:tx.id,

        ticker:tx.assetTicker,

        buyLotId:lot.id,

        quantity:qty,

        buyPrice:lot.purchasePrice,

        sellPrice:tx.price,

        realisedProfit:
          proceeds-cost,

        realisedPercent:
          ((tx.price-lot.purchasePrice)/
          lot.purchasePrice)*100,

        fees:tx.fees,

        openDate:lot.purchaseDate,

        closeDate:tx.date

      });

      if(lot.remaining<=0){

        lots.shift();

      }

    }

  }


  private flattenLots():PortfolioLot[]{

    const output:PortfolioLot[]=[];

    for(const [,lots] of this.lots){

      for(const lot of lots){

        if(lot.remaining<=0) continue;

        output.push({

          id:lot.id,

          ticker:lot.ticker,

          purchaseDate:lot.purchaseDate,

          quantity:lot.quantity,

          remaining:lot.remaining,

          purchasePrice:lot.purchasePrice,

          fees:lot.fees,

          currency:lot.currency

        });

      }

    }

    return output;

  }

  private buildHoldings():Holding[]{

    const holdings:Holding[]=[];

    for(const [ticker,lots] of this.lots){

      const activeLots=lots.filter(
        l=>l.remaining>0
      );

      if(activeLots.length===0){

        continue;

      }

      const quantity=activeLots.reduce(
        (sum,lot)=>sum+lot.remaining,
        0
      );

      const costBasis=activeLots.reduce(
        (sum,lot)=>
          sum+(lot.remaining*lot.purchasePrice),
        0
      );

      const averageCost=
        quantity===0
          ?0
          :costBasis/quantity;

      holdings.push({

        ticker,

        company:ticker,

        exchange:"",

        currency:activeLots[0].currency,

        assetClass:"Stock",

        sector:"",

        industry:"",

        country:"",

        strategy:"",

        risk:"Medium",

        quantity,

        openLots:activeLots,

        firstPurchaseDate:activeLots[0].purchaseDate,

        lastPurchaseDate:
          activeLots[activeLots.length-1].purchaseDate,

        isClosed:false,

        metrics:{

          marketPrice:0,

          marketValue:0,

          averageCost,

          costBasis,

          realisedProfit:0,

          unrealisedProfit:0,

          totalProfit:0,

          totalReturnPercent:0,

          allocationPercent:0,

          dividendYield:0,

          yieldOnCost:0

        }

      });

    }

    return holdings;

  }


}

export const fifoEngine=new FIFOEngine();

export default fifoEngine;

