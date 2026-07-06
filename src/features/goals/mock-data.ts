import type { Goal } from "./types";

export const goals: Goal[] = [
  {
    id: "1",
    name: "Long Term Portfolio",
    description: "Build long-term investment portfolio.",
    currentAmount: 128420.72,
    targetAmount: 250000,
    monthlyContribution: 625,
    targetDate: "2031-12-31",
    status: "On Track",
  },
  {
    id: "2",
    name: "Baby Investment Fund",
    description: "Investment account for child’s future.",
    currentAmount: 7820.4,
    targetAmount: 50000,
    monthlyContribution: 100,
    targetDate: "2044-01-01",
    status: "On Track",
  },
  {
    id: "3",
    name: "Cash Buffer",
    description: "Emergency cash reserve.",
    currentAmount: 20320,
    targetAmount: 30000,
    monthlyContribution: 500,
    targetDate: "2027-12-31",
    status: "Behind",
  },
];
