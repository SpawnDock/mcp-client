export interface McpClientConfig {
  readonly serverUrl: string;
  readonly requestInit?: RequestInit;
}

export function resolveMcpClientConfig(env: NodeJS.ProcessEnv = process.env): McpClientConfig {
  const serverUrl = env.MCP_SERVER_URL || "http://localhost:3000/mcp/sse";
  const mcpApiKey = env.MCP_SERVER_API_KEY?.trim();

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
