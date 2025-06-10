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

// Add a list_prompts tool
server.tool("list_prompts",
  {},
  async () => ({
    content: [{ type: "text", text: JSON.stringify(await promptService.listPrompts()) }]
  })
);

// Add a get_prompt tool
server.tool("get_prompt",
  { name: z.string() },
  async ({ name }) => ({
    content: [{ type: "text", text: JSON.stringify(await promptService.getPrompt(name)) }]
  })
);

// Add a create_prompt tool
server.tool("create_prompt",
  { name: z.string(), prompt: z.any() },
  async ({ name, prompt }) => {
    await promptService.createPrompt(name, prompt);
    return { content: [{ type: "text", text: "OK" }] };
  }
);

// Add an update_prompt tool
server.tool("update_prompt",
  { name: z.string(), prompt: z.any() },
  async ({ name, prompt }) => {
    await promptService.updatePrompt(name, prompt);
    return { content: [{ type: "text", text: "OK" }] };
  }
);

// Add a delete_prompt tool
server.tool("delete_prompt",
  { name: z.string() },
  async ({ name }) => {
    await promptService.deletePrompt(name);
    return { content: [{ type: "text", text: "OK" }] };
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
