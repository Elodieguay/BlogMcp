import { readHistory } from "../lib/logger.js";

export default async function handler(req: any, res: any) {
  const history = await readHistory();

  res.status(200).json(history);
}
