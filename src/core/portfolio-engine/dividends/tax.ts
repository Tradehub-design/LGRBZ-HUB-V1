import {
  roundMoney,
} from "../money";

export type DividendTaxCalculation = {
  cashDividendAud: number;

  frankingPercentage: number;
  companyTaxRate: number;

  frankedCashAud: number;
  unfrankedCashAud: number;

  frankingCreditAud: number;
  grossedUpIncomeAud: number;

  withholdingRate: number;
  withholdingTaxAud: number;

  taxableIncomeAud: number;
  estimatedPersonalTaxAud: number;
  estimatedNetTaxPayableAud: number;
};

function boundedPercent(
  value: unknown,
  fallback = 0,
): number {
  const parsed =
    Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(
    100,
    Math.max(
      0,
      parsed,
    ),
  );
}

/**
 * Australian franking credit formula:
 *
 * franked cash component × company tax rate / (1 - company tax rate)
 *
 * With a 30% company tax rate this equals franked cash × 30 / 70.
 */
export function calculateDividendTax(input: {
  cashDividendAud:
    number;

  frankingPercentage?:
    number | null;

  companyTaxRate?:
    number | null;

  withholdingRate?:
    number | null;

  personalMarginalTaxRate?:
    number | null;
}): DividendTaxCalculation {
  const cashDividendAud =
    roundMoney(
      Math.max(
        0,
        Number.isFinite(
          input.cashDividendAud,
        )
          ? input.cashDividendAud
          : 0,
      ),
    );

  const frankingPercentage =
    boundedPercent(
      input.frankingPercentage,
      0,
    );

  const companyTaxRate =
    boundedPercent(
      input.companyTaxRate,
      30,
    );

  const withholdingRate =
    boundedPercent(
      input.withholdingRate,
      0,
    );

  const personalMarginalTaxRate =
    boundedPercent(
      input.personalMarginalTaxRate,
      0,
    );

  const frankedCashAud =
    roundMoney(
      cashDividendAud *
      (
        frankingPercentage /
        100
      ),
    );

  const unfrankedCashAud =
    roundMoney(
      cashDividendAud -
      frankedCashAud,
    );

  const companyTaxFraction =
    companyTaxRate /
    100;

  const frankingCreditAud =
    companyTaxFraction > 0 &&
    companyTaxFraction < 1
      ? roundMoney(
          frankedCashAud *
          (
            companyTaxFraction /
            (
              1 -
              companyTaxFraction
            )
          ),
        )
      : 0;

  const grossedUpIncomeAud =
    roundMoney(
      cashDividendAud +
      frankingCreditAud,
    );

  const withholdingTaxAud =
    roundMoney(
      cashDividendAud *
      (
        withholdingRate /
        100
      ),
    );

  const taxableIncomeAud =
    grossedUpIncomeAud;

  const estimatedPersonalTaxAud =
    roundMoney(
      taxableIncomeAud *
      (
        personalMarginalTaxRate /
        100
      ),
    );

  const estimatedNetTaxPayableAud =
    roundMoney(
      Math.max(
        0,
        estimatedPersonalTaxAud -
        frankingCreditAud -
        withholdingTaxAud,
      ),
    );

  return {
    cashDividendAud,

    frankingPercentage,

    companyTaxRate,

    frankedCashAud,

    unfrankedCashAud,

    frankingCreditAud,

    grossedUpIncomeAud,

    withholdingRate,

    withholdingTaxAud,

    taxableIncomeAud,

    estimatedPersonalTaxAud,

    estimatedNetTaxPayableAud,
  };
}
