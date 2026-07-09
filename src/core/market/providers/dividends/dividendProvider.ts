export type DividendSnapshot = {
  records: unknown[];
  forwardIncome: number;
};

export const dividendSnapshot: DividendSnapshot = {
  records: [],
  forwardIncome: 0,
};

export async function getDividendData() {
  return [];
}

export default dividendSnapshot;
