#!/usr/bin/env node
import { createRequire } from "node:module";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createProxyServer, type PackageMeta } from "./server.js";

const pkg: PackageMeta = createRequire(import.meta.url)("../package.json");

const serverUrl = process.env.MCP_SERVER_URL || "http://localhost:3000/sse";

async function main() {
  const sseTransport = new SSEClientTransport(new URL(serverUrl));
  const client = new Client({ name: pkg.name, version: pkg.version });
  await client.connect(sseTransport);

  const server = createProxyServer(client, pkg);

  const stdioTransport = new StdioServerTransport();
  await server.connect(stdioTransport);
}

main().catch((err) => {
  console.error(`${pkg.name} fatal:`, err);
  process.exit(1);
});
