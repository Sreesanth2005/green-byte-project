
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { analyzeRecyclingImpact, getRandomEcoTips } from "@/lib/edgeFunctions";
import { useAuth } from "@/contexts/AuthContext";

// Define color scheme for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalysisPanel = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [ecoTips, setEcoTips] = useState<any[]>([]);
  const [timeFrame, setTimeFrame] = useState("month");
  const [category, setCategory] = useState("all");

  const categoryData = [
    { name: "Electronics", value: 40 },
    { name: "Plastic", value: 30 },
    { name: "Paper", value: 15 },
    { name: "Glass", value: 10 },
    { name: "Metal", value: 5 },
  ];

  const monthlyData = [
    { name: "Jan", credits: 150 },
    { name: "Feb", credits: 200 },
    { name: "Mar", credits: 180 },
    { name: "Apr", credits: 270 },
    { name: "May", credits: 310 },
    { name: "Jun", credits: 290 },
  ];

  useEffect(() => {
    fetchEcoTips();
  }, []);

  const fetchEcoTips = async () => {
    try {
      const tips = await getRandomEcoTips(5);
      setEcoTips(tips || []);
    } catch (error) {
      console.error("Error fetching eco tips:", error);
      toast({
        title: "Error",
        description: "Failed to fetch eco tips. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const generateAnalysis = async () => {
    setLoading(true);
    try {
      const result = await analyzeRecyclingImpact(
        user?.id,
        category,
        timeFrame
      );
      setAnalysis(result);
    } catch (error) {
      console.error("Error generating analysis:", error);
      toast({
        title: "Analysis Failed",
        description: "We couldn't generate your recycling analysis. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Recycling Impact Analysis</CardTitle>
          <CardDescription>
            Get insights into your recycling habits and environmental impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Time Period</label>
                <Select value={timeFrame} onValueChange={setTimeFrame}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">Category</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="plastic">Plastic</SelectItem>
                    <SelectItem value="paper">Paper</SelectItem>
                    <SelectItem value="glass">Glass</SelectItem>
                    <SelectItem value="metal">Metal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={generateAnalysis} 
                  disabled={loading}
                  className="w-full md:w-auto"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Analyzing...
                    </>
                  ) : "Generate Analysis"}
                </Button>
              </div>
            </div>
            
            {analysis && (
              <div className="mt-6 space-y-6">
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-2">Your Recycling Impact</h3>
                  <div className="whitespace-pre-line text-gray-700">
                    {analysis.analysis}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Recycling Metrics</CardTitle>
          <CardDescription>
            View your recycling activity over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monthly">
            <TabsList className="mb-4">
              <TabsTrigger value="monthly">Monthly Activity</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>
            <TabsContent value="monthly">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="credits" fill="#4ade80" name="Eco Credits Earned" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="categories">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eco Tips</CardTitle>
          <CardDescription>
            Sustainable living recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {ecoTips.length > 0 ? (
              ecoTips.map((tip, index) => (
                <li key={index} className="p-3 bg-green-50 rounded-md">
                  <p className="text-sm text-green-800">{tip.tip}</p>
                  <div className="mt-1 text-xs text-green-600">
                    Category: {tip.category}
                  </div>
                </li>
              ))
            ) : (
              <li className="p-3 bg-gray-50 rounded-md text-center">
                <p className="text-sm text-gray-500">No eco tips available</p>
                <Button 
                  variant="link" 
                  onClick={fetchEcoTips} 
                  className="mt-2 text-green-600"
                >
                  Refresh
                </Button>
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisPanel;
