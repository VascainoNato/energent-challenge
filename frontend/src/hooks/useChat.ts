import { useState, useCallback } from 'react';
import { sendChat, sendFile } from '../api/chatApi';
import { toastUtils } from '../utils/toastUtils';
import type { Message, UseChatReturn } from '../types/chat';

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const userMessage: Message = { role: 'user', content };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      const response = await sendChat(newMessages);
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: response.reply 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      
      if (err.message?.includes('429') || err.message?.includes('quota')) {
        const errorMsg = 'API usage limit exceeded. Check your OpenAI account.';
        setError(errorMsg);
        toastUtils.chat.messageError();
      } else {
        const errorMsg = 'Error sending message. Please try again.';
        setError(err instanceof Error ? err.message : errorMsg);
        toastUtils.chat.messageError();
      }
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const sendFileMessage = useCallback(async (file: File, prompt: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const userMessage: Message = { 
        role: 'user', 
        content: `[File: ${file.name}] ${prompt}` 
      };
      setMessages(prev => [...prev, userMessage]);

      const response = await sendFile(file, prompt);
      
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: response.reply 
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      toastUtils.chat.fileUploaded(file.name);
    } catch (err) {
      const errorMsg = 'Error sending file. Please try again.';
      setError(err instanceof Error ? err.message : errorMsg);
      toastUtils.chat.fileError();
      console.error('Error sending file:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    toastUtils.chat.historyCleared();
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    sendFileMessage,
    clearMessages,
  };
} 