export class PromptService {
    adapter;
    constructor(adapter) {
        this.adapter = adapter;
    }
    async getPrompt(name) {
        return this.adapter.getPrompt(name);
    }
    async listPrompts() {
        return this.adapter.listPrompts();
    }
    async createPrompt(name, prompt) {
        return this.adapter.createPrompt(name, prompt);
    }
    async updatePrompt(name, prompt) {
        return this.adapter.updatePrompt(name, prompt);
    }
    async deletePrompt(name) {
        return this.adapter.deletePrompt(name);
    }
}
