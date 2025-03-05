
import React, { useEffect, useState } from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street_address: string;
  apartment_number: string;
  city: string;
  state: string;
  pin_code: string;
  eco_credits: number;
  level: string;
}

interface NotificationSettings {
  newsletter: boolean;
  recycling_reminders: boolean;
  order_updates: boolean;
  account_updates: boolean;
  special_offers: boolean;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    newsletter: false,
    recycling_reminders: true,
    order_updates: true,
    account_updates: true,
    special_offers: false
  });

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      
      setProfile(data);
      
      // Fetch notification settings
      const { data: notificationData, error: notificationError } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (!notificationError && notificationData) {
        setNotificationSettings({
          newsletter: notificationData.newsletter || false,
          recycling_reminders: notificationData.recycling_reminders || true,
          order_updates: notificationData.order_updates || true,
          account_updates: notificationData.account_updates || true,
          special_offers: notificationData.special_offers || false,
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (formData: Partial<ProfileData>) => {
    if (!user) return;
    
    try {
      setUpdating(true);
      
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
      
      // Refresh profile data
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const updateNotificationSettings = async (settingName: keyof NotificationSettings, value: boolean) => {
    if (!user) return;
    
    try {
      const newSettings = { ...notificationSettings, [settingName]: value };
      setNotificationSettings(newSettings);
      
      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: user.id,
          [settingName]: value,
        });
        
      if (error) throw error;
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast({
        title: "Error",
        description: "Failed to update notification settings.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

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
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
            <p className="text-gray-500">Manage your account details and preferences</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Summary Card */}
            <Card className="md:col-span-1">
              <CardHeader className="text-center">
                <Avatar className="w-24 h-24 mx-auto">
                  <AvatarImage src="" alt={profile?.first_name} />
                  <AvatarFallback className="text-2xl">
                    {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4">{profile?.first_name} {profile?.last_name}</CardTitle>
                <CardDescription>{profile?.email}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="bg-primary/10 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-gray-500">EcoCredits Balance</p>
                  <p className="text-3xl font-bold text-primary">{profile?.eco_credits || 0}</p>
                </div>
                <div className="bg-primary/10 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-500">Account Level</p>
                  <p className="text-xl font-semibold">{profile?.level || 'Bronze'}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">View Recycling History</Button>
              </CardFooter>
            </Card>
            
            {/* Main Content */}
            <div className="md:col-span-2">
              <Tabs defaultValue="personal">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="personal" className="flex-1">Personal Info</TabsTrigger>
                  <TabsTrigger value="address" className="flex-1">Address</TabsTrigger>
                  <TabsTrigger value="notifications" className="flex-1">Notifications</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input 
                            id="firstName" 
                            defaultValue={profile?.first_name || ''} 
                            onChange={(e) => setProfile(prev => ({ ...prev!, first_name: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input 
                            id="lastName" 
                            defaultValue={profile?.last_name || ''} 
                            onChange={(e) => setProfile(prev => ({ ...prev!, last_name: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          defaultValue={profile?.email || ''} 
                          disabled 
                        />
                        <p className="text-xs text-gray-500">Your email can't be changed as it's used for login</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          type="tel" 
                          defaultValue={profile?.phone || ''} 
                          onChange={(e) => setProfile(prev => ({ ...prev!, phone: e.target.value }))}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="ml-auto" 
                        disabled={updating}
                        onClick={() => updateProfile({
                          first_name: profile?.first_name,
                          last_name: profile?.last_name,
                          phone: profile?.phone,
                        })}
                      >
                        {updating ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="address">
                  <Card>
                    <CardHeader>
                      <CardTitle>Address Information</CardTitle>
                      <CardDescription>Update your shipping and pickup address details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="street">Street Address</Label>
                        <Input 
                          id="street" 
                          defaultValue={profile?.street_address || ''} 
                          onChange={(e) => setProfile(prev => ({ ...prev!, street_address: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apartment">Apartment/Suite (Optional)</Label>
                        <Input 
                          id="apartment" 
                          defaultValue={profile?.apartment_number || ''} 
                          onChange={(e) => setProfile(prev => ({ ...prev!, apartment_number: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input 
                            id="city" 
                            defaultValue={profile?.city || ''} 
                            onChange={(e) => setProfile(prev => ({ ...prev!, city: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input 
                            id="state" 
                            defaultValue={profile?.state || ''} 
                            onChange={(e) => setProfile(prev => ({ ...prev!, state: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode">Postal/ZIP Code</Label>
                        <Input 
                          id="pincode" 
                          defaultValue={profile?.pin_code || ''} 
                          onChange={(e) => setProfile(prev => ({ ...prev!, pin_code: e.target.value }))}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="ml-auto" 
                        disabled={updating}
                        onClick={() => updateProfile({
                          street_address: profile?.street_address,
                          apartment_number: profile?.apartment_number,
                          city: profile?.city,
                          state: profile?.state,
                          pin_code: profile?.pin_code,
                        })}
                      >
                        {updating ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notifications">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Choose which notifications you'd like to receive</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Order Updates</p>
                            <p className="text-sm text-gray-500">Notifications about your marketplace orders</p>
                          </div>
                          <Switch 
                            checked={notificationSettings.order_updates} 
                            onCheckedChange={(checked) => updateNotificationSettings('order_updates', checked)}
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Recycling Reminders</p>
                            <p className="text-sm text-gray-500">Reminders about scheduled pickups</p>
                          </div>
                          <Switch 
                            checked={notificationSettings.recycling_reminders} 
                            onCheckedChange={(checked) => updateNotificationSettings('recycling_reminders', checked)}
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Account Updates</p>
                            <p className="text-sm text-gray-500">Important information about your account</p>
                          </div>
                          <Switch 
                            checked={notificationSettings.account_updates} 
                            onCheckedChange={(checked) => updateNotificationSettings('account_updates', checked)}
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Special Offers</p>
                            <p className="text-sm text-gray-500">Promotional emails and special deals</p>
                          </div>
                          <Switch 
                            checked={notificationSettings.special_offers} 
                            onCheckedChange={(checked) => updateNotificationSettings('special_offers', checked)}
                          />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Newsletter</p>
                            <p className="text-sm text-gray-500">Monthly newsletter with recycling tips</p>
                          </div>
                          <Switch 
                            checked={notificationSettings.newsletter} 
                            onCheckedChange={(checked) => updateNotificationSettings('newsletter', checked)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
