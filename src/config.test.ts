import { describe, expect, it } from "vitest";
import { resolveMcpClientConfig } from "./config.js";

describe("resolveMcpClientConfig", () => {
  it("uses the default streamable MCP URL when env is empty", () => {
    expect(resolveMcpClientConfig({})).toEqual({
      serverUrl: "https://spawn-dock.w3voice.net/mcp/sse",
    });
  });

  it("adds bearer authorization when MCP_SERVER_API_KEY is set", () => {
    expect(resolveMcpClientConfig({
      MCP_SERVER_URL: "https://api.example.com/mcp/sse",
      MCP_SERVER_API_KEY: "mcp_key_123",
    })).toEqual({
      serverUrl: "https://api.example.com/mcp/sse",
      requestInit: {
        headers: {
          Authorization: "Bearer mcp_key_123",
        },
      },
    });
  });
});
