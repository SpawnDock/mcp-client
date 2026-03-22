import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { PackageMeta } from "./server.js";

export function createUnavailableProxyServer(
  meta: PackageMeta,
  message: string,
): McpServer {
  const server = new McpServer({ name: meta.name, version: meta.version });

  server.tool(
    "search",
    "Search the TMA knowledge base for development guidance, templates, and best practices",
    { query: z.string() },
    async () => ({
      content: [{
        type: "text" as const,
        text: JSON.stringify({ error: message }),
      }],
      isError: true,
    }),
  );

  return server;
}
