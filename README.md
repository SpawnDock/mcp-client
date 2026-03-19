# @spawn-dock/mcp

MCP client for the SpawnDock TMA knowledge server. Acts as a stdio-to-SSE bridge that lets AI agents (Claude, Cursor, etc.) access the SpawnDock knowledge base about Telegram Mini Apps and TON blockchain.

## Install

```bash
npx @spawn-dock/mcp
```

## Configuration

Set the `MCP_SERVER_URL` environment variable to point to your SpawnDock MCP server:

```bash
MCP_SERVER_URL=https://your-server.example.com/sse npx @spawn-dock/mcp
```

Default: `http://localhost:3000/sse`

## Usage with Claude Code

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "tma-knowledge": {
      "command": "npx",
      "args": ["@spawn-dock/mcp"],
      "env": {
        "MCP_SERVER_URL": "https://your-server.example.com/sse"
      }
    }
  }
}
```

## Usage with Cursor

Add to Cursor's MCP settings:

```json
{
  "tma-knowledge": {
    "command": "npx",
    "args": ["@spawn-dock/mcp"],
    "env": {
      "MCP_SERVER_URL": "https://your-server.example.com/sse"
    }
  }
}
```

## Available Tools

### `search`

Search the TMA knowledge base for development guidance, templates, and best practices.

**Input:** `{ "query": "string" }`

**Returns:** JSON with `answer` and `sources` fields.

```json
{
  "answer": "Detailed answer about TMA development...",
  "sources": [
    { "file": "guides/getting-started.md", "section": "Quick Start" }
  ]
}
```

## Knowledge Base

The server provides access to 55+ documents covering:

- **Telegram Mini Apps** — getting started, WebApp API, navigation, theming, testing, security, performance
- **TON Blockchain** — smart contracts, jettons, NFTs, DeFi, wallets, DNS, payments
- **TON Connect** — authentication, wallet integration
- **Deployment** — Cloudflare Pages, Vercel, GitHub Pages
- **Templates** — shop, game, landing, quiz, menu, portfolio

## How it works

```
AI Agent (stdio) → @spawn-dock/mcp → SSE → SpawnDock MCP Server → Qwen AI → Knowledge Base
```

The client connects to the remote MCP server via SSE, then exposes the `search` tool locally via stdio. AI agents see it as a local MCP tool.

## License

MIT
