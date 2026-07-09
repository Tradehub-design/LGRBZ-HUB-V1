import { PortfolioTransaction } from "@/core/portfolio/types";

import { AIValidation } from "./types";

export function analyseTransaction(

transaction:PortfolioTransaction

):AIValidation[]{

const results:AIValidation[]=[];

if(transaction.fees>100){

results.push({

severity:"Warning",

title:"High Fees",

message:"Trading fees appear unusually high."

});

}

if(transaction.quantity<=0){

results.push({

severity:"Error",

title:"Invalid Quantity",

message:"Quantity must be greater than zero."

});

}

if(transaction.price<=0){

results.push({

severity:"Error",

title:"Invalid Price",

message:"Price must be greater than zero."

});

}

return results;

}

