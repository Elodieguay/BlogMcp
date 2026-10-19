import { supabase } from "./supabase.js";

export async function logAction(agent: string, action: string) {
  const { error } = await supabase.from("history").insert({
    agent,
    action,
  });

  if (error) {
    throw error;
  }
}

export async function readHistory() {
  const { data, error } = await supabase
    .from("history")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}