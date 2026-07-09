export function fullSnapshot() {
  return {
    dividends: [],
    prices: [],
    updatedAt: new Date().toISOString(),
  };
}

export default fullSnapshot;
