export type GoalStatus = "On Track" | "Behind" | "Completed";

export type Goal = {
  id: string;
  name: string;
  description: string;
  currentAmount: number;
  targetAmount: number;
  monthlyContribution: number;
  targetDate: string;
  status: GoalStatus;
};
