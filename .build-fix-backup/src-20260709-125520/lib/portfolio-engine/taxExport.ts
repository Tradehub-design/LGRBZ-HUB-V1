import type { CgtSummary } from "./cgt";
import type { DiscountSummary } from "./cgtDiscount";
import type { FrankingSummary } from "./franking";
import type { FinancialYearSummary } from "./financialYear";

export type TaxExportSummary = {
  generatedAt: string;
  sections: string[];
  ready: boolean;
  notes: string[];
};

export function buildTaxExportSummary(params: {
  cgtSummary: CgtSummary;
  discountSummary: DiscountSummary;
  frankingSummary: FrankingSummary;
  financialYears: FinancialYearSummary[];
}): TaxExportSummary {
  return {
    generatedAt: new Date().toISOString(),
    ready: true,
    sections: [
      "Capital gains summary",
      "FIFO disposal register",
      "Dividend income",
      "Franking summary",
      "Financial year summary",
      "Fees and interest",
    ],
    notes: [
      `Disposals: ${params.cgtSummary.disposalCount}`,
      `Net capital gain: ${params.cgtSummary.netCapitalGainAud}`,
      `Grossed-up income: ${params.frankingSummary.grossedUpIncomeAud}`,
      `Financial years: ${params.financialYears.length}`,
    ],
  };
}
