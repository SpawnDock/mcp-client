import { describe, it, expect } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { resolveMcpClientConfig } from "./config.js";

describe("MCP Smoke Test", () => {
  const token = process.env.API_TOKEN;

  it("should connect to the server and list tools", async () => {
    if (!token) {
      console.warn("Skipping smoke test: API_TOKEN not provided");
      return;
    }

    const { serverUrl, requestInit } = resolveMcpClientConfig({ API_TOKEN: token });
    const httpTransport = new StreamableHTTPClientTransport(new URL(serverUrl), {
      requestInit,
    });

    const client = new Client({ name: "smoke-test", version: "1.0.0" });

    try {
      await client.connect(httpTransport);
      const tools = await client.listTools();

      expect(tools.tools).toBeDefined();
      expect(tools.tools.some(t => t.name === "search")).toBe(true);

      const result = await client.callTool({
        name: "search",
        arguments: { query: "Telegram Mini Apps" }
      });

      expect(result.content).toBeDefined();
      expect(Array.isArray(result.content)).toBe(true);
    } finally {
      await client.close();
    }
  }, 20000); // 20s timeout
});
