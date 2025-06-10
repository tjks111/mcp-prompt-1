export interface StorageAdapter {
  getPrompt(name: string): Promise<any>;
  listPrompts(): Promise<string[]>;
  createPrompt(name: string, prompt: any): Promise<void>;
  updatePrompt(name: string, prompt: any): Promise<void>;
  deletePrompt(name: string): Promise<void>;
}
