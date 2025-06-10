import fs from 'fs/promises';
import path from 'path';
export class FileAdapter {
    promptsDir;
    constructor(promptsDir) {
        this.promptsDir = path.resolve(promptsDir);
    }
    async getPrompt(name) {
        const filePath = path.join(this.promptsDir, `${name}.json`);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    }
    async listPrompts() {
        const files = await fs.readdir(this.promptsDir);
        return files
            .filter((file) => file.endsWith('.json'))
            .map((file) => file.replace('.json', ''));
    }
    async createPrompt(name, prompt) {
        const filePath = path.join(this.promptsDir, `${name}.json`);
        await fs.writeFile(filePath, JSON.stringify(prompt, null, 2));
    }
    async updatePrompt(name, prompt) {
        const filePath = path.join(this.promptsDir, `${name}.json`);
        await fs.writeFile(filePath, JSON.stringify(prompt, null, 2));
    }
    async deletePrompt(name) {
        const filePath = path.join(this.promptsDir, `${name}.json`);
        await fs.unlink(filePath);
    }
}
