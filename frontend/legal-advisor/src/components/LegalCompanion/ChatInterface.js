import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, Sun, Moon } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm an AI assistant. How can I help you today?", 
      sender: 'bot' 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user'
    };

    // Add bot response (simulated)
    const botMessage = {
      id: messages.length + 2,
      text: `I'm processing your message: "${inputMessage}"`,
      sender: 'bot'
    };

    setMessages([...messages, userMessage, botMessage]);
    setInputMessage('');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`
      flex flex-col h-screen max-w-4xl mx-auto 
      ${isDarkMode 
        ? 'bg-zinc-900 text-zinc-100' 
        : 'bg-white text-zinc-900'}
      transition-colors duration-300
    `}>
      {/* Header */}
      <div className={`
        p-4 border-b flex items-center justify-between
        ${isDarkMode 
          ? 'border-zinc-700 bg-zinc-800' 
          : 'border-zinc-200 bg-zinc-50'}
      `}>
        <div className="flex items-center space-x-3">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center
            ${isDarkMode 
              ? 'bg-emerald-600 text-white' 
              : 'bg-emerald-500 text-white'}
          `}>
            AI
          </div>
          <h1 className="text-xl font-semibold">Nova Chat</h1>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleDarkMode}
            className={`
              p-2 rounded-full transition-colors
              ${isDarkMode 
                ? 'hover:bg-zinc-700 text-zinc-300 hover:text-white' 
                : 'hover:bg-zinc-100 text-zinc-600 hover:text-black'}
            `}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            className={`
              p-2 rounded-full transition-colors
              ${isDarkMode 
                ? 'hover:bg-zinc-700 text-zinc-300 hover:text-white' 
                : 'hover:bg-zinc-100 text-zinc-600 hover:text-black'}
            `}
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`
              flex items-start space-x-3 
              ${message.sender === 'user' ? 'justify-end' : 'justify-start'}
            `}
          >
            <div 
              className={`
                max-w-[70%] p-3 rounded-2xl 
                ${message.sender === 'user' 
                  ? (isDarkMode 
                    ? 'bg-emerald-700 text-white' 
                    : 'bg-emerald-500 text-white')
                  : (isDarkMode 
                    ? 'bg-zinc-800 text-zinc-200' 
                    : 'bg-zinc-100 text-zinc-800')}
                relative
                shadow-sm
              `}
            >
              {message.text}
              <div className={`
                absolute bottom-[-2px] 
                ${message.sender === 'user' 
                  ? 'right-[-5px] border-b-emerald-700' 
                  : 'left-[-5px] border-b-zinc-800'}
                border-l-transparent
                border-r-transparent
                border-t-transparent
                border-[6px]
                ${isDarkMode 
                  ? (message.sender === 'user' 
                    ? 'border-b-emerald-700' 
                    : 'border-b-zinc-800')
                  : (message.sender === 'user' 
                    ? 'border-b-emerald-500' 
                    : 'border-b-zinc-100')}
              `} />
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`
        p-4 border-t flex items-center space-x-2
        ${isDarkMode 
          ? 'border-zinc-700 bg-zinc-800' 
          : 'border-zinc-200 bg-white'}
      `}>
        <div className="flex-grow">
          <input 
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className={`
              w-full p-3 rounded-xl focus:outline-none 
              ${isDarkMode 
                ? 'bg-zinc-700 text-zinc-100 placeholder-zinc-400 focus:ring-2 focus:ring-emerald-600' 
                : 'bg-zinc-100 text-zinc-900 placeholder-zinc-500 focus:ring-2 focus:ring-emerald-500'}
              transition-all duration-300
            `}
          />
        </div>
        <button 
          onClick={handleSendMessage}
          className={`
            p-3 rounded-full transition-colors
            ${isDarkMode 
              ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
              : 'bg-emerald-500 text-white hover:bg-emerald-600'}
          `}
        >
          <Send size={20} />
        </button>
      </div>

      {/* Custom Scrollbar for Dark Mode */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDarkMode ? '#27272a' : '#f4f4f5'};
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? '#3f3f46' : '#d4d4d8'};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? '#52525b' : '#a1a1aa'};
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;