#!/usr/bin/env node
import { createRequire } from "node:module";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createProxyServer, type PackageMeta } from "./server.js";

const pkg: PackageMeta = createRequire(import.meta.url)("../package.json");

const serverUrl = process.env.MCP_SERVER_URL || "http://localhost:3000/mcp/sse";

async function main() {
  const httpTransport = new StreamableHTTPClientTransport(new URL(serverUrl));
  const client = new Client({ name: pkg.name, version: pkg.version });
  await client.connect(httpTransport);

  const server = createProxyServer(client, pkg);

  const stdioTransport = new StdioServerTransport();
  await server.connect(stdioTransport);
}

main().catch((err) => {
  console.error(`${pkg.name} fatal:`, err);
  process.exit(1);
});
