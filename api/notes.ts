import { readNotes } from "../lib/storage.js";

export default async function handler(req: any, res: any) {
  const notes = await readNotes();

  res.status(200).json({
    content: notes,
  });
}
