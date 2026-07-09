export interface AssetAllocation {
  id: string;
  category: string;
  value: number;
  percentage: number;
  targetPercentage: number;
}

export interface SectorAllocation {
  id: string;
  sector: string;
  value: number;
  percentage: number;
}

export interface CountryAllocation {
  id: string;
  country: string;
  percentage: number;
}

export interface CurrencyExposure {
  id: string;
  currency: string;
  percentage: number;
}
