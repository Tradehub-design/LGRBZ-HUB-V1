export function calculateConfidence(portfolio: any) {
  return Number(portfolio?.performance?.winRate ?? portfolio?.winRate ?? 0);
}

export default calculateConfidence;
