import { describe, it, expect, vi } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createProxyServer } from "./server.js";
import { createUnavailableProxyServer } from "./unavailable.js";

function createMockClient(response: unknown): Client {
  return { callTool: vi.fn().mockResolvedValue(response) } as unknown as Client;
}

describe("createProxyServer", () => {
  it("exposes a single 'search' tool", async () => {
    const mockClient = createMockClient({ content: [] });
    const server = createProxyServer(mockClient, {
      name: "test",
      version: "0.0.0",
    });

    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await server.connect(serverTransport);

    const testClient = new Client({ name: "probe", version: "0.0.0" });
    await testClient.connect(clientTransport);

    const { tools } = await testClient.listTools();
    expect(tools).toHaveLength(1);
    expect(tools[0].name).toBe("search");

    await testClient.close();
    await server.close();
  });

  it("proxies search call to the remote client", async () => {
    const expectedContent = [{ type: "text", text: "TMA guide content" }];
    const mockClient = createMockClient({ content: expectedContent });
    const server = createProxyServer(mockClient, {
      name: "test",
      version: "0.0.0",
    });

    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await server.connect(serverTransport);

    const testClient = new Client({ name: "probe", version: "0.0.0" });
    await testClient.connect(clientTransport);

    const result = await testClient.callTool({
      name: "search",
      arguments: { query: "how to create a TMA" },
    });

    expect(mockClient.callTool).toHaveBeenCalledWith({
      name: "search",
      arguments: { query: "how to create a TMA" },
    });
    expect(result.content).toEqual(expectedContent);

    await testClient.close();
    await server.close();
  });

  it("returns validation error when query is missing", async () => {
    const mockClient = createMockClient({ content: [] });
    const server = createProxyServer(mockClient, {
      name: "test",
      version: "0.0.0",
    });

    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await server.connect(serverTransport);

    const testClient = new Client({ name: "probe", version: "0.0.0" });
    await testClient.connect(clientTransport);

    const result = await testClient.callTool({
      name: "search",
      arguments: {},
    });
    expect(result.isError).toBe(true);
    expect(mockClient.callTool).not.toHaveBeenCalled();

    await testClient.close();
    await server.close();
  });

  it("returns a graceful error from the unavailable proxy server", async () => {
    const server = createUnavailableProxyServer({
      name: "test",
      version: "0.0.0",
    }, "Knowledge service unavailable");

    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();

    await server.connect(serverTransport);

    const testClient = new Client({ name: "probe", version: "0.0.0" });
    await testClient.connect(clientTransport);

    const result = await testClient.callTool({
      name: "search",
      arguments: { query: "how to create a TMA" },
    });

    expect(result.isError).toBe(true);
    expect(JSON.parse(String((result.content as Array<{ text: string }>)[0]?.text)).error)
      .toContain("Knowledge service unavailable");

    await testClient.close();
    await server.close();
  });
});
