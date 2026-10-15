import { supabase } from "./supabase.js";

export async function readNotes() {
        console.error("READ NOTES FROM SUPABASE");

    const { data, error } = await supabase
        .from("notes")
        .select("content")
        .eq("id", 1)
        .single();

        console.error("SUPABASE DATA:", data);
    console.error("SUPABASE ERROR:", error)

    if (error) {
        throw error;
    }

    return data.content;
}

export async function replaceNotes(content: string) {
    const { error } = await supabase
        .from("notes")
        .update({
            content,
            updated_at: new Date().toISOString(),
        })
        .eq("id", 1);

    if (error) {
        throw error;
    }
}

export async function appendNote(content: string) {
    const currentNotes = await readNotes();

    const newContent = `${currentNotes}\n${content}`;

    await replaceNotes(newContent);
}

