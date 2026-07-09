import type { Portfolio } from "@/core/portfolio/types";

export function buildDailySummary(

portfolio:Portfolio

):string[]{

const output:string[]=[];

output.push(

`Portfolio contains ${portfolio.holdings.length} active holdings.`

);

output.push(

`Cash balance: $${portfolio.cash.totalCash.toFixed(2)}`

);

output.push(

`Dividend income received: $${portfolio.dividends.total.toFixed(2)}`

);

return output;

}

