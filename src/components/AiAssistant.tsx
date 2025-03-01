
import { Button } from "@/components/ui/button";
import { MessageSquare, X, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI
const genAI = new GoogleGenerativeAI("AIzaSyDNWWxwU4erRWqLXBXnQeUB5s74UfTYPAQ"); // This is a demo API key; in production, use env variables

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai'; content: string }>>([
    { type: 'ai', content: 'Hi! I\'m your Green Byte assistant powered by Gemini AI. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: input }]);

    // Clear input and show typing indicator
    setInput('');
    setIsTyping(true);

    try {
      // Generate content with Gemini
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `
You are an AI assistant for Green Byte, an e-waste recycling platform. 
Answer the following question about e-waste recycling, eco-friendly practices, or the Green Byte platform:
${input}

Keep your response concise (under 150 words) and focused on helping users understand e-waste recycling. 
If asked about Green Byte specifically, explain that it's a platform for scheduling e-waste pickups, browsing a marketplace for refurbished electronics, and earning eco-credits.
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const aiMessage = response.text();

      // Add AI response
      setMessages(prev => [...prev, { type: 'ai', content: aiMessage }]);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages(prev => [...prev, { type: 'ai', content: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-lg"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      <div className={cn(
        "fixed bottom-20 right-4 w-96 bg-white rounded-2xl shadow-xl transition-all duration-300 transform z-50",
        isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      )}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Green Byte AI Assistant</h3>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message, i) => (
            <div
              key={i}
              className={cn(
                "p-3 rounded-lg max-w-[80%]",
                message.type === 'user' ? "bg-primary text-white ml-auto" : "bg-gray-100"
              )}
            >
              {message.content}
            </div>
          ))}
          {isTyping && (
            <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={isTyping}
          />
          <Button type="submit" size="icon" disabled={isTyping || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </>
  );
};

export default AiAssistant;
