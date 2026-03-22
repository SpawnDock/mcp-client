#!/usr/bin/env node
import { createRequire } from "node:module";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { resolveMcpClientConfig } from "./config.js";
import { createProxyServer, type PackageMeta } from "./server.js";
import { createUnavailableProxyServer } from "./unavailable.js";

const pkg: PackageMeta = createRequire(import.meta.url)("../package.json");

async function main() {
  const { serverUrl, requestInit } = resolveMcpClientConfig();
  const server = await connectProxyServer(serverUrl, requestInit);
  const stdioTransport = new StdioServerTransport();
  await server.connect(stdioTransport);
}

main().catch((err) => {
  console.error(`${pkg.name} fatal:`, err);
  process.exit(1);
});

async function connectProxyServer(serverUrl: string, requestInit: RequestInit | undefined) {
  try {
    const httpTransport = new StreamableHTTPClientTransport(new URL(serverUrl), {
      requestInit,
    });
    const client = new Client({ name: pkg.name, version: pkg.version });
    await client.connect(httpTransport);
    return createProxyServer(client, pkg);
  } catch (error) {
    const message = error instanceof Error
      ? `Knowledge service unavailable: ${error.message}`
      : "Knowledge service unavailable"
    return createUnavailableProxyServer(pkg, message)
  }
}
