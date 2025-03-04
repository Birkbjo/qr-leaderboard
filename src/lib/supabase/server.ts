import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "./supabase";

export const createClient = async () => {
    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_API_KEY!,
        {
            cookies: {
                getAll() {
                    return []
                },
            },
        }
    );
};
