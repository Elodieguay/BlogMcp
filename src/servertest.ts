// import { McpServer } from "@modelcontextprotocol/server";
// import { serveStdio } from "@modelcontextprotocol/server/stdio";
// import { z } from "zod/v4";
// import { readFile, writeFile, appendFile } from "node:fs/promises";
// import "dotenv/config";


// const server = new McpServer({
//     name: "shared_notes",
//     version: "1.0.0",
// });

// if (!SECRET_KEY) {
//     throw new Error("MCP_SECRET_KEY is missing");
// }
// const NOTES_FILE = "./data/notes.txt";
// const HISTORY_FILE = new URL("../data/history.json", import.meta.url);

// async function logAction(agent: string, action: string) {
//     const history = JSON.parse(
//         await readFile(HISTORY_FILE, "utf-8")
//     );

//     history.push({
//         date: new Date().toISOString(),
//         agent,
//         action,
//     });

//     await writeFile(
//         HISTORY_FILE,
//         JSON.stringify(history, null, 2),
//         "utf-8"
//     );
// }

// server.registerTool(
//     "get_rules",
//     {
//         description: "Get the rules to follow before using the shared notebook"
//     },
//     async(ctx) => {
      
//       const agent = getAgentName(ctx)
//       await logAction(agent, "get_rules");

//       return {
//         content: [{ 
//             type: 'text', 
//             text: `
//             1. Always call get_rules before using the notebook.
//             2. Read the notes before modifying them.
//             3. Use append_note to add information.
//             4. Avoid duplicate information.
//             5. Ask for confirmation before using replace_notes.
//             6. Never delete information without an explicit user request.
//             7. Every action must be logged.
//             `.trim(),
//         }]}
//     }
// )

// server.registerTool(
//     "read_notes",
//     {
//         description: "Read the current content of the shared notebook"
//     },
//     async (ctx) => {
//         const notes = await readFile(NOTES_FILE, "utf-8");
//         const agent = getAgentName(ctx)
//         await logAction(agent, "read_notes");

//         return {
//             content: [
//                 {
//                     type: "text",
//                     text: notes,
//                 }
//             ] 
//         }

//     }
// );

// server.registerTool(
//   "append_note",
//   {
//     description: "Add new content to the shared notebook",
//     inputSchema: z.object({
//       content: z.string(),
//     }),
//   },
//   async ({ content}, ctx ) => {
//     await appendFile(NOTES_FILE, `\n${content}`, "utf-8");
//     const agent = getAgentName(ctx)
//     await logAction(agent, "append_note");

//     return {
//       content: [
//         {
//           type: "text",
//           text: "Note added successfully.",
//         },
//       ],
//     };
//   }
// );

// server.registerTool(
//   "replace_notes",
//   {
//     description: "Replace all content in the shared notebook",
//     inputSchema: z.object({
//       content: z.string(),
//     }),
//   },
//   async ({ content }, ctx) => {
//     await writeFile(NOTES_FILE, content, "utf-8");
//     const agent = getAgentName(ctx)
//     await logAction(agent, "replace_notes");

//     return {
//       content: [
//         {
//           type: "text",
//           text: "Notes replaced successfully.",
//         },
//       ],
//     };
//   }
// );

// function getAgentName(ctx: any): string {
//     return ctx.mcpReq.envelope?.clientInfo?.name ?? "unknown";
// }

// serveStdio(() => server);

