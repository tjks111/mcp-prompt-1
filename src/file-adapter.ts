import fs from 'fs/promises';
import path from 'path';
import { StorageAdapter } from './storage-adapter.js';

export class FileAdapter implements StorageAdapter {
  private promptsDir: string;

  constructor(promptsDir: string) {
    this.promptsDir = path.resolve(promptsDir);
  }

  async getPrompt(name: string): Promise<any> {
    const filePath = path.join(this.promptsDir, `${name}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  }

  async listPrompts(): Promise<string[]> {
    const files = await fs.readdir(this.promptsDir);
    return files
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace('.json', ''));
  }

  async createPrompt(name: string, prompt: any): Promise<void> {
    const filePath = path.join(this.promptsDir, `${name}.json`);
    await fs.writeFile(filePath, JSON.stringify(prompt, null, 2));
  }

  async updatePrompt(name: string, prompt: any): Promise<void> {
    const filePath = path.join(this.promptsDir, `${name}.json`);
    await fs.writeFile(filePath, JSON.stringify(prompt, null, 2));
  }

  async deletePrompt(name: string): Promise<void> {
    const filePath = path.join(this.promptsDir, `${name}.json`);
    await fs.unlink(filePath);
  }
}
