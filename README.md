# @spawn-dock/mcp

MCP client for the SpawnDock knowledge server, it allows AI agents (Claude, Cursor, etc.) to access the SpawnDock knowledge base for development and is focused on the following topics:

* Telegram mini apps and the TON blockchain, access to 55+ documents covering:
  - **Telegram Mini Apps** — getting started, WebApp API, navigation, theming, testing, security, performance
  - **TON Blockchain** — smart contracts, jettons, NFTs, DeFi, wallets, DNS, payments
  - **TON Connect** — authentication, wallet integration
  - **Deployment** — Cloudflare Pages, Vercel, GitHub Pages
  - **Templates** — shop, game, landing, quiz, menu, portfolio


## Install

```bash
npx @spawn-dock/mcp
```

## Configuration

Open https://t.me/TMASpawnerBot, get your API token, and configure it in your project when connecting to an authenticated server:

```bash
API_TOKEN=your-shared-api-token npx @spawn-dock/mcp
```

## Usage with Claude Code

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "tma-knowledge": {
      "command": "npx",
      "args": ["@spawn-dock/mcp"],
      "env": {
        "API_TOKEN": "your-shared-api-token"
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
      "API_TOKEN": "your-shared-api-token"
    }
  }
}
```

## License

MIT
