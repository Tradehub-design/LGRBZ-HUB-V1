import {
  AssetAllocation,
  SectorAllocation,
  CountryAllocation,
  CurrencyExposure,
} from "./types";

export const assetAllocation: AssetAllocation[] = [
  {
    id: "1",
    category: "Australian ETFs",
    value: 48500,
    percentage: 42,
    targetPercentage: 40,
  },
  {
    id: "2",
    category: "US Shares",
    value: 39200,
    percentage: 34,
    targetPercentage: 35,
  },
  {
    id: "3",
    category: "Cash",
    value: 17800,
    percentage: 15,
    targetPercentage: 15,
  },
  {
    id: "4",
    category: "International ETFs",
    value: 10200,
    percentage: 9,
    targetPercentage: 10,
  },
];

export const sectorAllocation: SectorAllocation[] = [
  { id: "1", sector: "Technology", value: 32200, percentage: 28 },
  { id: "2", sector: "Financials", value: 24100, percentage: 21 },
  { id: "3", sector: "Healthcare", value: 15500, percentage: 14 },
  { id: "4", sector: "Industrials", value: 13200, percentage: 12 },
];

export const countryAllocation: CountryAllocation[] = [
  { id: "1", country: "Australia", percentage: 46 },
  { id: "2", country: "United States", percentage: 44 },
  { id: "3", country: "Japan", percentage: 5 },
  { id: "4", country: "Europe", percentage: 5 },
];

export const currencyExposure: CurrencyExposure[] = [
  { id: "1", currency: "AUD", percentage: 48 },
  { id: "2", currency: "USD", percentage: 45 },
  { id: "3", currency: "JPY", percentage: 4 },
  { id: "4", currency: "EUR", percentage: 3 },
];
