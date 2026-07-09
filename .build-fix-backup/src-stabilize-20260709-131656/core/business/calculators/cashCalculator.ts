import type { PortfolioTransaction } from "@/core/portfolio/types";

export function calculateCash(

transactions:PortfolioTransaction[]

){

let cash=0;

let fees=0;

let dividends=0;

let interest=0;

for(const tx of transactions){

switch(tx.action){

case "Deposit":

cash+=tx.price;

break;

case "Withdrawal":

cash-=tx.price;

break;

case "Buy":

cash-=tx.price*tx.quantity;

break;

case "Sell":

cash+=tx.price*tx.quantity;

break;

case "Dividend":

cash+=tx.price;

dividends+=tx.price;

break;

case "Interest":

cash+=tx.price;

interest+=tx.price;

break;

}

fees+=tx.fees;

}

return{

cash,

fees,

dividends,

interest

};

}

