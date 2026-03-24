export interface McpClientConfig {
  readonly serverUrl: string;
  readonly requestInit?: RequestInit;
}

export function resolveMcpClientConfig(env: NodeJS.ProcessEnv = process.env): McpClientConfig {
  const serverUrl = env.MCP_SERVER_URL || "https://spawn-dock.w3voice.net/mcp/sse";
  const mcpApiKey = env.API_TOKEN?.trim() || env.MCP_SERVER_API_KEY?.trim();

  if (!mcpApiKey) {
    return { serverUrl };
  }

  return {
    serverUrl,
    requestInit: {
      headers: {
        Authorization: `Bearer ${mcpApiKey}`,
      },
    },
  };
}
