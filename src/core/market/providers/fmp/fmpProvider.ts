import type {
  CompanyProfile,
  MarketProvider,
  Quote
} from "../provider";

import { httpGet } from "@/core/http/client";
import { retry } from "@/core/http/retry";

type FMPQuoteResponse = {
  symbol: string;
  price: number;
  previousClose?: number;
  open?: number;
  dayHigh?: number;
  dayLow?: number;
  volume?: number;
  marketCap?: number;
  exchange?: string;
};

type FMPProfileResponse = {
  symbol: string;
  companyName?: string;
  sector?: string;
  industry?: string;
  country?: string;
  exchangeShortName?: string;
  mktCap?: number;
  description?: string;
};

const BASE_URL =
  "https://financialmodelingprep.com/api/v3";

function apiKey() {
  return process.env.NEXT_PUBLIC_FMP_API_KEY ?? "";
}

function normaliseTicker(ticker: string) {
  return ticker
    .replace("ASX:", "")
    .replace("NASDAQ:", "")
    .replace("NYSE:", "")
    .replace(".AX", ".AX");
}

export class FMPProvider implements MarketProvider {
  async getQuote(ticker: string): Promise<Quote> {
    const symbol = normaliseTicker(ticker);

    const data = await retry(() =>
      httpGet<FMPQuoteResponse[]>(
        `${BASE_URL}/quote/${symbol}?apikey=${apiKey()}`
      )
    );

    const q = data[0];

    if (!q) {
      throw new Error(`No quote found for ${ticker}`);
    }

    return {
      ticker,
      price: q.price ?? 0,
      previousClose: q.previousClose ?? 0,
      open: q.open ?? 0,
      high: q.dayHigh ?? 0,
      low: q.dayLow ?? 0,
      volume: q.volume ?? 0,
      currency: ticker.includes(".AX") || ticker.startsWith("ASX:")
        ? "AUD"
        : "USD",
      exchange: q.exchange ?? "",
      timestamp: Date.now()
    };
  }

  async getQuotes(tickers: string[]): Promise<Quote[]> {
    return Promise.all(
      tickers.map(ticker => this.getQuote(ticker))
    );
  }

  async getProfile(ticker: string): Promise<CompanyProfile> {
    const symbol = normaliseTicker(ticker);

    const data = await retry(() =>
      httpGet<FMPProfileResponse[]>(
        `${BASE_URL}/profile/${symbol}?apikey=${apiKey()}`
      )
    );

    const p = data[0];

    if (!p) {
      throw new Error(`No profile found for ${ticker}`);
    }

    return {
      ticker,
      company: p.companyName ?? ticker,
      sector: p.sector ?? "",
      industry: p.industry ?? "",
      country: p.country ?? "",
      exchange: p.exchangeShortName ?? "",
      marketCap: p.mktCap ?? 0,
      description: p.description ?? ""
    };
  }
}

export const fmpProvider = new FMPProvider();
