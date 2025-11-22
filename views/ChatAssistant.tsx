
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, User, UserRole } from '../types';
import { GeminiService } from '../services/geminiService';
import { Button } from '../components/Button';
import { Send, Sparkles, User as UserIcon, Bot } from 'lucide-react';

interface ChatAssistantProps {
  geminiService: GeminiService;
  user: User;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ geminiService, user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: `Hi there! I'm Food Buddy, your SustainaBite assistant. ${
        user.role === UserRole.BUSINESS 
          ? "I can help you optimize your listings, suggest pricing strategies, or analyze food trends." 
          : "I can help you find cheap eats, suggest recipes based on our discounted inventory, or locate farms near you."
      } What's on your mind?`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = geminiService.sendMessageStream(userMessage.text);
      
      // Create placeholder for AI response
      setMessages(prev => [...prev, { role: 'model', text: '', timestamp: Date.now() }]);
      
      let fullText = '';
      
      for await (const chunk of stream) {
        fullText += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = fullText;
          return newMessages;
        });
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now.", timestamp: Date.now(), isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = user.role === UserRole.BUSINESS 
    ? [
        "What can I do to enhance my profit?",
        "How to reduce inventory waste?",
        "Marketing ideas for local produce",
        "Draft a description for a new item"
      ]
    : [
        "Find me a meal under $6",
        "Recipes with discounted bread",
        "What farms are in North York?",
        "Vegetarian dinner ideas"
    ];

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex-grow overflow-y-auto p-4 space-y-6">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mx-2 ${msg.role === 'user' ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300' : 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'}`}>
                {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
              </div>
              
              <div className={`p-4 rounded-2xl shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tr-none border border-gray-300 dark:border-gray-700' 
                  : 'bg-green-600 text-white rounded-tl-none'
              }`}>
                {msg.role === 'model' ? (
                   <div className="prose prose-sm max-w-none prose-invert" dangerouslySetInnerHTML={{ 
                     // Basic formatting for the AI response which might contain markdown-like syntax
                     __html: msg.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                   }} />
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="flex items-center space-x-2 ml-12 bg-white dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-200 dark:border-gray-700 shadow-sm">
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 transition-colors">
        {messages.length < 3 && (
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setInput(suggestion);
                  // Optional: auto send
                }}
                className="text-xs bg-green-50 dark:bg-gray-700 text-green-700 dark:text-green-400 px-3 py-1 rounded-full border border-green-100 dark:border-gray-600 hover:bg-green-100 dark:hover:bg-gray-600 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <div className="max-w-4xl mx-auto relative flex items-center gap-2">
           <div className="relative flex-grow">
             <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={user.role === UserRole.BUSINESS ? "Ask Food Buddy about business insights..." : "Ask Food Buddy about food, recipes, or deals..."}
              className="w-full pl-4 pr-12 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
              disabled={isLoading}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 dark:text-green-500">
              <Sparkles size={18} />
            </div>
           </div>
           <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            className="rounded-xl h-[48px] w-[48px] !p-0 flex items-center justify-center"
          >
             <Send size={20} className={isLoading ? 'opacity-0' : ''} />
           </Button>
        </div>
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
          AI can make mistakes. Please verify prices and availability.
        </p>
      </div>
    </div>
  );
};
