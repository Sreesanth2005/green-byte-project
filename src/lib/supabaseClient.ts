import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqzzkycxafylvjghppst.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxenpreWN4YWZ5bHZqZ2hwcHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MzExODQsImV4cCI6MjA1NjMwNzE4NH0.4SyCIDGl57xtW418fTXvipgq2UrOL6WgC5vGUX1hASs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema and table creation function
export const initializeDatabase = async () => {
  try {
    // Check if profiles table exists and create it if it doesn't
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (profilesError || !profilesData || profilesData.length === 0) {
      console.log("Creating profiles table...");
      const { error } = await supabase.rpc('create_profiles_table_if_not_exists');
      if (error) console.error("Error creating profiles table:", error);
    }
    
    // Check if schedule_pickups table exists and create it if it doesn't
    const { data: pickupsData, error: pickupsError } = await supabase
      .from('schedule_pickups')
      .select('id')
      .limit(1);
      
    if (pickupsError || !pickupsData || pickupsData.length === 0) {
      console.log("Creating schedule_pickups table...");
      const { error } = await supabase.rpc('create_schedule_pickups_table_if_not_exists');
      if (error) console.error("Error creating schedule_pickups table:", error);
    }
    
    // Check if marketplace_items table exists and create it if it doesn't
    const { data: marketplaceData, error: marketplaceError } = await supabase
      .from('marketplace_items')
      .select('id')
      .limit(1);
      
    if (marketplaceError || !marketplaceData || marketplaceData.length === 0) {
      console.log("Creating marketplace_items table...");
      const { error } = await supabase.rpc('create_marketplace_items_table_if_not_exists');
      if (error) console.error("Error creating marketplace_items table:", error);
    }
    
    // Seed the marketplace with initial products if it's empty
    if (!marketplaceData || marketplaceData.length === 0) {
      await seedMarketplace();
    }
    
    console.log("Database tables checked/initialized");
    
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

// Seed the marketplace with initial products
const seedMarketplace = async () => {
  const products = [
    {
      name: "Refurbished iPhone 12",
      description: "This refurbished iPhone 12 has been fully tested and restored to factory settings. It comes with a 1-year warranty and all original accessories.",
      price: 499,
      eco_credits: 4990,
      category: "phones",
      condition: "Excellent - Like new with minimal signs of use",
      specs: ["128GB Storage", "6.1-inch Super Retina XDR display", "A14 Bionic chip", "Dual 12MP camera system", "Face ID"],
      image_url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
      rating: 4.5,
      reviews: 128
    },
    {
      name: "Dell XPS 13 Laptop",
      description: "The Dell XPS 13 is a premium ultrabook with InfinityEdge display and powerful performance in a compact design. This refurbished model has been thoroughly tested and comes with our quality guarantee.",
      price: 899,
      eco_credits: 8990,
      category: "laptops",
      condition: "Very Good - Minor cosmetic imperfections that don't affect performance",
      specs: ["Intel Core i7 processor", "16GB RAM", "512GB SSD", "13.4-inch FHD+ display", "Windows 11 Pro"],
      image_url: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 256
    },
    {
      name: "iPad Air (2020)",
      description: "The iPad Air features a stunning Liquid Retina display and Apple's powerful A14 Bionic chip. This refurbished model has been thoroughly tested and is in excellent condition.",
      price: 449,
      eco_credits: 4490,
      category: "tablets",
      condition: "Excellent - Like new with minimal signs of use",
      specs: ["64GB Storage", "10.9-inch Liquid Retina display", "A14 Bionic chip", "12MP rear camera, 7MP front camera", "Touch ID"],
      image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
      rating: 4.7,
      reviews: 189
    },
    {
      name: "Sony WH-1000XM4 Headphones",
      description: "Industry-leading noise cancellation with premium sound quality. These refurbished Sony WH-1000XM4 headphones have been thoroughly tested and come with a 6-month warranty.",
      price: 249,
      eco_credits: 2490,
      category: "audio",
      condition: "Very Good - Minor cosmetic imperfections that don't affect performance",
      specs: ["Industry-leading noise cancellation", "30-hour battery life", "Touch controls", "Speak-to-chat technology", "Bluetooth 5.0"],
      image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
      rating: 4.9,
      reviews: 320
    },
    {
      name: "Samsung Galaxy Watch",
      description: "Track your fitness goals and stay connected with this refurbished Samsung Galaxy Watch. It has been thoroughly tested and is in excellent working condition.",
      price: 179,
      eco_credits: 1790,
      category: "accessories",
      condition: "Good - Visible signs of use but fully functional",
      specs: ["1.4-inch Super AMOLED display", "5 ATM water resistance", "Heart rate monitoring", "GPS", "NFC for Samsung Pay"],
      image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
      rating: 4.6,
      reviews: 142
    },
    {
      name: "Google Pixel 6",
      description: "Experience Google's best camera yet with the Pixel 6. This refurbished phone has been thoroughly tested and comes with a 1-year warranty.",
      price: 549,
      eco_credits: 5490,
      category: "phones",
      condition: "Excellent - Like new with minimal signs of use",
      specs: ["128GB Storage", "6.4-inch OLED display", "Google Tensor chip", "50MP wide + 12MP ultrawide cameras", "Android 12"],
      image_url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop",
      rating: 4.4,
      reviews: 98
    },
    {
      name: "MacBook Pro M1",
      description: "The MacBook Pro with M1 chip delivers breakthrough performance. This refurbished model has been thoroughly tested and comes with our quality guarantee.",
      price: 1199,
      eco_credits: 11990,
      category: "laptops",
      condition: "Very Good - Minor cosmetic imperfections that don't affect performance",
      specs: ["Apple M1 chip with 8‑core CPU", "8GB unified memory", "256GB SSD storage", "13-inch Retina display", "macOS"],
      image_url: "https://images.unsplash.com/photo-1537498425277-c283d32ef9db?w=400&h=300&fit=crop",
      rating: 4.8,
      reviews: 276
    },
    {
      name: "Wireless Earbuds",
      description: "These refurbished wireless earbuds offer premium sound quality and comfortable fit. They have been thoroughly tested and come with a 3-month warranty.",
      price: 79,
      eco_credits: 790,
      category: "audio",
      condition: "Good - Visible signs of use but fully functional",
      specs: ["True wireless design", "5-hour battery life (20 hours with case)", "Water resistant", "Touch controls", "Built-in microphone for calls"],
      image_url: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f37?w=400&h=300&fit=crop",
      rating: 4.3,
      reviews: 105
    }
  ];

  // Insert products
  const { error } = await supabase.from('marketplace_items').insert(products);
  
  if (error) {
    console.error("Error seeding marketplace:", error);
  } else {
    console.log("Marketplace seeded successfully");
  }
};
