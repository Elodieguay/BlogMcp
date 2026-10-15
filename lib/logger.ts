import { supabase } from "./supabase.js";

export async function logAction(
    agent: string,
    action: string
) {
    const { error } = await supabase
        .from("history")
        .insert({
            agent,
            action,
        });

    if (error) {
        throw error;
    }
}