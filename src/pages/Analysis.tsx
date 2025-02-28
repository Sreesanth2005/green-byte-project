
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Info, ArrowUpDown, Download, Filter, Award, Lightbulb, Globe, TrendingDown, Bookmark, MapPin } from "lucide-react";

const Analysis = () => {
  const [region, setRegion] = useState("global");
  const [period, setPeriod] = useState("yearly");
  
  // Sample data for charts
  const globalWasteData = [
    { name: '2019', amount: 59.6 },
    { name: '2020', amount: 63.3 },
    { name: '2021', amount: 67.2 },
    { name: '2022', amount: 71.0 },
    { name: '2023', amount: 74.7 },
    { name: '2024', amount: 78.5 },
  ];

  const wasteTypeData = [
    { name: 'Mobile Phones', value: 22 },
    { name: 'Computers', value: 28 },
    { name: 'TVs & Monitors', value: 18 },
    { name: 'Household Appliances', value: 24 },
    { name: 'Other', value: 8 },
  ];

  const leaderboardData = [
    { id: 1, name: 'Karnataka', amount: 5280, units: 'tons' },
    { id: 2, name: 'Maharashtra', amount: 4350, units: 'tons' },
    { id: 3, name: 'Delhi', amount: 3840, units: 'tons' },
    { id: 4, name: 'Tamil Nadu', amount: 3620, units: 'tons' },
    { id: 5, name: 'Gujarat', amount: 3240, units: 'tons' },
    { id: 6, name: 'Telangana', amount: 2980, units: 'tons' },
    { id: 7, name: 'Kerala', amount: 2750, units: 'tons' },
    { id: 8, name: 'Uttar Pradesh', amount: 2430, units: 'tons' },
  ];
  
  const ecoTips = [
    {
      id: 1,
      title: "Extend Your Device's Life",
      description: "Regular cleaning, software updates, and proper charging habits can extend the lifespan of your electronic devices by 2-3 years.",
      icon: <Lightbulb className="w-10 h-10 text-primary" />
    },
    {
      id: 2,
      title: "Responsible Disposal",
      description: "Never throw electronics in regular trash. Use Green Byte's pickup service to ensure proper recycling and earn EcoCredits.",
      icon: <Recycle className="w-10 h-10 text-primary" />
    },
    {
      id: 3,
      title: "Data Security",
      description: "Always perform a factory reset and remove storage devices before recycling to protect your personal information.",
      icon: <Shield className="w-10 h-10 text-primary" />
    },
    {
      id: 4,
      title: "Buy Refurbished",
      description: "Purchasing refurbished electronics reduces e-waste and saves up to 80% of the energy required to make new products.",
      icon: <ShoppingBag className="w-10 h-10 text-primary" />
    },
  ];

  const COLORS = ['#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-8">E-Waste Analysis & Insights</h1>
        
        <Tabs defaultValue="global" className="mb-12">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="global">Global Impact</TabsTrigger>
            <TabsTrigger value="tips">Tips & Tricks</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>
          
          {/* Global Impact Tab */}
          <TabsContent value="global">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Global E-Waste</h3>
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <p className="text-3xl font-bold">78.5 Mt</p>
                <p className="text-sm text-gray-600">Generated in 2024</p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Recycling Rate</h3>
                  <Recycle className="w-6 h-6 text-primary" />
                </div>
                <p className="text-3xl font-bold">17.4%</p>
                <p className="text-sm text-gray-600">Global average</p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Green Byte Impact</h3>
                  <TrendingDown className="w-6 h-6 text-success" />
                </div>
                <p className="text-3xl font-bold">24,850 kg</p>
                <p className="text-sm text-gray-600">E-waste properly recycled</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="font-semibold mb-6">Global E-Waste Trend</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={globalWasteData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'Million Metric Tons', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => [`${value} Mt`, 'E-Waste']} />
                      <Bar dataKey="amount" fill="#4CAF50" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-sm text-gray-600">Data Source: Global E-waste Monitor</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="font-semibold mb-6">E-Waste Composition</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={wasteTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {wasteTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Most e-waste consists of computers and mobile phones</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm mt-8">
              <h3 className="font-semibold mb-6">Environmental Impact of Proper E-Waste Recycling</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-primary/20 rounded-xl p-4 bg-primary/5">
                  <h4 className="font-medium text-center mb-2">Carbon Reduction</h4>
                  <p className="text-2xl text-center font-bold text-primary">325 tons</p>
                  <p className="text-sm text-center text-gray-600">CO₂ emissions avoided</p>
                </div>
                
                <div className="border border-primary/20 rounded-xl p-4 bg-primary/5">
                  <h4 className="font-medium text-center mb-2">Water Saved</h4>
                  <p className="text-2xl text-center font-bold text-primary">4.2M liters</p>
                  <p className="text-sm text-center text-gray-600">From manufacturing processes</p>
                </div>
                
                <div className="border border-primary/20 rounded-xl p-4 bg-primary/5">
                  <h4 className="font-medium text-center mb-2">Materials Recovered</h4>
                  <p className="text-2xl text-center font-bold text-primary">18.7 tons</p>
                  <p className="text-sm text-center text-gray-600">Rare metals & materials</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Tips & Tricks Tab */}
          <TabsContent value="tips">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {ecoTips.map(tip => (
                <div key={tip.id} className="bg-white p-6 rounded-2xl shadow-sm flex">
                  <div className="mr-4 flex-shrink-0">
                    {tip.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{tip.title}</h3>
                    <p className="text-gray-600">{tip.description}</p>
                    <Button variant="link" className="p-0 h-auto mt-2">Learn more</Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-semibold text-lg mb-4">Did You Know?</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <p className="text-gray-600">Only about 17.4% of e-waste is properly recycled globally, even though it contains valuable materials worth over $62.5 billion.</p>
                </div>
                
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <p className="text-gray-600">A single recycled cell phone can save enough energy to power a laptop for 44 hours.</p>
                </div>
                
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <p className="text-gray-600">E-waste contains hazardous materials like lead, mercury, and cadmium that can contaminate soil and water if not properly disposed of.</p>
                </div>
                
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-primary mr-2 mt-0.5" />
                  <p className="text-gray-600">Recycling one million laptops saves energy equivalent to the electricity used by 3,657 homes in a year.</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button className="mb-4">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save All Tips
                </Button>
                <p className="text-sm text-gray-600">Want to learn more about e-waste management? Check out our <Button variant="link" className="p-0 h-auto">resource center</Button>.</p>
              </div>
            </div>
          </TabsContent>
          
          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
              <h2 className="text-xl font-semibold">E-Waste Recycling Leaderboard</h2>
              
              <div className="flex flex-wrap gap-3">
                <select 
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  <option value="global">Global</option>
                  <option value="country">By Country</option>
                  <option value="state">By State (India)</option>
                  <option value="district">By District</option>
                </select>
                
                <select 
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                  <option value="all-time">All Time</option>
                </select>
                
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="font-semibold">Top Recycling Regions - {period.charAt(0).toUpperCase() + period.slice(1)}</h3>
              </div>
              
              <div className="divide-y">
                <div className="px-6 py-3 bg-gray-50 flex items-center">
                  <div className="w-16 text-center font-medium">#</div>
                  <div className="flex-1 font-medium">Region</div>
                  <div className="w-40 font-medium flex items-center">
                    Amount 
                    <Button variant="ghost" size="icon" className="ml-1 h-4 w-4">
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {leaderboardData.map((item) => (
                  <div key={item.id} className="px-6 py-4 flex items-center">
                    <div className="w-16 text-center">
                      {item.id <= 3 ? (
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                          item.id === 1 ? 'bg-yellow-100 text-yellow-800' :
                          item.id === 2 ? 'bg-gray-200 text-gray-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {item.id}
                        </div>
                      ) : (
                        <span className="text-gray-600">{item.id}</span>
                      )}
                    </div>
                    <div className="flex-1">{item.name}</div>
                    <div className="w-40 font-medium">
                      {item.amount.toLocaleString()} {item.units}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 border-t">
                <div className="flex justify-between items-center">
                  <Button variant="outline" size="sm">Previous</Button>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-primary/10 text-primary">1</Button>
                    <Button variant="outline" size="sm" className="w-8 h-8 p-0">2</Button>
                    <Button variant="outline" size="sm" className="w-8 h-8 p-0">3</Button>
                    <span>...</span>
                    <Button variant="outline" size="sm" className="w-8 h-8 p-0">8</Button>
                  </div>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <Award className="w-10 h-10 text-primary" />
                  <div>
                    <h3 className="font-semibold text-lg">Your Contribution</h3>
                    <p className="text-gray-600">You're making a difference!</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Your Recycling</span>
                      <span className="text-sm font-medium">87 kg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Regional Average</span>
                      <span className="text-sm font-medium">65 kg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-gray-500 h-2.5 rounded-full" style={{ width: '32%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Top Performer</span>
                      <span className="text-sm font-medium">195 kg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button>View Your Impact Report</Button>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-sm">
                <h3 className="font-semibold text-lg mb-4">Recent Milestones</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-4 items-start p-3 bg-primary/5 rounded-lg">
                    <div className="rounded-full bg-primary/20 p-2">
                      <Trophy className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">1 Million KG Milestone</h4>
                      <p className="text-sm text-gray-600">Together, our users have recycled over 1 million kg of e-waste!</p>
                      <p className="text-xs text-gray-500 mt-1">May 15, 2024</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start p-3 bg-primary/5 rounded-lg">
                    <div className="rounded-full bg-primary/20 p-2">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">100,000 Users</h4>
                      <p className="text-sm text-gray-600">Green Byte community has grown to 100,000 eco-conscious users.</p>
                      <p className="text-xs text-gray-500 mt-1">April 22, 2024</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start p-3 bg-primary/5 rounded-lg">
                    <div className="rounded-full bg-primary/20 p-2">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Nationwide Coverage</h4>
                      <p className="text-sm text-gray-600">Green Byte now offers pickup services in all major Indian cities.</p>
                      <p className="text-xs text-gray-500 mt-1">March 10, 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Analysis;

// Additional imports for the icons needed
import { Shield, ShoppingBag, Recycle, Trophy, Users } from "lucide-react";
