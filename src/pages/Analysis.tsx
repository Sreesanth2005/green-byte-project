
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AnalysisPanel from '@/components/AnalysisPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Leaf, MessageCircle, Send } from 'lucide-react';
import mockDatabase, { MockEcoTip } from '@/utils/mockDatabase';

const Analysis = () => {
  const [ecoTips, setEcoTips] = useState<MockEcoTip[]>([]);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<{ user: string; bot: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load eco tips
    const { tips } = mockDatabase.getEcoTips(4);
    setEcoTips(tips);
  }, []);

  const handleAskQuestion = () => {
    if (!question.trim()) return;

    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const { answer } = mockDatabase.getChatbotResponse(question);
      
      setChatHistory(prev => [...prev, { 
        user: question, 
        bot: answer 
      }]);
      
      setQuestion('');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold mb-8">Recycling Impact Analysis</h1>
        
        {/* Analysis Panel */}
        <AnalysisPanel />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Eco Tips Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="bg-primary/10">
                <CardTitle className="flex items-center text-primary">
                  <Leaf className="mr-2 h-5 w-5" />
                  Eco Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {ecoTips.map(tip => (
                    <div key={tip.id} className="border-b pb-4 last:border-b-0">
                      <h3 className="font-semibold mb-1">{tip.title}</h3>
                      <p className="text-sm text-gray-600">{tip.content}</p>
                      <span className="text-xs text-primary mt-2 inline-block">#{tip.category}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Eco Assistant Chatbot */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              <CardHeader className="bg-primary/10">
                <CardTitle className="flex items-center text-primary">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Eco Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col pt-6">
                <div className="flex-grow overflow-auto mb-4 max-h-[400px]">
                  {chatHistory.length === 0 ? (
                    <div className="text-center text-gray-500 my-8">
                      <MessageCircle className="h-12 w-12 mx-auto mb-3 text-primary/30" />
                      <p>Ask our Eco Assistant about recycling, e-waste, or our services.</p>
                      <p className="text-sm mt-2">Try questions like "How do EcoCredits work?" or "What happens to my e-waste?"</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chatHistory.map((chat, index) => (
                        <div key={index}>
                          <div className="bg-gray-100 p-3 rounded-lg rounded-br-none inline-block max-w-[80%] mb-2">
                            <p className="text-gray-800">{chat.user}</p>
                          </div>
                          <div className="clear-both"></div>
                          <div className="bg-primary/10 p-3 rounded-lg rounded-bl-none inline-block max-w-[80%] ml-auto">
                            <p className="text-gray-800">{chat.bot}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-auto">
                  <Input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question about e-waste recycling..."
                    onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                  />
                  <Button 
                    onClick={handleAskQuestion} 
                    disabled={loading || !question.trim()}
                  >
                    {loading ? (
                      <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-white"></div>
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Analysis;
