
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Recycle, Upload, Plus, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

// E-waste categories
const EWASTE_CATEGORIES = [
  "Smartphones",
  "Laptops",
  "Tablets",
  "Desktop Computers",
  "Monitors",
  "Printers",
  "Scanners",
  "Keyboards",
  "Mice",
  "Speakers",
  "Headphones",
  "Cameras",
  "Televisions",
  "DVD/Blu-ray Players",
  "Gaming Consoles",
  "Refrigerators",
  "Washing Machines",
  "Microwave Ovens",
  "Air Conditioners",
  "Vacuum Cleaners",
  "Batteries",
  "Cables & Chargers",
  "Circuit Boards",
  "Hard Drives",
  "Other Electronics"
];

const SchedulePickup = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [filteredCategories, setFilteredCategories] = useState(EWASTE_CATEGORIES);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    streetAddress: "",
    apartmentNumber: "",
    city: "",
    state: "",
    pinCode: "",
    pickupDate: "",
    pickupTime: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get the current user when the component mounts
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      // Prefill user data if available
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (data && !error) {
          setFormData(prev => ({
            ...prev,
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            email: user.email || '',
            phone: data.phone || '',
            streetAddress: data.street_address || '',
            apartmentNumber: data.apartment_number || '',
            city: data.city || '',
            state: data.state || '',
            pinCode: data.pin_code || '',
          }));
        }
      }
    };

    getUser();
  }, []);

  // Filter categories based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = EWASTE_CATEGORIES.filter(category => 
        category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(EWASTE_CATEGORIES);
    }
  }, [searchTerm]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      // Check file size (10MB limit)
      const oversizedFiles = newFiles.filter(file => file.size > 10 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        toast({
          title: "File too large",
          description: "Some images exceed the 10MB limit and were not added.",
          variant: "destructive",
        });
      }
      
      const validFiles = newFiles.filter(file => file.size <= 10 * 1024 * 1024);
      setImages(prev => [...prev, ...validFiles]);
      
      // Create URLs for preview
      const urls = validFiles.map(file => URL.createObjectURL(file));
      setImageUrls(prev => [...prev, ...urls]);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imageUrls[index]);
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Toggle category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to schedule a pickup.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (selectedCategories.length === 0) {
      toast({
        title: "Item selection required",
        description: "Please select at least one e-waste category.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.pickupDate || !formData.pickupTime) {
      toast({
        title: "Date and time required",
        description: "Please select both a pickup date and time.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // Upload images to Supabase storage
      const imageUploadPromises = images.map(async (file) => {
        const fileName = `${user.id}/${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('pickup_images')
          .upload(fileName, file);
          
        if (error) throw error;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('pickup_images')
          .getPublicUrl(fileName);
          
        return publicUrl;
      });
      
      // Wait for all images to upload
      const uploadedImageUrls = await Promise.all(imageUploadPromises);
      
      // Create the full address string
      const fullAddress = `${formData.streetAddress}, ${formData.apartmentNumber ? formData.apartmentNumber + ', ' : ''}${formData.city}, ${formData.state}, ${formData.pinCode}`;
      
      // Insert pickup request
      const { data, error } = await supabase
        .from('schedule_pickups')
        .insert([
          {
            user_id: user.id,
            category: selectedCategories.join(', '),
            pickup_date: formData.pickupDate,
            pickup_time: formData.pickupTime,
            address: fullAddress,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            image_urls: uploadedImageUrls,
            status: 'pending'
          }
        ]);
        
      if (error) throw error;
      
      // Clear form data
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        streetAddress: "",
        apartmentNumber: "",
        city: "",
        state: "",
        pinCode: "",
        pickupDate: "",
        pickupTime: "",
      });
      setSelectedCategories([]);
      setImages([]);
      setImageUrls([]);
      
      toast({
        title: "Pickup scheduled successfully!",
        description: "We'll contact you to confirm the details.",
      });
      
      // Navigate to a success page or back to home
      navigate("/");
      
    } catch (error: any) {
      console.error("Error scheduling pickup:", error);
      toast({
        title: "Failed to schedule pickup",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2FCE2]">
      <Navigation />
      <div className="max-w-3xl mx-auto pt-24 px-6 pb-16">
        <h1 className="text-4xl font-bold mb-4">Schedule Your E-Waste Pickup</h1>
        <p className="mb-12 text-gray-600">Fill in the details below to schedule a pickup for your electronic waste</p>
        
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-2">1</span>
              Item Selection
            </h2>
            <div className="relative mb-4">
              <Input 
                placeholder="Search Items"
                className="pl-10 bg-[#F2FCE2] border-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {filteredCategories.slice(0, 9).map((category) => (
                <Button
                  key={category}
                  variant={selectedCategories.includes(category) ? "default" : "outline"}
                  className="justify-start text-left h-auto py-2 px-3"
                  onClick={() => toggleCategory(category)}
                >
                  <Recycle className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{category}</span>
                </Button>
              ))}
              {filteredCategories.length > 9 && (
                <Select onValueChange={(value) => toggleCategory(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="More items..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {filteredCategories.slice(9).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>
            {selectedCategories.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Selected items:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map(category => (
                    <div 
                      key={category} 
                      className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center"
                    >
                      {category}
                      <button 
                        onClick={() => toggleCategory(category)}
                        className="ml-2 text-primary hover:text-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-2">2</span>
              Pickup Address
            </h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input
                  id="streetAddress"
                  placeholder="Street Address"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="apartmentNumber">Apartment Number (Optional)</Label>
                <Input
                  id="apartmentNumber"
                  placeholder="Apartment Number"
                  name="apartmentNumber"
                  value={formData.apartmentNumber}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="pinCode">PIN Code</Label>
                <Input
                  id="pinCode"
                  placeholder="PIN Code"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </form>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-2">3</span>
              Date & Time Slots
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickupDate">Pickup Date</Label>
                <Input
                  id="pickupDate"
                  type="date"
                  placeholder="Pickup Date"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <Label htmlFor="pickupTime">Pickup Time</Label>
                <Input
                  id="pickupTime"
                  type="time"
                  placeholder="Pickup Time"
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm mr-2">4</span>
              Item Image Upload
            </h2>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
              <div className="text-center mb-4">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-sm text-gray-500 mb-2">Images less than 10 MB</p>
                <p className="text-xs text-gray-400 mb-4">Supported formats: JPG, PNG, WEBP</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Images
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </div>
              
              {imageUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {imageUrls.map((url, index) => (
                    <Card key={url} className="overflow-hidden group relative">
                      <CardContent className="p-0">
                        <img 
                          src={url} 
                          alt={`Preview ${index}`} 
                          className="w-full h-24 object-cover"
                        />
                        <button
                          className="absolute top-1 right-1 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            onClick={handleSubmit}
            disabled={isUploading}
          >
            {isUploading ? "Submitting..." : "Submit your Schedule"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SchedulePickup;
