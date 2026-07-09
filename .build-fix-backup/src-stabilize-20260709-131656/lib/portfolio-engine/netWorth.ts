export type NetWorthSnapshot = {
  portfolioAud: number;
  cashAud: number;
  otherAssetsAud: number;
  liabilitiesAud: number;
  netWorthAud: number;
};

function round(value: number) {
  return Math.round((value || 0) * 100) / 100;
}

export function calculateNetWorth(params: {
  portfolioAud: number;
  cashAud: number;
  otherAssetsAud?: number;
  liabilitiesAud?: number;
}): NetWorthSnapshot {
  const otherAssetsAud = params.otherAssetsAud ?? 0;
  const liabilitiesAud = params.liabilitiesAud ?? 0;

  return {
    portfolioAud: round(params.portfolioAud),
    cashAud: round(params.cashAud),
    otherAssetsAud: round(otherAssetsAud),
    liabilitiesAud: round(liabilitiesAud),
    netWorthAud: round(params.portfolioAud + params.cashAud + otherAssetsAud - liabilitiesAud),
  };
}
