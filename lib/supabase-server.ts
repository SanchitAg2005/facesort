import { createClient } from "@supabase/supabase-js"
import { config } from "./config"

export const supabaseServer = createClient(
    config.supabaseUrl,
    config.supabaseServiceRoleKey,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    }
)
