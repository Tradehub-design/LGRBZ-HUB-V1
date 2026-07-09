export interface IntelligenceCard{

id:string;

ticker?:string;

type:
"info"|
"warning"|
"success"|
"opportunity"|
"risk";

title:string;

description:string;

score:number;

created:string;

}

export interface PortfolioHealth{

overall:number;

diversification:number;

income:number;

risk:number;

growth:number;

quality:number;

}

