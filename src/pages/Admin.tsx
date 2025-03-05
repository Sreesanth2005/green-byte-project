
import React, { useState, useEffect } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Admin = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [pickups, setPickups] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPickups: 0,
    pendingPickups: 0,
    totalEcoCredits: 0,
    recycledByCategory: [] as {name: string, value: number}[]
  });

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      
      try {
        // In a real app, this would check a user role field or a separate admins table
        // For this demo, we'll just pretend the current user is an admin
        setIsAdmin(true);
        fetchData();
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    };
    
    checkAdmin();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch pickup requests
      const { data: pickupData, error: pickupError } = await supabase
        .from('schedule_pickups')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (pickupError) throw pickupError;
      
      setPickups(pickupData || []);
      
      // Fetch users
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*');
        
      if (userError) throw userError;
      
      setUsers(userData || []);
      
      // Calculate statistics
      const pendingPickups = pickupData ? pickupData.filter(pickup => pickup.status === 'pending').length : 0;
      const totalEcoCredits = userData ? userData.reduce((sum, user) => sum + (user.eco_credits || 0), 0) : 0;
      
      // Calculate recycled items by category
      const categories: Record<string, number> = {};
      if (pickupData) {
        pickupData.forEach(pickup => {
          const category = pickup.category;
          if (categories[category]) {
            categories[category]++;
          } else {
            categories[category] = 1;
          }
        });
      }
      
      const recycledByCategory = Object.entries(categories).map(([name, value]) => ({ name, value }));
      
      setStats({
        totalUsers: userData ? userData.length : 0,
        totalPickups: pickupData ? pickupData.length : 0,
        pendingPickups,
        totalEcoCredits,
        recycledByCategory
      });
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast({
        title: "Error",
        description: "Failed to load admin data. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const updatePickupStatus = async (pickupId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('schedule_pickups')
        .update({ status: newStatus })
        .eq('id', pickupId);
        
      if (error) throw error;
      
      // Update local state
      setPickups(prev => prev.map(pickup => 
        pickup.id === pickupId ? { ...pickup, status: newStatus } : pickup
      ));
      
      toast({
        title: "Status Updated",
        description: `Pickup status changed to ${newStatus}.`,
      });
    } catch (error) {
      console.error("Error updating pickup status:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update pickup status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center flex-col">
          <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <Button as="a" href="/marketplace">Return to Marketplace</Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-primary">{stats.totalUsers}</h2>
                <p className="text-gray-500 mt-2">Total Users</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-primary">{stats.totalPickups}</h2>
                <p className="text-gray-500 mt-2">Total Pickups</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-primary">{stats.pendingPickups}</h2>
                <p className="text-gray-500 mt-2">Pending Pickups</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-primary">{stats.totalEcoCredits}</h2>
                <p className="text-gray-500 mt-2">Total EcoCredits</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Recycling by Category</CardTitle>
              <CardDescription>Distribution of recycled items by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.recycledByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {stats.recycledByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Pickups</CardTitle>
              <CardDescription>Number of pickups in the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { month: 'Jan', pickups: 12 },
                      { month: 'Feb', pickups: 19 },
                      { month: 'Mar', pickups: 15 },
                      { month: 'Apr', pickups: 27 },
                      { month: 'May', pickups: 32 },
                      { month: 'Jun', pickups: 38 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="pickups" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="pickups" className="w-full">
          <TabsList className="mb-6 w-full max-w-md mx-auto">
            <TabsTrigger value="pickups" className="flex-1">Pickup Requests</TabsTrigger>
            <TabsTrigger value="users" className="flex-1">Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pickups">
            <Card>
              <CardHeader>
                <CardTitle>Manage Pickup Requests</CardTitle>
                <CardDescription>View and update status of recycling pickup requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border mb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pickups.length > 0 ? (
                        pickups.map((pickup) => (
                          <TableRow key={pickup.id}>
                            <TableCell>{new Date(pickup.pickup_date).toLocaleDateString()}</TableCell>
                            <TableCell>{pickup.first_name} {pickup.last_name}</TableCell>
                            <TableCell>{pickup.category}</TableCell>
                            <TableCell>{pickup.address}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                pickup.status === 'completed' ? 'bg-green-100 text-green-800' :
                                pickup.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                pickup.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {pickup.status.charAt(0).toUpperCase() + pickup.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline" onClick={() => updatePickupStatus(pickup.id, 'completed')}>
                                  Complete
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-500" onClick={() => updatePickupStatus(pickup.id, 'cancelled')}>
                                  Cancel
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">No pickup requests found</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>View and manage user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border mb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>EcoCredits</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.length > 0 ? (
                        users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.first_name} {user.last_name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.eco_credits || 0}</TableCell>
                            <TableCell>{user.level || 'Bronze'}</TableCell>
                            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button size="sm" variant="outline">View Details</Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">No users found</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
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

export default Admin;
