export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  reply: string;
}

export interface FileResponse {
  reply: string;
}

export interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  sendFileMessage: (file: File, prompt: string) => Promise<void>;
  clearMessages: () => void;
} 