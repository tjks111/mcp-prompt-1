import { StorageAdapter } from './storage-adapter.js';

export class PromptService {
  private adapter: StorageAdapter;

  constructor(adapter: StorageAdapter) {
    this.adapter = adapter;
  }

  async getPrompt(name: string): Promise<any> {
    return this.adapter.getPrompt(name);
  }

  async listPrompts(): Promise<string[]> {
    return this.adapter.listPrompts();
  }

  async createPrompt(name: string, prompt: any): Promise<void> {
    return this.adapter.createPrompt(name, prompt);
  }

  async updatePrompt(name: string, prompt: any): Promise<void> {
    return this.adapter.updatePrompt(name, prompt);
  }

  async deletePrompt(name: string): Promise<void> {
    return this.adapter.deletePrompt(name);
  }
}
