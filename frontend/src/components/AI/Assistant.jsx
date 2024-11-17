import React, { useEffect, useRef } from "react";
import { Bot, Send, Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AIAssistant = ({ messages, aiInput, setAiInput, handleSendMessage, isTyping }) => {
  const messagesEndRef = useRef(null);
  const [copiedMap, setCopiedMap] = useState({});
  
  // Add CSS for custom scrollbar
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCopy = async (text, id) => {
    try {
      // Write to clipboard
      await navigator.clipboard.writeText(text);
  
      // Mark the copied state for the specific block
      setCopiedMap((prev) => ({ ...prev, [id]: true }));
  
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedMap((prev) => ({ ...prev, [id]: false }));
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  // Wrapper component for copyable blocks
  const CopyableBlock = ({ children, content, className = "" }) => {
    // Generate a unique ID for the block
    const id = useRef(Math.random().toString(36).substr(2, 9));
  
    return (
      <div className={`relative group ${className}`}>
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleCopy(content, id.current)}
            className="p-1.5 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            title="Copy content"
          >
            {copiedMap[id.current] ? (
              <Check size={14} className="text-green-400" />
            ) : (
              <Copy size={14} className="text-white" />
            )}
          </button>
        </div>
        {children}
      </div>
    );
  };
  const components = {
    p: ({ children }) => (
      <p className="mb-4 whitespace-pre-wrap break-words leading-relaxed">
        {children}
      </p>
    ),
    
    ol: ({ children }) => (
      <ol className="list-decimal ml-6 mb-4 space-y-3">{children}</ol>
    ),
    ul: ({ children }) => (
      <ul className="list-disc ml-6 mb-4 space-y-3">{children}</ul>
    ),
    li: ({ children }) => (
      <li className="text-gray-800">{children}</li>
    ),
    
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold mb-4 mt-6 text-gray-900">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-bold mb-3 mt-5 text-gray-900">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-bold mb-2 mt-4 text-gray-900">{children}</h3>
    ),
    
    strong: ({ children }) => (
      <strong className="font-bold text-blue-700">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-purple-600">{children}</em>
    ),
    
    code: ({ inline, className, children }) => {
      const match = /language-(\w+)/.exec(className || '');
      const content = String(children).replace(/\n$/, '');
      
      return !inline ? (
        <CopyableBlock content={content} className="relative">
          <SyntaxHighlighter
            style={atomDark}
            language={match ? match[1] : 'text'}
            PreTag="div"
            className="rounded-lg mb-4"
          >
            {content}
          </SyntaxHighlighter>
        </CopyableBlock>
      ) : (
        <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm text-pink-500">
          {children}
        </code>
      );
    },
    
    pre: ({ children }) => (
        <pre>{children}</pre>
    ),
    
    blockquote: ({ children }) => (
      <CopyableBlock 
        content={children}
        className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-700"
      >
        <blockquote>{children}</blockquote>
      </CopyableBlock>
    ),
  };

  const MessageBubble = ({ message, index }) => {
    const isUser = message.sender === "user";

    return (
      <div
        className={`flex items-start space-x-2 mb-4 ${
          isUser ? "flex-row-reverse space-x-reverse" : "flex-row"
        }`}
      >
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-1">
            <Bot size={18} className="text-white" />
          </div>
        )}
        <div
          className={`relative px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none max-w-[80%]"
              : "bg-white border border-gray-200 shadow-sm text-gray-800 rounded-bl-none max-w-[80%]"
          }`}
        >
          <div className="prose prose-sm max-w-none">
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              <ReactMarkdown components={components}>
                {message.text}
              </ReactMarkdown>
            </div>
          </div>
          {!isUser && (
            <button
              onClick={() => handleCopy(message.text, `message-${index}`)}
              className="absolute bottom-2 right-2 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Copy message"
            >
              {copiedMap[`message-${index}`] ? (
                <Check size={14} className="text-green-600" />
              ) : (
                <Copy size={14} className="text-gray-600" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-[600px] flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Sehpaathi AI</h3>
            <p className="text-sm text-gray-600">
              A friendly ChatBot for MITS Gwalior
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} index={index} />
          ))}
          {isTyping && (
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div className="bg-white border border-gray-200 shadow-sm px-4 py-3 rounded-2xl rounded-bl-none">
                <div className="flex space-x-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
        <div className="flex space-x-4">
          <input
            type="text"
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="Ask anything about your studies..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            disabled={!aiInput.trim() || isTyping}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
              aiInput.trim() && !isTyping
                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send size={18} />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500 text-center">
          Press Enter to send your message
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;