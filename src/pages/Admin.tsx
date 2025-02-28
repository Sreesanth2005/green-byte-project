
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Users, ShoppingBag, CreditCard, Bell, Settings, LogOut, User, BarChart, PieChart, LineChart, ArrowUpRight, ArrowDownRight, Download, Trash, Edit, Eye, Plus, HelpCircle } from "lucide-react";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

const Admin = () => {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  
  // Sample data for charts
  const userActivityData = [
    { name: 'Jan', active: 400, new: 240 },
    { name: 'Feb', active: 450, new: 210 },
    { name: 'Mar', active: 520, new: 280 },
    { name: 'Apr', active: 590, new: 250 },
    { name: 'May', active: 620, new: 310 },
    { name: 'Jun', active: 700, new: 360 },
  ];
  
  const recyclingData = [
    { name: 'Jan', amount: 1200 },
    { name: 'Feb', amount: 1400 },
    { name: 'Mar', amount: 1800 },
    { name: 'Apr', amount: 2200 },
    { name: 'May', amount: 2600 },
    { name: 'Jun', amount: 3100 },
  ];
  
  const deviceTypeData = [
    { name: 'Mobile Phones', value: 35 },
    { name: 'Computers', value: 25 },
    { name: 'TVs & Monitors', value: 15 },
    { name: 'Household Appliances', value: 20 },
    { name: 'Other', value: 5 },
  ];
  
  const COLORS = ['#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800'];
  
  // Sample data for tables
  const recentUsers = [
    { id: 1, name: 'John Smith', email: 'john.smith@example.com', joined: '2024-06-10', status: 'active' },
    { id: 2, name: 'Priya Mehta', email: 'priya.m@example.com', joined: '2024-06-08', status: 'active' },
    { id: 3, name: 'David Chen', email: 'david.c@example.com', joined: '2024-06-07', status: 'pending' },
    { id: 4, name: 'Sarah Johnson', email: 'sarah.j@example.com', joined: '2024-06-05', status: 'active' },
    { id: 5, name: 'Rahul Sharma', email: 'rahul.s@example.com', joined: '2024-06-03', status: 'inactive' },
  ];
  
  const recentPickups = [
    { id: 'PK-12345', user: 'John Smith', items: ['Laptop', 'Mobile Phone'], date: '2024-06-10', status: 'completed', credits: 250 },
    { id: 'PK-12344', user: 'Priya Mehta', items: ['TV', 'Computer'], date: '2024-06-08', status: 'scheduled', credits: 350 },
    { id: 'PK-12343', user: 'Sarah Johnson', items: ['Refrigerator'], date: '2024-06-07', status: 'in-progress', credits: 400 },
    { id: 'PK-12342', user: 'David Chen', items: ['Tablet', 'Printer', 'Keyboard'], date: '2024-06-05', status: 'completed', credits: 180 },
    { id: 'PK-12341', user: 'Rahul Sharma', items: ['Mobile Phone'], date: '2024-06-03', status: 'completed', credits: 50 },
  ];
  
  const recentTransactions = [
    { id: 'TX-12345', user: 'John Smith', type: 'credit', amount: 250, date: '2024-06-10', description: 'Recycling reward' },
    { id: 'TX-12344', user: 'Priya Mehta', type: 'debit', amount: 120, date: '2024-06-08', description: 'Marketplace purchase' },
    { id: 'TX-12343', user: 'Sarah Johnson', type: 'credit', amount: 500, date: '2024-06-07', description: 'Money conversion' },
    { id: 'TX-12342', user: 'David Chen', type: 'credit', amount: 180, date: '2024-06-05', description: 'Recycling reward' },
    { id: 'TX-12341', user: 'Rahul Sharma', type: 'debit', amount: 240, date: '2024-06-03', description: 'Marketplace purchase' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r">
        <div className="p-6 border-b">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/24b8d545-2e4e-42c1-9d48-3e0dd4888244.png" 
              alt="Green Byte Logo" 
              className="w-10 h-10 mr-3"
            />
            <div>
              <h1 className="font-bold text-xl text-primary">Green Byte</h1>
              <p className="text-xs text-gray-600">Admin Panel</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-1">
            <li>
              <button 
                onClick={() => setSelectedTab("dashboard")}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  selectedTab === "dashboard" 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <BarChart className="w-5 h-5 mr-3" />
                Dashboard
              </button>
            </li>
            <li>
              <button 
                onClick={() => setSelectedTab("users")}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  selectedTab === "users" 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Users className="w-5 h-5 mr-3" />
                Users
              </button>
            </li>
            <li>
              <button 
                onClick={() => setSelectedTab("pickups")}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  selectedTab === "pickups" 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <ShoppingBag className="w-5 h-5 mr-3" />
                Pickups
              </button>
            </li>
            <li>
              <button 
                onClick={() => setSelectedTab("transactions")}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  selectedTab === "transactions" 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <CreditCard className="w-5 h-5 mr-3" />
                Transactions
              </button>
            </li>
            <li>
              <button 
                onClick={() => setSelectedTab("reports")}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  selectedTab === "reports" 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <LineChart className="w-5 h-5 mr-3" />
                Reports
              </button>
            </li>
            <li>
              <button 
                onClick={() => setSelectedTab("notifications")}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  selectedTab === "notifications" 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Bell className="w-5 h-5 mr-3" />
                Notifications
              </button>
            </li>
            <li>
              <button 
                onClick={() => setSelectedTab("settings")}
                className={`w-full flex items-center p-3 rounded-lg text-left ${
                  selectedTab === "settings" 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </button>
            </li>
          </ul>
          
          <div className="pt-8 mt-8 border-t">
            <div className="flex items-center p-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">Admin User</p>
                <p className="text-xs text-gray-600">admin@greenbyte.com</p>
              </div>
            </div>
            <button className="mt-4 w-full flex items-center p-3 rounded-lg text-left text-red-600 hover:bg-red-50">
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            {selectedTab === "dashboard" && "Dashboard"}
            {selectedTab === "users" && "User Management"}
            {selectedTab === "pickups" && "Pickup Management"}
            {selectedTab === "transactions" && "Transaction Management"}
            {selectedTab === "reports" && "Reports & Analytics"}
            {selectedTab === "notifications" && "Notification Management"}
            {selectedTab === "settings" && "System Settings"}
          </h1>
          <div className="flex items-center gap-4">
            <button className="relative">
              <Bell className="w-5 h-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
            <button className="relative">
              <HelpCircle className="w-5 h-5 text-gray-700" />
            </button>
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>
        
        {/* Dashboard */}
        {selectedTab === "dashboard" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold">15,248</p>
                    <div className="flex items-center mt-1 text-sm">
                      <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">12%</span>
                      <span className="text-gray-500 ml-1">from last month</span>
                    </div>
                  </div>
                  <div className="h-10 w-20 bg-gray-100 rounded"></div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">Total Pickups</h3>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold">8,547</p>
                    <div className="flex items-center mt-1 text-sm">
                      <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">8%</span>
                      <span className="text-gray-500 ml-1">from last month</span>
                    </div>
                  </div>
                  <div className="h-10 w-20 bg-gray-100 rounded"></div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">E-Waste Collected</h3>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Recycle className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold">24,850 kg</p>
                    <div className="flex items-center mt-1 text-sm">
                      <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">15%</span>
                      <span className="text-gray-500 ml-1">from last month</span>
                    </div>
                  </div>
                  <div className="h-10 w-20 bg-gray-100 rounded"></div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-600">Total Credits</h3>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold">1.2M</p>
                    <div className="flex items-center mt-1 text-sm">
                      <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                      <span className="text-red-500 font-medium">3%</span>
                      <span className="text-gray-500 ml-1">from last month</span>
                    </div>
                  </div>
                  <div className="h-10 w-20 bg-gray-100 rounded"></div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium">User Activity</h3>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={userActivityData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="active" name="Active Users" fill="#4CAF50" />
                      <Bar dataKey="new" name="New Users" fill="#8BC34A" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium">Monthly Recycling</h3>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={recyclingData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} kg`, 'E-Waste']} />
                      <Legend />
                      <Line type="monotone" dataKey="amount" name="E-Waste (kg)" stroke="#4CAF50" activeDot={{ r: 8 }} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-medium mb-6">Device Types Collected</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={deviceTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {deviceTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-medium">Recent Users</h3>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                <User className="w-4 h-4 text-primary" />
                              </div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.joined}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status === 'active' ? 'bg-green-100 text-green-800' :
                              user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Users Tab */}
        {selectedTab === "users" && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="relative flex-grow max-w-md">
                <Input placeholder="Search users..." className="pl-10" />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.joined}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' :
                            user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="px-6 py-4 bg-white border-t flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">15,248</span> users
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Pickups Tab */}
        {selectedTab === "pickups" && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="relative flex-grow max-w-md">
                <Input placeholder="Search pickups..." className="pl-10" />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Pickup
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pickup ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Credits
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentPickups.map((pickup) => (
                      <tr key={pickup.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                          {pickup.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pickup.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pickup.items.join(', ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {pickup.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            pickup.status === 'completed' ? 'bg-green-100 text-green-800' :
                            pickup.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {pickup.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {pickup.credits}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="px-6 py-4 bg-white border-t flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">8,547</span> pickups
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Transactions Tab */}
        {selectedTab === "transactions" && (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div className="relative flex-grow max-w-md">
                <Input placeholder="Search transactions..." className="pl-10" />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button className="flex items-center">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                          {transaction.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.type === 'credit' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.amount} credits
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="px-6 py-4 bg-white border-t flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of <span className="font-medium">12,432</span> transactions
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

// Missing imports - add at the top
import { Recycle } from "lucide-react";
