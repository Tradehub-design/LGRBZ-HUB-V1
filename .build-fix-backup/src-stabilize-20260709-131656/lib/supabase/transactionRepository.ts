import { supabase } from "./client";

export type DbPortfolioTransaction = {
  id: string;
  portfolio_id: string;
  transaction_date: string;
  action: string;
  ticker: string;
  quantity: number;
  price: number;
  fees: number;
  currency: string;
  platform: string | null;
  notes: string | null;
  created_at: string;
};

export async function listPortfolioTransactions(portfolioId: string) {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("portfolio_transactions")
    .select("*")
    .eq("portfolio_id", portfolioId)
    .order("transaction_date", { ascending: false });

  if (error) throw error;

  return data as DbPortfolioTransaction[];
}


export async function insertPortfolioTransactions(rows: Omit<DbPortfolioTransaction, "id" | "created_at">[]) {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("portfolio_transactions")
    .insert(rows)
    .select("*");

  if (error) throw error;

  return data as DbPortfolioTransaction[];
}
