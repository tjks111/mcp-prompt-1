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
server.tool("search", {
  description: "Search for prompts by keyword.",
  input: z.object({ query: z.string() }),
  output: z.object({
    results: z.array(z.object({
      id: z.string(),
      title: z.string(),
      text: z.string(),
      url: z.string().nullable(),
    }))
  })
}, async ({ query }) => {
  const prompts = await promptService.listPrompts();
  const results = prompts.filter(prompt => prompt.includes(query)).map(prompt => ({
    id: prompt,
    title: prompt,
    text: "A prompt for generating text.",
    url: null
  }));
  return { content: [{ type: "text", text: JSON.stringify({ results }) }] };
});

// Add a fetch tool
server.tool("fetch", {
  description: "Fetch a prompt by ID.",
  input: z.object({ id: z.string() }),
  output: z.object({
    id: z.string(),
    title: z.string(),
    text: z.string(),
    url: z.string().nullable(),
    metadata: z.record(z.string()).nullable(),
  })
}, async ({ id }) => {
  const prompt = await promptService.getPrompt(id);
  return {
    content: [{
      type: "text", text: JSON.stringify({
        id,
        title: id,
        text: JSON.stringify(prompt),
        url: null,
        metadata: null
      })
    }]
  };
});

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
