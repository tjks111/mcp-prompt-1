import { Pool } from 'pg';
import { StorageAdapter } from './storage-adapter.js';

export class PostgresAdapter implements StorageAdapter {
  private pool: Pool;

  constructor() {
    this.pool = new Pool();
  }

  async getPrompt(name: string): Promise<any> {
    const res = await this.pool.query('SELECT * FROM prompts WHERE name = $1', [name]);
    return res.rows[0];
  }

  async listPrompts(): Promise<string[]> {
    const res = await this.pool.query('SELECT name FROM prompts');
    return res.rows.map((row: { name: string }) => row.name);
  }

  async createPrompt(name: string, prompt: any): Promise<void> {
    await this.pool.query('INSERT INTO prompts (name, prompt) VALUES ($1, $2)', [name, prompt]);
  }

  async updatePrompt(name: string, prompt: any): Promise<void> {
    await this.pool.query('UPDATE prompts SET prompt = $1 WHERE name = $2', [prompt, name]);
  }

  async deletePrompt(name: string): Promise<void> {
    await this.pool.query('DELETE FROM prompts WHERE name = $1', [name]);
  }
}
