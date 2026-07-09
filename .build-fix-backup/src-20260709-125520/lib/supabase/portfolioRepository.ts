import { supabase } from "./client";

export type DbPortfolio = {
  id: string;
  user_id: string;
  name: string;
  currency: string;
  created_at: string;
};

export async function listPortfolios() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("portfolios")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as DbPortfolio[];
}

export async function createPortfolio(name: string, userId: string) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("portfolios")
    .insert({
      name,
      user_id: userId,
      currency: "AUD",
    })
    .select("*")
    .single();

  if (error) throw error;

  return data as DbPortfolio;
}
