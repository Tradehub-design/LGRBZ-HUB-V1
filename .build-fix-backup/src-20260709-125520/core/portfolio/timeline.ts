import {
  CashSummary,
  EquityPoint,
  Holding,
  PortfolioTransaction
} from "./types";

export function buildTimeline(

  transactions:PortfolioTransaction[],

  holdings:Holding[],

  cash:CashSummary

):EquityPoint[]{

  const timeline:EquityPoint[]=[];

  let invested=0;

  for(const tx of transactions){

    if(
      tx.action==="Cash Deposit" ||
      tx.action==="Transfer Deposit"
    ){

      invested+=tx.price;

    }

    if(
      tx.action==="Cash Withdrawal" ||
      tx.action==="Transfer Send"
    ){

      invested-=tx.price;

    }

    timeline.push({

      date:tx.date,

      invested,

      cash:cash.totalCash,

      portfolioValue:0,

      profit:0

    });

  }

  return timeline;

}

export default buildTimeline;

