import type {

Portfolio

} from "@/core/portfolio/types";

export function projectedIncome(

portfolio:Portfolio

){

return{

annual:

portfolio.dividends.forwardIncome,

monthly:

portfolio.dividends.forwardIncome/12,

weekly:

portfolio.dividends.forwardIncome/52,

daily:

portfolio.dividends.forwardIncome/365

};

}

