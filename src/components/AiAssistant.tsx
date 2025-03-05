
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BotIcon, SendIcon, XIcon, MinimizeIcon, MaximizeIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

// Mock responses for the AI assistant
const AI_RESPONSES: Record<string, string> = {
  default: "Hi there! I'm your recycling assistant. How can I help you today?",
  greeting: "Hello! I'm here to help with any questions about recycling electronics, earning eco-credits, or using our marketplace.",
  schedule: "To schedule a pickup, go to the 'Schedule Pickup' page. You'll need to select the type of electronics you're recycling, choose a date and time, and provide your address details.",
  credits: "EcoCredits are our rewards system. You earn them by recycling electronics with us. The amount depends on the type and condition of the items. You can use EcoCredits to purchase refurbished products in our marketplace.",
  marketplace: "Our marketplace offers quality-checked refurbished electronics at great prices. You can browse by category, check detailed product specifications, and purchase using your EcoCredits or regular payment methods.",
  help: "I can help with information about recycling electronics, scheduling pickups, earning and using EcoCredits, browsing our marketplace, or answering general sustainability questions.",
  recycle: "We accept most electronic devices including phones, laptops, tablets, desktop computers, monitors, printers, small appliances, and accessories like keyboards, mice, and cables. For large appliances, please contact our customer service."
};

// Function to get AI response based on user message
const getAiResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return AI_RESPONSES.greeting;
  } else if (lowerMessage.includes('schedule') || lowerMessage.includes('pickup')) {
    return AI_RESPONSES.schedule;
  } else if (lowerMessage.includes('credits') || lowerMessage.includes('ecocredits') || lowerMessage.includes('points')) {
    return AI_RESPONSES.credits;
  } else if (lowerMessage.includes('marketplace') || lowerMessage.includes('shop') || lowerMessage.includes('store')) {
    return AI_RESPONSES.marketplace;
  } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return AI_RESPONSES.help;
  } else if (lowerMessage.includes('recycle') || lowerMessage.includes('accept') || lowerMessage.includes('items')) {
    return AI_RESPONSES.recycle;
  } else {
    return "I'm not sure I understand. Could you rephrase your question? You can ask me about recycling, scheduling pickups, EcoCredits, or our marketplace.";
  }
};

interface Message {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      content: AI_RESPONSES.default,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate AI thinking and responding
    setTimeout(() => {
      const aiResponse: Message = {
        content: getAiResponse(userMessage.content),
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 rounded-full shadow-lg w-14 h-14 p-0"
      >
        <BotIcon className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className={cn(
      "fixed bottom-4 right-4 w-80 shadow-xl transition-all duration-300",
      isExpanded && "w-96 h-[600px]"
    )}>
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg py-3 px-4 flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2 bg-white text-primary">
            <AvatarImage src="" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-sm font-medium">Recycling Assistant</CardTitle>
            <CardDescription className="text-xs text-primary-foreground/70">Here to help with your recycling needs</CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" onClick={toggleExpand} className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20">
            {isExpanded ? <MinimizeIcon className="h-3 w-3" /> : <MaximizeIcon className="h-3 w-3" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleChat} className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20">
            <XIcon className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className={cn(
        "p-0 overflow-hidden",
        isExpanded ? "max-h-[500px]" : "max-h-80"
      )}>
        <div className="h-full overflow-y-auto p-4 space-y-4" style={{ maxHeight: isExpanded ? '500px' : '320px' }}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex",
                message.sender === 'user' ? "justify-end" : "justify-start"
              )}
            >
              {message.sender === 'ai' && (
                <Avatar className="h-8 w-8 mr-2 mt-1 bg-primary text-primary-foreground">
                  <AvatarImage src="" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "px-3 py-2 rounded-lg max-w-[80%]",
                  message.sender === 'user'
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-100 text-gray-800"
                )}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <Avatar className="h-8 w-8 mr-2 mt-1 bg-primary text-primary-foreground">
                <AvatarImage src="" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="p-3 border-t">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="sm" className="px-3">
            <SendIcon className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default AiAssistant;
