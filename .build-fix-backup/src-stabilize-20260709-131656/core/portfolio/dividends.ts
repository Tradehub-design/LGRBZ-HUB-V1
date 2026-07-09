import {
  DividendRecord,
  DividendSummary,
  PortfolioTransaction
} from "./types";

export function calculateDividends(
  transactions:PortfolioTransaction[]
):DividendSummary{

  const records:DividendRecord[]=[];

  let total=0;

  for(const tx of transactions){

    if(tx.action!=="Cash Dividend"){
      continue;
    }

    records.push({

      id:tx.id,

      ticker:tx.assetTicker,

      company:tx.assetTicker,

      paymentDate:tx.date,

      amount:tx.price,

      currency:tx.currency,

      franking:0,

      shares:tx.quantity,

      dividendPerShare:tx.quantity===0
        ?0
        :tx.price/tx.quantity

    });

    total+=tx.price;

  }


  const yearly=total;

  const monthly=yearly/12;

  return{

    total,

    monthly,

    yearly,

    forwardIncome:yearly,

    yield:0,

    yieldOnCost:0,

    records

  };

}

export default calculateDividends;

