import type {

PortfolioTransaction

} from "@/core/portfolio/types";

import {

SupabaseRepository

} from "../supabase/SupabaseRepository";

export const transactionRepository=

new SupabaseRepository<PortfolioTransaction>(

"transactions"

);
