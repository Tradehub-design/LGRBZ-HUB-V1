export interface AssetProfile{

ticker:string;

company:string;

exchange:string;

country:string;

sector:string;

industry:string;

currency:string;

assetClass:string;

dividend:boolean;

franking:number;

risk:"Very Low"|"Low"|"Medium"|"High"|"Very High";

description:string;

}

export interface AIValidation{

severity:"Info"|"Warning"|"Error";

title:string;

message:string;

}

export interface PortfolioInsight{

title:string;

description:string;

importance:number;

}

