export interface InvestmentThesis{

ticker:string;

summary:string;

bullCase:string;

bearCase:string;

fairValue:number;

targetPrice:number;

conviction:number;

lastUpdated:string;

}

export interface Catalyst{

id:string;

ticker:string;

title:string;

date:string;

completed:boolean;

impact:"Low"|"Medium"|"High";

}

