
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  LineChart, 
  AreaChart, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart as RechartsLineChart, 
  Line, 
  AreaChart as RechartsAreaChart,
  Area
} from "recharts";
import { 
  RefreshCw, 
  Leaf, 
  Droplets, 
  Zap, 
  Cloud, 
  Download, 
  BarChart2, 
  TrendingUp, 
  StepForward
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Analysis = () => {
  const [activeTab, setActiveTab] = useState("impact");
  const [loading, setLoading] = useState(false);
  const [impact, setImpact] = useState<any>(null);
  const [recyclingData, setRecyclingData] = useState<any[]>([]);
  const [ecoTips, setEcoTips] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to view your recycling analysis.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    fetchEcoTips();
    fetchRecyclingData();
    fetchImpactAnalysis();
  }, [user]);

  const fetchEcoTips = async () => {
    try {
      // Try to get tips from the database first
      const { data, error } = await supabase
        .from('eco_tips')
        .select('tip')
        .limit(5);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        setEcoTips(data.map(item => item.tip));
      } else {
        // If no tips in database, generate them using the function
        const response = await supabase.functions.invoke('generate-eco-tips', {
          body: { category: 'e-waste recycling' }
        });
        
        if (response.error) throw response.error;
        
        const tips = response.data.tips || [];
        setEcoTips(Array.isArray(tips) ? tips : [tips]);
      }
    } catch (error) {
      console.error("Error fetching eco tips:", error);
      setEcoTips([
        "Always remove batteries from electronics before recycling",
        "Consider repairing your devices before replacing them",
        "Donate working electronics to schools or nonprofits",
        "Factory reset your devices before recycling to protect data",
        "Check with manufacturers for take-back programs"
      ]);
    }
  };

  const fetchRecyclingData = async () => {
    try {
      const { data, error } = await supabase
        .from('schedule_pickups')
        .select('category, pickup_date, eco_credits_earned, status')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('pickup_date', { ascending: true });
        
      if (error) throw error;
      
      // Process data for charts
      const processedData = processRecyclingData(data || []);
      setRecyclingData(processedData);
    } catch (error) {
      console.error("Error fetching recycling data:", error);
      // Set sample data for demonstration
      setRecyclingData(getSampleRecyclingData());
    }
  };

  const fetchImpactAnalysis = async () => {
    try {
      setLoading(true);
      
      const response = await supabase.functions.invoke('analyze-recycling-impact', {
        body: { userId: user.id }
      });
      
      if (response.error) throw response.error;
      
      setImpact(response.data || {});
    } catch (error) {
      console.error("Error fetching impact analysis:", error);
      // Set sample impact data
      setImpact({
        summary: "You've made a positive impact by recycling electronic waste. Your efforts have helped reduce carbon emissions and recover valuable materials.",
        environmentalImpact: {
          co2Reduced: "45 kg",
          waterSaved: "2,300 liters",
          energySaved: "125 kWh"
        },
        recommendations: [
          "Consider recycling more diverse types of electronics",
          "Schedule regular recycling pickups to maximize impact",
          "Encourage friends and family to recycle their e-waste too"
        ],
        achievementUnlocked: "E-Waste Warrior",
        nextMilestone: "Recycle 10 items to reach the next level"
      });
    } finally {
      setLoading(false);
    }
  };

  const processRecyclingData = (data: any[]) => {
    // Group by month
    const monthlyData = data.reduce((acc, item) => {
      const date = new Date(item.pickup_date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = {
          name: monthYear,
          credits: 0,
          items: 0
        };
      }
      
      acc[monthYear].credits += item.eco_credits_earned || 0;
      acc[monthYear].items += 1;
      
      return acc;
    }, {});
    
    // Convert to array for Recharts
    return Object.values(monthlyData);
  };

  const getSampleRecyclingData = () => {
    // Generate 6 months of sample data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentYear = new Date().getFullYear();
    
    return months.map(month => ({
      name: `${month} ${currentYear}`,
      credits: Math.floor(Math.random() * 200) + 50,
      items: Math.floor(Math.random() * 5) + 1
    }));
  };

  const handleRefresh = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to refresh your analysis.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    fetchEcoTips();
    fetchRecyclingData();
    fetchImpactAnalysis();
    
    toast({
      title: "Refreshed",
      description: "Your recycling analysis has been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Recycling Analysis</h1>
            <p className="text-gray-600">Track your environmental impact and progress</p>
          </div>
          <Button onClick={handleRefresh} className="mt-4 sm:mt-0 flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>

        <Tabs defaultValue="impact" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="impact">Impact</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="tips">Eco Tips</TabsTrigger>
          </TabsList>
          
          {/* Impact Tab */}
          <TabsContent value="impact" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>Your Recycling Impact</CardTitle>
                  <CardDescription>Summary of your e-waste recycling efforts</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  ) : impact ? (
                    <div>
                      <p className="text-gray-600 mb-6">{impact.summary}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-green-50 p-6 rounded-xl">
                          <div className="flex justify-between items-start mb-2">
                            <Leaf className="text-green-500 h-6 w-6" />
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">CO₂</span>
                          </div>
                          <p className="text-2xl font-bold text-green-700">{impact.environmentalImpact?.co2Reduced}</p>
                          <p className="text-sm text-green-600">Carbon dioxide reduced</p>
                        </div>
                        
                        <div className="bg-blue-50 p-6 rounded-xl">
                          <div className="flex justify-between items-start mb-2">
                            <Droplets className="text-blue-500 h-6 w-6" />
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">H₂O</span>
                          </div>
                          <p className="text-2xl font-bold text-blue-700">{impact.environmentalImpact?.waterSaved}</p>
                          <p className="text-sm text-blue-600">Water saved</p>
                        </div>
                        
                        <div className="bg-yellow-50 p-6 rounded-xl">
                          <div className="flex justify-between items-start mb-2">
                            <Zap className="text-yellow-500 h-6 w-6" />
                            <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">kWh</span>
                          </div>
                          <p className="text-2xl font-bold text-yellow-700">{impact.environmentalImpact?.energySaved}</p>
                          <p className="text-sm text-yellow-600">Energy saved</p>
                        </div>
                      </div>
                      
                      <div className="mb-8">
                        <h3 className="font-semibold mb-4">Personalized Recommendations</h3>
                        <ul className="space-y-2">
                          {impact.recommendations?.map((recommendation: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <div className="bg-primary/10 rounded-full p-1 mt-0.5 mr-3">
                                <StepForward className="h-4 w-4 text-primary" />
                              </div>
                              <span>{recommendation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-green-100 bg-green-50 p-4 rounded-lg">
                          <h4 className="font-medium text-green-800 mb-1">Achievement Unlocked</h4>
                          <p className="text-green-700">{impact.achievementUnlocked}</p>
                        </div>
                        
                        <div className="border border-blue-100 bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-800 mb-1">Next Milestone</h4>
                          <p className="text-blue-700">{impact.nextMilestone}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No recycling data available yet.</p>
                      <p className="text-gray-500 text-sm mt-2">Start recycling e-waste to see your impact!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Trends Tab */}
          <TabsContent value="trends" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Recycling Trends</CardTitle>
                    <CardDescription>Your recycling activity over time</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="mt-4 sm:mt-0 flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={recyclingData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        barSize={30}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12 }}
                          interval={0}
                          angle={-45}
                          textAnchor="end"
                        />
                        <YAxis yAxisId="left" orientation="left" stroke="#4ade80" />
                        <YAxis yAxisId="right" orientation="right" stroke="#60a5fa" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="credits" name="Eco Credits" fill="#4ade80" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="items" name="Items Recycled" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart2 className="h-5 w-5 text-primary" />
                      Credits Earned
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsAreaChart
                          data={recyclingData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="credits" name="Eco Credits" stroke="#4ade80" fill="#4ade80" fillOpacity={0.3} />
                        </RechartsAreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      Items Recycled
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                          data={recyclingData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="items" name="Items Recycled" stroke="#60a5fa" strokeWidth={2} dot={{ r: 4 }} />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Eco Tips Tab */}
          <TabsContent value="tips" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Eco-Friendly Tips</CardTitle>
                <CardDescription>Suggestions to help you recycle more effectively</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {ecoTips.length > 0 ? (
                    ecoTips.map((tip, index) => (
                      <div key={index} className="bg-green-50 rounded-lg p-6">
                        <div className="flex items-start">
                          <div className="bg-green-100 rounded-full p-2 mr-4">
                            <Leaf className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-green-800">{tip}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading eco tips...</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-8">
                  <Button variant="outline" onClick={fetchEcoTips} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Get New Tips
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Analysis;
