
import { Button } from "@/components/ui/button";
import { MessageSquare, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai'; content: string }>>([
    { type: 'ai', content: 'Hi! I\'m your Green Byte assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { type: 'user', content: input }]);

    // Simulate AI response based on user input
    const userInput = input.toLowerCase();
    let aiResponse = "I'm not sure about that. Can you please be more specific?";

    if (userInput.includes('pickup') || userInput.includes('schedule')) {
      aiResponse = "You can schedule a pickup by clicking 'Schedule Pickup' in the navigation menu. Would you like me to guide you there?";
    } else if (userInput.includes('marketplace') || userInput.includes('buy')) {
      aiResponse = "Our marketplace features eco-friendly refurbished electronics. You can access it through the 'Marketplace' link in the navigation.";
    } else if (userInput.includes('credits') || userInput.includes('points')) {
      aiResponse = "Check your EcoCredits balance and history in the 'My EcoCredits' section. Each recycling contribution earns you points!";
    }

    // Add AI response with a slight delay to feel more natural
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'ai', content: aiResponse }]);
    }, 500);

    setInput('');
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
        "fixed bottom-20 right-4 w-96 bg-white rounded-2xl shadow-xl transition-all duration-300 transform",
        isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
      )}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">AI Assistant</h3>
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
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </form>
      </div>
    </>
  );
};

export default AiAssistant;
