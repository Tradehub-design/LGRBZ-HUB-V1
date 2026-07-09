import type {

PortfolioTransaction

} from "@/core/portfolio/types";

export interface ValidationIssue{

row:number;

severity:"Error"|"Warning";

message:string;

}

export function validateTransactions(

transactions:PortfolioTransaction[]

):ValidationIssue[]{

const issues:ValidationIssue[]=[];

transactions.forEach((tx,index)=>{

if(!tx.assetTicker){

issues.push({

row:index+1,

severity:"Error",

message:"Missing ticker"

});

}

if(tx.quantity<=0){

issues.push({

row:index+1,

severity:"Error",

message:"Quantity must be greater than zero"

});

}

if(tx.price<0){

issues.push({

row:index+1,

severity:"Error",

message:"Invalid price"

});

}

});

return issues;

}

