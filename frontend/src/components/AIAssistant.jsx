import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Send, X, MessageSquare, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! I am LIC Secure Assistant 🤖. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateBotResponse = (userInput) => {
    const text = userInput.toLowerCase();
    
    if (text.includes('pay') || text.includes('premium') || text.includes('installment')) {
      return (
        <span>
          To pay your premium securely online, please visit the <Link to="/payments" onClick={() => setIsOpen(false)} className="text-blue-400 font-bold underline hover:text-blue-300">Payment Dashboard</Link>. You can use UPI, Cards, or NetBanking!
        </span>
      );
    }
    
    if (text.includes('claim')) {
      return (
        <span>
          Need to file a claim? You can submit your documents and track your claim status in the <Link to="/claims" onClick={() => setIsOpen(false)} className="text-blue-400 font-bold underline hover:text-blue-300">Claims Center</Link>.
        </span>
      );
    }

    if (text.includes('register') || text.includes('account') || text.includes('sign up')) {
      return (
        <span>
          Creating an account is easy! Head over to the <Link to="/register" onClick={() => setIsOpen(false)} className="text-blue-400 font-bold underline hover:text-blue-300">Registration Page</Link> to create your secure profile.
        </span>
      );
    }
    
    if (text.includes('plan') || text.includes('policy') || text.includes('buy')) {
      return (
        <span>
          We offer various plans like Jeevan Anand, Jeevan Labh, and Bima Jyoti. Check them out on our <Link to="/plans" onClick={() => setIsOpen(false)} className="text-blue-400 font-bold underline hover:text-blue-300">Plans Page</Link> and apply online!
        </span>
      );
    }

    if (text.includes('error') || text.includes('problem') || text.includes('fail')) {
      return "I'm sorry you're facing an issue. Please try refreshing the page. If the problem persists, you can contact our support team at 1800-425-4422.";
    }

    if (text.includes('hello') || text.includes('hi')) {
      return "Hello there! How can I assist you with LIC Secure Future today?";
    }

    return "I'm a simulated AI assistant for this project. I can help you with questions about payments, claims, registration, and our policies. What would you like to know?";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const botResponse = { 
        id: Date.now() + 1, 
        type: 'bot', 
        text: generateBotResponse(userMessage.text) 
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 second delay
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
          >
            <MessageSquare size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-80 md:w-96 bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 flex flex-col"
            style={{ maxHeight: '600px', height: '80vh' }}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-800 to-indigo-900 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">LIC Smart Assistant</h3>
                  <p className="text-[10px] text-blue-200 flex items-center gap-1">
                    <ShieldCheck size={10} /> Secure AI Chat
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800 scrollbar-thin scrollbar-thumb-gray-600">
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.type === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-sm' 
                      : 'bg-gray-700 text-gray-200 rounded-bl-sm border border-gray-600 shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 p-4 rounded-2xl rounded-bl-sm border border-gray-600 flex items-center gap-2">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-2 h-2 bg-blue-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-blue-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-blue-400 rounded-full" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-gray-900 border-t border-gray-700 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-xl text-sm outline-none border border-gray-700 focus:border-blue-500 transition-colors"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
