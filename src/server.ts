import { McpServer, createMcpHandler } from "@modelcontextprotocol/server";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { readNotes, appendNote, replaceNotes } from "../lib/storage.js";
import { logAction } from "../lib/logger.js";
import { z } from "zod/v4";
import { createServer } from "node:http";
import "dotenv/config";
import process from "node:process";

const SECRET_KEY = process.env.MCP_SECRET_KEY;
if (!SECRET_KEY) {
    throw new Error("MCP_SECRET_KEY is missing");
}

function getAgentName(ctx: any): string {
    return ctx.http?.req?.headers.get("x-agent-id") ?? "unknown";
}

function createMcpServer() {
    const server = new McpServer({
        name: "shared_notes",
        version: "1.0.0",
    });

  server.registerTool(
      "get_rules",
      {
          description: "Get the rules to follow before using the shared notebook"
      },
      async(ctx) => {
        
        const agent = getAgentName(ctx)
        await logAction(agent, "get_rules");

        return {
          content: [{ 
              type: 'text', 
              text: `
              1. Always call get_rules before using the notebook.
              2. Read the notes before modifying them.
              3. Use append_note to add information.
              4. Avoid duplicate information.
              5. Ask for confirmation before using replace_notes.
              6. Never delete information without an explicit user request.
              7. Every action must be logged.
              `.trim(),
          }]}
      }
  )

  server.registerTool(
    "read_notes",
    {
        description: "Read the current content of the shared notebook"
    },
    async (ctx) => {
      const notes = await readNotes();

      const agent = getAgentName(ctx)
      await logAction(agent, "read_notes");

      return {
          content: [
              {
                  type: "text",
                  text: notes,
              }
          ] 
      }
    }
  );

  server.registerTool(
    "append_note",
    {
      description: "Add new content to the shared notebook",
      inputSchema: z.object({
        content: z.string(),
      }),
    },
    async ({ content}, ctx ) => {
      await appendNote(content);

      const agent = getAgentName(ctx)
      await logAction(agent, "append_note");

      return {
        content: [
          {
            type: "text",
            text: "Note added successfully.",
          },
        ],
      };
    }
  );

  server.registerTool(
    "replace_notes",
    {
      description: "Replace all content in the shared notebook",
      inputSchema: z.object({
        content: z.string(),
      }),
    },
    async ({ content }, ctx) => {
      await replaceNotes(content);
      const agent = getAgentName(ctx)
      await logAction(agent, "replace_notes");

      return {
        content: [
          {
            type: "text",
            text: "Notes replaced successfully.",
          },
        ],
      };
    }
  );


    return server;
}


const mcpHandler = createMcpHandler(() => {
    return createMcpServer();
});

const nodeHandler = toNodeHandler(mcpHandler);

const httpServer = createServer((req, res) => {
  if (req.url !== "/mcp") {
    res.statusCode = 404;
    res.end("Not found");
    return;
  }
  
  const authorization = req.headers.authorization;

  if (authorization !== `Bearer ${SECRET_KEY}`) {
      res.statusCode = 401;
      res.end("Unauthorized");
      return;
  }

  nodeHandler(req, res);
});

httpServer.listen(3000, () => {
    console.log("MCP server running on http://localhost:3000/mcp");
});