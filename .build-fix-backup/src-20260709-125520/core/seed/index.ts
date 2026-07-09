import { seedTransactions001 } from "./transactions-001";

export const coreSeedTransactions = [
  ...seedTransactions001,
];

export type CoreSeedTransaction = typeof coreSeedTransactions[number];
