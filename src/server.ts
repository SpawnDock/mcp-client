import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export interface PackageMeta {
  name: string;
  version: string;
}

export function createProxyServer(
  client: Client,
  meta: PackageMeta,
): McpServer {
  const server = new McpServer({ name: meta.name, version: meta.version });

  server.tool(
    "search",
    "Search the TMA knowledge base for development guidance, templates, and best practices",
    { query: z.string() },
    async (args) => {
      const result = await client.callTool({
        name: "search",
        arguments: args,
      });
      // Client CallToolResult and server tool return are structurally identical
      // but come from different type hierarchies in the SDK
      return result as { content: Array<{ type: "text"; text: string }> };
    },
  );

  return server;
}
