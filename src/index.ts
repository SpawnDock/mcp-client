#!/usr/bin/env node
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

const serverUrl = process.env.MCP_SERVER_URL || "http://localhost:3000/sse";

async function main() {
  // Connect to remote MCP server as client
  const sseTransport = new SSEClientTransport(new URL(serverUrl));
  const client = new Client({ name: "mcp-tma-client", version: "1.0.1" });
  await client.connect(sseTransport);

  // Create local MCP server (stdio) that proxies to remote
  const localServer = new McpServer({
    name: "mcp-tma-client",
    version: "1.0.1",
  });

  // Register the search tool (known schema — matches server's tool)
  localServer.tool(
    "search",
    "Search the TMA knowledge base for development guidance, templates, and best practices",
    { query: z.string() },
    async (args) => {
      const result = await client.callTool({ name: "search", arguments: args });
      return result as any;
    },
  );

  // Connect local server to stdio
  const stdioTransport = new StdioServerTransport();
  await localServer.connect(stdioTransport);
}

main().catch((err) => {
  console.error("mcp-tma-client fatal:", err);
  process.exit(1);
});
