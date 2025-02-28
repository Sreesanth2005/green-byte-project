
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock, MapPin, ShoppingBag, CreditCard, LogOut, Settings, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("account");
  
  const orderHistory = [
    {
      id: "ORD-12345",
      date: "2024-03-10",
      items: ["Refurbished iPhone 12"],
      total: 4990,
      status: "Delivered"
    },
    {
      id: "ORD-12344",
      date: "2024-02-25",
      items: ["Wireless Earbuds", "Samsung Galaxy Watch"],
      total: 2580,
      status: "Delivered"
    },
    {
      id: "ORD-12343",
      date: "2024-02-15",
      items: ["Dell XPS 13 Laptop"],
      total: 8990,
      status: "Processing"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Jason Smith</h3>
                  <p className="text-gray-600 text-sm">Premium Member</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("account")}
                  className={`w-full flex items-center p-3 rounded-lg text-left ${
                    activeTab === "account" 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "hover:bg-gray-100"
                  }`}
                >
                  <User className="w-5 h-5 mr-3" />
                  Account Information
                </button>
                
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center p-3 rounded-lg text-left ${
                    activeTab === "security" 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Lock className="w-5 h-5 mr-3" />
                  Security & Password
                </button>
                
                <button
                  onClick={() => setActiveTab("address")}
                  className={`w-full flex items-center p-3 rounded-lg text-left ${
                    activeTab === "address" 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "hover:bg-gray-100"
                  }`}
                >
                  <MapPin className="w-5 h-5 mr-3" />
                  Addresses
                </button>
                
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center p-3 rounded-lg text-left ${
                    activeTab === "orders" 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "hover:bg-gray-100"
                  }`}
                >
                  <ShoppingBag className="w-5 h-5 mr-3" />
                  Order History
                </button>
                
                <button
                  onClick={() => setActiveTab("ecocredits")}
                  className={`w-full flex items-center p-3 rounded-lg text-left ${
                    activeTab === "ecocredits" 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "hover:bg-gray-100"
                  }`}
                >
                  <CreditCard className="w-5 h-5 mr-3" />
                  EcoCredits
                </button>
                
                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center p-3 rounded-lg text-left ${
                    activeTab === "notifications" 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Bell className="w-5 h-5 mr-3" />
                  Notifications
                </button>
                
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center p-3 rounded-lg text-left ${
                    activeTab === "settings" 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Preferences
                </button>
                
                <button className="w-full flex items-center p-3 rounded-lg text-left text-destructive hover:bg-destructive/10">
                  <LogOut className="w-5 h-5 mr-3" />
                  Sign Out
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm">
              {activeTab === "account" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Account Information</h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <Input defaultValue="Jason" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <Input defaultValue="Smith" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <Input defaultValue="jason.smith@example.com" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input defaultValue="+91 98765 43210" />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Changes</Button>
                    </div>
                  </form>
                </div>
              )}
              
              {activeTab === "security" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Security & Password</h2>
                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <Input type="password" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <Input type="password" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <Input type="password" />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Update Password</Button>
                    </div>
                  </form>
                </div>
              )}
              
              {activeTab === "address" && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold">Addresses</h2>
                    <Button>Add New Address</Button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="border p-4 rounded-lg relative">
                      <div className="absolute top-4 right-4 bg-primary/10 text-primary px-2 py-1 text-xs font-medium rounded">
                        Default
                      </div>
                      <h3 className="font-semibold">Home</h3>
                      <p className="text-gray-600">Jason Smith</p>
                      <p className="text-gray-600">123 Green Street, Eco Valley</p>
                      <p className="text-gray-600">Mumbai, Maharashtra 400001</p>
                      <p className="text-gray-600">India</p>
                      <p className="text-gray-600">+91 98765 43210</p>
                      
                      <div className="flex space-x-4 mt-4">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">Delete</Button>
                      </div>
                    </div>
                    
                    <div className="border p-4 rounded-lg">
                      <h3 className="font-semibold">Work</h3>
                      <p className="text-gray-600">Jason Smith</p>
                      <p className="text-gray-600">456 Tech Park, Innovation Hub</p>
                      <p className="text-gray-600">Bangalore, Karnataka 560001</p>
                      <p className="text-gray-600">India</p>
                      <p className="text-gray-600">+91 98765 43210</p>
                      
                      <div className="flex space-x-4 mt-4">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">Delete</Button>
                        <Button variant="outline" size="sm">Set as Default</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "orders" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Order History</h2>
                  
                  {orderHistory.length > 0 ? (
                    <div className="space-y-6">
                      {orderHistory.map((order) => (
                        <div key={order.id} className="border p-4 rounded-lg">
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-4 mb-2">
                                <h3 className="font-semibold">{order.id}</h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded ${
                                  order.status === 'Delivered' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-gray-600 text-sm mb-2">Order Date: {order.date}</p>
                              <div className="mb-2">
                                {order.items.map((item, index) => (
                                  <p key={index} className="text-gray-600">{item}</p>
                                ))}
                              </div>
                              <p className="font-medium">Total: {order.total} Credits</p>
                            </div>
                            <div className="flex space-x-4">
                              <Button variant="outline" size="sm">View Details</Button>
                              {order.status === 'Delivered' && (
                                <Button variant="outline" size="sm">Buy Again</Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                      <p className="text-gray-600 mb-6">When you place orders, they will appear here.</p>
                      <Button asChild>
                        <Link to="/marketplace">Start Shopping</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === "ecocredits" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Your EcoCredits</h2>
                  
                  <div className="bg-primary/10 p-6 rounded-xl mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600">Current Balance</p>
                        <p className="text-3xl font-bold text-primary">1,250 Credits</p>
                      </div>
                      <Button asChild>
                        <Link to="/my-ecocredits">Manage Credits</Link>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Quick Actions</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="justify-start" asChild>
                          <Link to="/schedule-pickup">
                            <Recycle className="mr-2 h-5 w-5" />
                            Schedule a Pickup
                          </Link>
                        </Button>
                        <Button variant="outline" className="justify-start" asChild>
                          <Link to="/my-ecocredits">
                            <CreditCard className="mr-2 h-5 w-5" />
                            Convert Rupees to Credits
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-4">Recent Transactions</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Recycled Laptop</p>
                            <p className="text-sm text-gray-600">2024-03-01</p>
                          </div>
                          <p className="text-success font-semibold">+50 credits</p>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Marketplace Purchase</p>
                            <p className="text-sm text-gray-600">2024-02-28</p>
                          </div>
                          <p className="text-destructive font-semibold">-20 credits</p>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Rupees Conversion</p>
                            <p className="text-sm text-gray-600">2024-02-25</p>
                          </div>
                          <p className="text-success font-semibold">+100 credits</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/my-ecocredits">View All Transactions</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "notifications" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold">Order Updates</h3>
                        <p className="text-sm text-gray-600">Receive updates about your orders</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold">Special Offers</h3>
                        <p className="text-sm text-gray-600">Receive exclusive deals and promotions</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold">Account Updates</h3>
                        <p className="text-sm text-gray-600">Receive important account-related notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold">Recycling Reminders</h3>
                        <p className="text-sm text-gray-600">Receive reminders to recycle your e-waste</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold">Newsletter</h3>
                        <p className="text-sm text-gray-600">Receive our monthly newsletter with eco tips</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Preferences</Button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "settings" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Account Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option>English</option>
                        <option>Hindi</option>
                        <option>Tamil</option>
                        <option>Bengali</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option>Indian Rupee (₹)</option>
                        <option>US Dollar ($)</option>
                        <option>Euro (€)</option>
                        <option>British Pound (£)</option>
                      </select>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Theme</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <button className="border-2 border-primary rounded-lg p-4 flex items-center justify-center flex-col">
                          <div className="w-full h-6 bg-primary mb-2 rounded"></div>
                          <span className="text-sm">Light</span>
                        </button>
                        <button className="border-2 border-gray-200 rounded-lg p-4 flex items-center justify-center flex-col">
                          <div className="w-full h-6 bg-gray-800 mb-2 rounded"></div>
                          <span className="text-sm">Dark</span>
                        </button>
                        <button className="border-2 border-gray-200 rounded-lg p-4 flex items-center justify-center flex-col">
                          <div className="w-full h-6 bg-gradient-to-r from-primary to-gray-800 mb-2 rounded"></div>
                          <span className="text-sm">System</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Preferences</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
