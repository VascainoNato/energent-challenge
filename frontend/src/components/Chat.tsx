import { useState, useRef, useEffect } from 'react';
import Attach from '../assets/attach.png';
import ButtonSend from '../assets/button-send.png';
import { useChat } from '../hooks/useChat';
import type { Message } from '../types/chat';

function Chat() {
  const { messages, isLoading, sendMessage, sendFileMessage, clearMessages } = useChat();
  const [inputMessage, setInputMessage] = useState('');
  const [, setFileInput] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    await sendMessage(inputMessage);
    setInputMessage('');
  };

  const handleFileUpload = async (file: File) => {
    if (!file || isLoading) return;
    
    const prompt = `Analyze this file: ${file.name}`;
    await sendFileMessage(file, prompt);
    setFileInput(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleStartChat = async () => {
    const initialMessage = "Hello Drill AI, I would like help with these graphics, could you help me?.";
    await sendMessage(initialMessage);
  };

  return (
    <div className="flex flex-col w-full h-full border-l border-gray-100">
      <div className="flex w-full px-2 py-3 justify-between items-center xl:px-4 flex-shrink-0 border-b border-gray-200">
        <div className="flex font-semibold">
          🤖 Drill AI
        </div>
        <div className="flex gap-2 xl:gap-4">
          <button 
            onClick={clearMessages}
            className="flex hover:bg-gray-400 hover:text-white p-1 rounded cursor-pointer text-sm text-gray-400 font-semibold border border-gray-400"
          >
            Clear History
          </button>
        </div>
      </div>
    
      {messages.length === 0 && (
        <div className='flex justify-center items-center py-4 flex-shrink-0'>
          <button 
            onClick={handleStartChat}
            className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors cursor-pointer'
          >
            Click to start chat!
          </button>
        </div>
      )}
      
      <div className="flex flex-col flex-grow h-0 px-4 pb-2 gap-2">
        <div className="flex flex-col flex-grow bg-gray-100 w-full rounded p-2 overflow-y-auto min-h-0">
          {messages.length === 0 ? (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-gray-500 text-center">
                Start a conversation with Drill AI!
              </p>
            </div>
          ) : (
            <div className="space-y-2 w-full">
              {messages.map((message: Message, index: number) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg text-sm ${
                      message.role === 'user'
                        ? 'bg-blue-100 text-gray-800 border-none'
                        : 'bg-blue-100 text-gray-800 border-none'
                    }`}
                  >
                    <p>
                      <span className="font-semibold">
                        {message.role === 'user' ? 'You: ' : 'Drill AI: '}
                      </span>
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 border px-3 py-2 rounded-lg text-sm">
                    <p>Typing...</p>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input área fixa na parte inferior */}
        <div className="flex flex-row justify-around items-center gap-2 flex-shrink-0">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="file-input"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <label htmlFor="file-input">
            <img src={Attach} alt="attach_file" className='w-6 h-6 flex cursor-pointer'/>
          </label>
          <form onSubmit={handleSendMessage} className="flex flex-1">
            <textarea 
              name="chat" 
              id="chat" 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (inputMessage.trim() && !isLoading) {
                    handleSendMessage(e);
                  }
                }
              }}
              className='lg:h-8 xl:h-10 flex lg:pt-1 xl:pt-2 px-2 pb-0 bg-blue-100 w-full rounded items-center align-center outline-none lg:text-sm xl:text-base resize-none' 
              placeholder='Type messages here'
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="disabled:opacity-50 ml-2"
            >
              <img src={ButtonSend} alt="button-send" className='w-8 h-6 flex cursor-pointer'/>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chat
  