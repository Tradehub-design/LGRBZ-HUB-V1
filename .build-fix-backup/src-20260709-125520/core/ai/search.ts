import type { Holding } from "@/core/portfolio/types";

export interface SearchResult{

ticker:string;

reason:string;

score:number;

}

export function searchPortfolio(

query:string,

holdings:Holding[]

):SearchResult[]{

const q=query.toLowerCase();

return holdings

.filter(h=>

h.ticker.toLowerCase().includes(q)||

h.company.toLowerCase().includes(q)||

h.sector.toLowerCase().includes(q)||

h.industry.toLowerCase().includes(q)

)

.map(h=>({

ticker:h.ticker,

reason:`Matched "${query}"`,

score:100

}));

}

