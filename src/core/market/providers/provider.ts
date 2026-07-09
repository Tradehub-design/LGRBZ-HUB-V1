export interface Quote {

  ticker: string;
  price: number;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  currency: string;
  exchange: string;
  timestamp: number;

}

export interface CompanyProfile {

  ticker: string;
  company: string;
  sector: string;
  industry: string;
  country: string;
  exchange: string;
  marketCap: number;
  description: string;

}

export interface MarketProvider {

  getQuote(ticker:string):Promise<Quote>;

  getQuotes(tickers:string[]):Promise<Quote[]>;

  getProfile(ticker:string):Promise<CompanyProfile>;

}
