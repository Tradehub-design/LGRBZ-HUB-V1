import {
  CashAccount,
  CashSummary,
  PortfolioTransaction
} from "./types";

const DEPOSIT_ACTIONS = new Set([
  "Cash Deposit",
  "Transfer Deposit"
]);

const WITHDRAW_ACTIONS = new Set([
  "Cash Withdrawal",
  "Transfer Send"
]);

const DIVIDEND_ACTIONS = new Set([
  "Cash Dividend"
]);

const INTEREST_ACTIONS = new Set([
  "Cash Interest"
]);

const BUY_ACTIONS = new Set([
  "Buy"
]);

const SELL_ACTIONS = new Set([
  "Sell"
]);

function getAccount(

  accounts:Map<string,CashAccount>,

  broker:string,

  currency:string

):CashAccount{

  const key=`${broker}_${currency}`;

  let account=accounts.get(key);

  if(account){

    return account;

  }

  account={

    broker,

    currency:currency as any,

    balance:0,

    deposited:0,

    withdrawn:0,

    dividends:0,

    interest:0,

    fees:0,

    invested:0,

    realisedSales:0

  };

  accounts.set(key,account);

  return account;

}


export function calculateCash(

  transactions:PortfolioTransaction[]

):CashSummary{

  const accounts=new Map<
    string,
    CashAccount
  >();

  for(const tx of transactions){

    const account=getAccount(

      accounts,

      tx.platform,

      tx.currency

    );

    if(DEPOSIT_ACTIONS.has(tx.action)){

      account.deposited+=tx.price;

      account.balance+=tx.price;

    }

    if(WITHDRAW_ACTIONS.has(tx.action)){

      account.withdrawn+=tx.price;

      account.balance-=tx.price;

    }

    if(DIVIDEND_ACTIONS.has(tx.action)){

      account.dividends+=tx.price;

      account.balance+=tx.price;

    }

    if(INTEREST_ACTIONS.has(tx.action)){

      account.interest+=tx.price;

      account.balance+=tx.price;

    }

    if(BUY_ACTIONS.has(tx.action)){

      const total=

        tx.quantity*tx.price+tx.fees;

      account.invested+=total;

      account.balance-=total;

      account.fees+=tx.fees;

    }

    if(SELL_ACTIONS.has(tx.action)){

      const total=

        tx.quantity*tx.price-tx.fees;

      account.realisedSales+=total;

      account.balance+=total;

      account.fees+=tx.fees;

    }

  }


  const values=[
    ...accounts.values()
  ];

  return{

    accounts:values,

    totalCash:values.reduce(
      (t,a)=>t+a.balance,
      0
    ),

    totalDeposits:values.reduce(
      (t,a)=>t+a.deposited,
      0
    ),

    totalWithdrawals:values.reduce(
      (t,a)=>t+a.withdrawn,
      0
    ),

    totalDividends:values.reduce(
      (t,a)=>t+a.dividends,
      0
    ),

    totalInterest:values.reduce(
      (t,a)=>t+a.interest,
      0
    ),

    totalFees:values.reduce(
      (t,a)=>t+a.fees,
      0
    ),

    totalInvested:values.reduce(
      (t,a)=>t+a.invested,
      0
    ),

    totalSales:values.reduce(
      (t,a)=>t+a.realisedSales,
      0
    )

  };

}

export default calculateCash;

