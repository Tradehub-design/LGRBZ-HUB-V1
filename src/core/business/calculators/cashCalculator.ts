export function calculateCashSnapshot(transactions: any[] = []) {
  return transactions.reduce(
    (acc, tx) => {
      const amount = Number(tx.amountAud ?? tx.totalAud ?? tx.total ?? 0);
      const action = String(tx.action ?? tx.type ?? "").toLowerCase();

      if (action.includes("deposit")) acc.depositsAud += amount;
      if (action.includes("withdraw")) acc.withdrawalsAud += amount;
      if (action.includes("dividend")) acc.dividendsAud += amount;
      if (action.includes("interest")) acc.interestAud += amount;

      acc.balanceAud = acc.depositsAud + acc.dividendsAud + acc.interestAud - acc.withdrawalsAud;
      return acc;
    },
    {
      balanceAud: 0,
      depositsAud: 0,
      withdrawalsAud: 0,
      dividendsAud: 0,
      interestAud: 0,
      feesAud: 0,
    }
  );
}

export default calculateCashSnapshot;
