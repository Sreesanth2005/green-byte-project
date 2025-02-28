
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { PickupRequest, Product, Transaction, User, getPickupRequests, getProducts, getTransactions, getUsers, supabase } from "@/lib/supabase";
import { Download, Edit, Filter, MoreHorizontal, Plus, RefreshCcw, Search, Settings, Trash2, Users } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // In a real app, you would check if the current user has admin privileges
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            title: "Authentication required",
            description: "Please login to access the admin panel",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        // Just for demo - in real app, you'd check admin role in database
        setIsAdmin(true);
        
        // Fetch data
        await fetchAllData();
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [fetchedUsers, fetchedProducts, fetchedPickups, fetchedTransactions] = await Promise.all([
        getUsers(),
        getProducts(),
        getPickupRequests(),
        getTransactions()
      ]);

      setUsers(fetchedUsers);
      setProducts(fetchedProducts);
      setPickups(fetchedPickups);
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchAllData();
    toast({
      title: "Refreshed",
      description: "Data has been refreshed",
    });
  };

  // For demo purposes - these would be actual database operations in production
  const handleDeleteUser = async (userId: string) => {
    try {
      setUsers(users.filter(user => user.id !== userId));
      toast({
        title: "User Deleted",
        description: "User has been removed from the system",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async (productId: string) => {
    // In a real app, this would open a form to edit the product
    toast({
      title: "Edit Product",
      description: `Editing product ${productId}`,
    });
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      setProducts(products.filter(product => product.id !== productId));
      toast({
        title: "Product Deleted",
        description: "Product has been removed from the system",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePickupStatus = async (pickupId: string, status: 'pending' | 'scheduled' | 'completed' | 'cancelled') => {
    try {
      setPickups(pickups.map(pickup => 
        pickup.id === pickupId ? { ...pickup, status } : pickup
      ));
      toast({
        title: "Status Updated",
        description: `Pickup status changed to ${status}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update pickup status",
        variant: "destructive",
      });
    }
  };

  // Chart data
  const userGrowthData = [
    { name: 'Jan', users: 120 },
    { name: 'Feb', users: 145 },
    { name: 'Mar', users: 162 },
    { name: 'Apr', users: 190 },
    { name: 'May', users: 210 },
    { name: 'Jun', users: 252 },
  ];

  const eWasteCollectionData = [
    { name: 'Jan', amount: 1200 },
    { name: 'Feb', amount: 1350 },
    { name: 'Mar', amount: 1450 },
    { name: 'Apr', amount: 1700 },
    { name: 'May', amount: 1850 },
    { name: 'Jun', amount: 2100 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-6">You don't have permission to access the admin panel.</p>
          <Button onClick={() => navigate("/")}>Return to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="flex bg-white border-b shadow-sm px-6 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Green Byte Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={refreshData}>
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="default" size="sm" onClick={() => navigate("/")}>
              Exit Admin
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="pickups">Pickup Requests</TabsTrigger>
            <TabsTrigger value="payments">Payments & Transactions</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Users</CardTitle>
                  <CardDescription>Active platform users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{users.length}</div>
                  <p className="text-sm text-muted-foreground mt-2">+12% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>E-Waste Collected</CardTitle>
                  <CardDescription>Total collected in kg</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">24,850</div>
                  <p className="text-sm text-muted-foreground mt-2">+8% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Revenue</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">₹128,350</div>
                  <p className="text-sm text-muted-foreground mt-2">+15% from last month</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>New users over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="users" fill="#4CAF50" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>E-Waste Collection</CardTitle>
                  <CardDescription>Monthly collection in kg</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={eWasteCollectionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#8BC34A" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Pickups</CardTitle>
                  <CardDescription>Last 5 pickup requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pickups.slice(0, 5).map((pickup) => (
                      <div key={pickup.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{pickup.address.substring(0, 20)}...</p>
                          <p className="text-sm text-gray-500">{new Date(pickup.created_at).toLocaleDateString()}</p>
                        </div>
                        <Badge
                          className={
                            pickup.status === 'completed' ? 'bg-green-100 text-green-800' :
                            pickup.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            pickup.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {pickup.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Most viewed marketplace items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.eco_credits_price} credits</p>
                        </div>
                        <Badge variant="outline">Stock: {product.stock}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Last 5 transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{transaction.description.substring(0, 20)}...</p>
                          <p className="text-sm text-gray-500">{new Date(transaction.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className={`font-medium ${
                          transaction.type === 'earned' || transaction.type === 'converted_to_credits' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {transaction.type === 'earned' || transaction.type === 'converted_to_credits' 
                            ? '+' 
                            : '-'}{transaction.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage platform users and their permissions</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search users..."
                      className="pl-8"
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-2 p-4 bg-gray-50 font-medium border-b">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-3">User</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-2">Credits</div>
                    <div className="col-span-2">Joined</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                  
                  <div className="divide-y">
                    {users.map((user) => (
                      <div key={user.id} className="grid grid-cols-12 gap-2 p-4 items-center">
                        <div className="col-span-1 text-gray-500">{user.id.substring(0, 6)}...</div>
                        <div className="col-span-3 flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.full_name}`} />
                            <AvatarFallback>{user.full_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.full_name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </div>
                        <div className="col-span-2">{user.eco_credits}</div>
                        <div className="col-span-2">{new Date(user.created_at).toLocaleDateString()}</div>
                        <div className="col-span-2 flex justify-end space-x-1">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-500">Showing {users.length} users</p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>Manage marketplace products</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search products..."
                    className="pl-8"
                  />
                </div>

                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-2 p-4 bg-gray-50 font-medium border-b">
                    <div className="col-span-4">Product</div>
                    <div className="col-span-2">Category</div>
                    <div className="col-span-1">Stock</div>
                    <div className="col-span-2">Price</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                  
                  <div className="divide-y">
                    {products.map((product) => (
                      <div key={product.id} className="grid grid-cols-12 gap-2 p-4 items-center">
                        <div className="col-span-4 flex items-center space-x-3">
                          <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                            <img 
                              src={product.images[0] || "/placeholder.svg"} 
                              alt={product.name}
                              className="h-8 w-8 object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.condition}</p>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <Badge variant="outline">{product.category}</Badge>
                        </div>
                        <div className="col-span-1">{product.stock}</div>
                        <div className="col-span-2">
                          <div>₹{product.price}</div>
                          <div className="text-sm text-gray-500">{product.eco_credits_price} credits</div>
                        </div>
                        <div className="col-span-1">
                          <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                          </Badge>
                        </div>
                        <div className="col-span-2 flex justify-end space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleUpdateProduct(product.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-500">Showing {products.length} products</p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pickups Tab */}
          <TabsContent value="pickups">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Pickup Requests</CardTitle>
                    <CardDescription>Manage e-waste pickup requests</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-2 p-4 bg-gray-50 font-medium border-b">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-3">Address</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2">Items</div>
                    <div className="col-span-1">Credits</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                  
                  <div className="divide-y">
                    {pickups.map((pickup) => (
                      <div key={pickup.id} className="grid grid-cols-12 gap-2 p-4 items-center">
                        <div className="col-span-1 text-gray-500">{pickup.id.substring(0, 6)}...</div>
                        <div className="col-span-3">
                          <p className="font-medium">{pickup.address.substring(0, 30)}...</p>
                          <p className="text-sm text-gray-500">User: {pickup.user_id.substring(0, 6)}...</p>
                        </div>
                        <div className="col-span-2">
                          <p>{new Date(pickup.pickup_date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-500">{new Date(pickup.pickup_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div className="col-span-2">
                          <p>{pickup.items.length} items</p>
                          <p className="text-sm text-gray-500">{pickup.items[0]?.type}</p>
                        </div>
                        <div className="col-span-1">{pickup.estimated_credits}</div>
                        <div className="col-span-1">
                          <Badge
                            className={
                              pickup.status === 'completed' ? 'bg-green-100 text-green-800' :
                              pickup.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                              pickup.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {pickup.status}
                          </Badge>
                        </div>
                        <div className="col-span-2">
                          <div className="flex justify-end space-x-1">
                            <Select 
                              defaultValue={pickup.status}
                              onValueChange={(value) => handleUpdatePickupStatus(
                                pickup.id, 
                                value as 'pending' | 'scheduled' | 'completed' | 'cancelled'
                              )}
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Change status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-500">Showing {pickups.length} pickup requests</p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Payment Transactions</CardTitle>
                    <CardDescription>Monitor all payment and credit transactions</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="earned">Earned Credits</SelectItem>
                        <SelectItem value="spent">Spent Credits</SelectItem>
                        <SelectItem value="converted_to_credits">Money to Credits</SelectItem>
                        <SelectItem value="converted_to_money">Credits to Money</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md">
                  <div className="grid grid-cols-12 gap-2 p-4 bg-gray-50 font-medium border-b">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-2">User</div>
                    <div className="col-span-3">Description</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-1">Amount</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-1">Payment ID</div>
                  </div>
                  
                  <div className="divide-y">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="grid grid-cols-12 gap-2 p-4 items-center">
                        <div className="col-span-1 text-gray-500">{transaction.id.substring(0, 6)}...</div>
                        <div className="col-span-2 text-gray-500">{transaction.user_id.substring(0, 6)}...</div>
                        <div className="col-span-3">{transaction.description}</div>
                        <div className="col-span-2">
                          <Badge
                            variant={
                              transaction.type === 'earned' || transaction.type === 'converted_to_credits'
                                ? 'default'
                                : 'secondary'
                            }
                          >
                            {transaction.type.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <div className="col-span-1">
                          <span className={
                            transaction.type === 'earned' || transaction.type === 'converted_to_credits'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }>
                            {transaction.type === 'earned' || transaction.type === 'converted_to_credits'
                              ? '+'
                              : '-'}{transaction.amount}
                          </span>
                        </div>
                        <div className="col-span-2">
                          {new Date(transaction.created_at).toLocaleString()}
                        </div>
                        <div className="col-span-1 text-gray-500">
                          {transaction.payment_id
                            ? transaction.payment_id.substring(0, 6) + '...'
                            : '-'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-500">Showing {transactions.length} transactions</p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
