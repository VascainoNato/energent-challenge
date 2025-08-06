import type { Message, ChatResponse, FileResponse } from '../types/chat';

// Text Chats
export async function sendChat(messages: Message[]): Promise<ChatResponse> {
  try {
    const res = await fetch("http://localhost:5000/api/chat/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
  
    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Erro HTTP:", errorText);
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const response = await res.json();
    return response;
  } catch (error) {
    console.error('Error sending the message.', error);
    throw error;
  }
}

// File chats
export async function sendFile(file: File, prompt: string): Promise<FileResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("prompt", prompt);

    const res = await fetch("http://localhost:5000/api/chat/file", {
      method: "POST",
      body: formData,
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error sending file:', error);
    throw error;
  }
}