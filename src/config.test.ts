import { describe, expect, it } from "vitest";
import { resolveMcpClientConfig } from "./config.js";

describe("resolveMcpClientConfig", () => {
  it("throws when API token is missing", () => {
    expect(() => resolveMcpClientConfig({})).toThrow("Missing API_TOKEN");
  });

  it("adds bearer authorization when API_TOKEN is set", () => {
    expect(resolveMcpClientConfig({
      MCP_SERVER_URL: "https://api.example.com/mcp/sse",
      API_TOKEN: "mcp_key_123",
    })).toEqual({
      serverUrl: "https://api.example.com/mcp/sse",
      requestInit: {
        headers: {
          Authorization: "Bearer mcp_key_123",
        },
      },
    });
  });

  it("supports legacy MCP_SERVER_API_KEY env variable", () => {
    expect(resolveMcpClientConfig({
      MCP_SERVER_URL: "https://api.example.com/mcp/sse",
      MCP_SERVER_API_KEY: "legacy_key_123",
    }).requestInit?.headers).toEqual({
      Authorization: "Bearer legacy_key_123",
    });
  });
});
