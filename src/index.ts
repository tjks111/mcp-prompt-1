import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from "zod";
import { PromptService } from './prompt-service.js';
import { FileAdapter } from './file-adapter.js';
import { PostgresAdapter } from './postgres-adapter.js';
import { StorageAdapter } from './storage-adapter.js';

let adapter: StorageAdapter;
if (process.env.STORAGE_TYPE === 'postgres') {
  adapter = new PostgresAdapter();
} else {
  adapter = new FileAdapter('mcp-prompts-v2/prompts');
}
const promptService = new PromptService(adapter);

// Create an MCP server
const server = new McpServer({
  name: "mcp-prompts-v2",
  version: "0.0.1"
});

// Add a search tool
server.tool("search", "Search for prompts by keyword.", async () => {
  return { content: [{ type: "text", text: "search results" }] };
});

// Add a fetch tool
server.tool("fetch", "Fetch a prompt by ID.", async () => {
  return { content: [{ type: "text", text: "fetch result" }] };
});

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
