import type {

Holding

} from "@/core/portfolio/types";

import {

SupabaseRepository

} from "../supabase/SupabaseRepository";

export const holdingRepository=

new SupabaseRepository<Holding>(

"holdings"

);
