export function calculateOpportunityScore(holding: any) {
  return Number(holding?.metrics?.unrealisedPercent ?? holding.unrealisedPlPercent ?? 0);
}

export default calculateOpportunityScore;
