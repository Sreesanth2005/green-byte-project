
// Sample database arrays for the application

// User data store
export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // In a real app, this would be hashed
  ecoCredits: number;
  createdAt: Date;
}

let users: MockUser[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "password123",
    ecoCredits: 2500,
    createdAt: new Date('2023-11-10')
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    password: "password123",
    ecoCredits: 3800,
    createdAt: new Date('2023-12-05')
  },
  {
    id: "3",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    password: "password123",
    ecoCredits: 1250,
    createdAt: new Date('2024-01-15')
  }
];

// Products for marketplace
export interface MockProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  condition: string;
  price: number;
  ecoCredits: number;
  image: string;
  stock: number;
  rating?: number;
  reviews?: number;
}

let products: MockProduct[] = [
  {
    id: "1",
    name: "Refurbished MacBook Pro 13-inch",
    description: "This refurbished MacBook Pro features the Apple M1 chip with 8-core CPU, 8GB unified memory, and 256GB SSD storage.",
    category: "Laptops",
    condition: "Excellent",
    price: 999.99,
    ecoCredits: 9999,
    image: "https://images.unsplash.com/photo-1537498425277-c283d32ef9db?w=500&h=350&fit=crop",
    stock: 5,
    rating: 4.8,
    reviews: 245
  },
  {
    id: "2",
    name: "Refurbished iPhone 13",
    description: "Apple iPhone 13 with 128GB storage, A15 Bionic chip, and dual 12MP camera system. Fully tested and in excellent condition.",
    category: "Phones",
    condition: "Very Good",
    price: 649.99,
    ecoCredits: 6499,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=350&fit=crop",
    stock: 8,
    rating: 4.7,
    reviews: 189
  },
  {
    id: "3",
    name: "iPad Air (2022)",
    description: "Refurbished iPad Air with 10.9-inch Liquid Retina display, Apple M1 chip, and 64GB storage. Perfect for work and entertainment.",
    category: "Tablets",
    condition: "Like New",
    price: 499.99,
    ecoCredits: 4999,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=350&fit=crop",
    stock: 12,
    rating: 4.9,
    reviews: 97
  },
  {
    id: "4",
    name: "Sony WH-1000XM4 Headphones",
    description: "Industry-leading noise cancellation headphones with exceptional sound quality, 30-hour battery life, and multipoint connection.",
    category: "Audio",
    condition: "Excellent",
    price: 249.99,
    ecoCredits: 2499,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=350&fit=crop",
    stock: 15,
    rating: 4.8,
    reviews: 312
  },
  {
    id: "5",
    name: "Samsung Galaxy Watch 5",
    description: "Refurbished smartwatch with health tracking features, sleep analysis, and up to 50 hours of battery life. Water-resistant design.",
    category: "Wearables",
    condition: "Very Good",
    price: 179.99,
    ecoCredits: 1799,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=350&fit=crop",
    stock: 7,
    rating: 4.6,
    reviews: 143
  },
  {
    id: "6",
    name: "JBL Flip 6 Bluetooth Speaker",
    description: "Portable waterproof speaker with bold sound, 12-hour battery life, and durable design. Connect multiple speakers for stereo sound.",
    category: "Audio",
    condition: "Good",
    price: 89.99,
    ecoCredits: 899,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=350&fit=crop",
    stock: 10,
    rating: 4.5,
    reviews: 218
  },
  {
    id: "7",
    name: "Dell XPS 15 Laptop",
    description: "Refurbished Dell XPS 15 with 11th Gen Intel Core i7, 16GB RAM, 512GB SSD, and NVIDIA GeForce RTX 3050Ti. Ideal for creative professionals.",
    category: "Laptops",
    condition: "Very Good",
    price: 1299.99,
    ecoCredits: 12999,
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500&h=350&fit=crop",
    stock: 3,
    rating: 4.7,
    reviews: 156
  },
  {
    id: "8",
    name: "Google Pixel 6",
    description: "Refurbished Google Pixel 6 with 128GB storage, powerful camera system, and Google Tensor chip for fast performance.",
    category: "Phones",
    condition: "Good",
    price: 399.99,
    ecoCredits: 3999,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=350&fit=crop",
    stock: 6,
    rating: 4.5,
    reviews: 178
  },
  {
    id: "9",
    name: "Nintendo Switch OLED",
    description: "Refurbished Nintendo Switch with vibrant 7-inch OLED screen, enhanced audio, and 64GB internal storage. Includes dock and Joy-Con controllers.",
    category: "Gaming",
    condition: "Excellent",
    price: 289.99,
    ecoCredits: 2899,
    image: "https://images.unsplash.com/photo-1578303696539-9e6c6d493e8b?w=500&h=350&fit=crop",
    stock: 4,
    rating: 4.8,
    reviews: 204
  },
  {
    id: "10",
    name: "Samsung 32-inch 4K Monitor",
    description: "High-resolution 4K UHD monitor with exceptional color accuracy and HDR support. Ideal for creative work and content consumption.",
    category: "Monitors",
    condition: "Very Good",
    price: 349.99,
    ecoCredits: 3499,
    image: "https://images.unsplash.com/photo-1527443060795-0f95e6745778?w=500&h=350&fit=crop",
    stock: 8,
    rating: 4.6,
    reviews: 132
  },
  {
    id: "11",
    name: "Logitech MX Master 3 Mouse",
    description: "Advanced wireless mouse with precise scrolling, customizable buttons, and ergonomic design. Compatible with Windows, macOS, and Linux.",
    category: "Accessories",
    condition: "Like New",
    price: 79.99,
    ecoCredits: 799,
    image: "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?w=500&h=350&fit=crop",
    stock: 14,
    rating: 4.9,
    reviews: 275
  },
  {
    id: "12",
    name: "GoPro HERO10 Black",
    description: "Refurbished action camera with 5.3K video recording, 23MP photos, and improved stabilization. Waterproof and durable for all adventures.",
    category: "Cameras",
    condition: "Excellent",
    price: 329.99,
    ecoCredits: 3299,
    image: "https://images.unsplash.com/photo-1563884072595-24a1d9dd5506?w=500&h=350&fit=crop",
    stock: 5,
    rating: 4.7,
    reviews: 143
  },
  {
    id: "13",
    name: "Kindle Paperwhite (2021)",
    description: "6.8-inch display with adjustable warm light, 8GB storage, and waterproof design. Perfect for reading anywhere, day or night.",
    category: "E-readers",
    condition: "Very Good",
    price: 109.99,
    ecoCredits: 1099,
    image: "https://images.unsplash.com/photo-1544159456-38ca8dc1d03c?w=500&h=350&fit=crop",
    stock: 9,
    rating: 4.8,
    reviews: 187
  },
  {
    id: "14",
    name: "Bose QuietComfort 45 Headphones",
    description: "Refurbished noise-cancelling headphones with high-fidelity audio, 24-hour battery life, and comfortable fit for all-day listening.",
    category: "Audio",
    condition: "Excellent",
    price: 229.99,
    ecoCredits: 2299,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&h=350&fit=crop",
    stock: 7,
    rating: 4.7,
    reviews: 198
  },
  {
    id: "15",
    name: "iPad Pro 11-inch (2021)",
    description: "Refurbished iPad Pro with M1 chip, Liquid Retina display, and 128GB storage. Perfect for creative work and professional applications.",
    category: "Tablets",
    condition: "Very Good",
    price: 699.99,
    ecoCredits: 6999,
    image: "https://images.unsplash.com/photo-1590051833219-8e2ae5846d21?w=500&h=350&fit=crop",
    stock: 4,
    rating: 4.9,
    reviews: 156
  },
  {
    id: "16",
    name: "Mechanical Keyboard",
    description: "RGB mechanical keyboard with tactile switches, customizable backlighting, and durable aluminum construction. Ideal for gaming and typing.",
    category: "Accessories",
    condition: "Excellent",
    price: 89.99,
    ecoCredits: 899,
    image: "https://images.unsplash.com/photo-1595044426077-d36d9236d44a?w=500&h=350&fit=crop",
    stock: 11,
    rating: 4.6,
    reviews: 224
  },
  {
    id: "17",
    name: "Dyson Air Purifier",
    description: "Refurbished air purifier with HEPA filter, air quality monitoring, and quiet operation. Removes allergens and pollutants from your space.",
    category: "Appliances",
    condition: "Very Good",
    price: 399.99,
    ecoCredits: 3999,
    image: "https://images.unsplash.com/photo-1585155967849-91c736589c84?w=500&h=350&fit=crop",
    stock: 3,
    rating: 4.7,
    reviews: 118
  },
  {
    id: "18",
    name: "Samsung Galaxy Tab S7",
    description: "11-inch tablet with Snapdragon 865+ processor, 6GB RAM, and 128GB storage. Includes S Pen for drawing and note-taking.",
    category: "Tablets",
    condition: "Good",
    price: 449.99,
    ecoCredits: 4499,
    image: "https://images.unsplash.com/photo-1589739900266-4853e720bc31?w=500&h=350&fit=crop",
    stock: 6,
    rating: 4.5,
    reviews: 131
  },
  {
    id: "19",
    name: "Sonos One Smart Speaker",
    description: "Refurbished smart speaker with rich, room-filling sound and voice control. Works with multiple streaming services and smart home systems.",
    category: "Audio",
    condition: "Excellent",
    price: 159.99,
    ecoCredits: 1599,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&h=350&fit=crop",
    stock: 8,
    rating: 4.8,
    reviews: 186
  },
  {
    id: "20",
    name: "Fitbit Sense Advanced Smartwatch",
    description: "Health and fitness smartwatch with EDA scan app, ECG app, skin temperature, and built-in GPS. Tracks activity, sleep, and stress.",
    category: "Wearables",
    condition: "Very Good",
    price: 199.99,
    ecoCredits: 1999,
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=350&fit=crop",
    stock: 9,
    rating: 4.6,
    reviews: 154
  }
];

// Events data
export interface MockEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  max_participants: number;
  current_participants: number;
  image_url: string;
}

let events: MockEvent[] = [
  {
    id: "1",
    title: "E-Waste Collection Drive",
    description: "Join us for our biggest e-waste collection event of the year. Bring your old electronics and earn extra EcoCredits! We'll have experts on hand to evaluate your items and explain the recycling process.",
    event_date: "2024-06-15",
    event_time: "10:00 AM - 4:00 PM",
    location: "Central Park, New York",
    max_participants: 100,
    current_participants: 65,
    image_url: "https://images.unsplash.com/photo-1576267423048-15c0040fec78?w=800&h=400&fit=crop"
  },
  {
    id: "2",
    title: "Sustainable Tech Workshop",
    description: "Learn how to extend the life of your devices and make sustainable tech choices. This hands-on workshop will cover basic repairs, maintenance tips, and ways to reduce your electronic waste footprint.",
    event_date: "2024-06-22",
    event_time: "1:00 PM - 3:00 PM",
    location: "Tech Hub, San Francisco",
    max_participants: 30,
    current_participants: 22,
    image_url: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=800&h=400&fit=crop"
  },
  {
    id: "3",
    title: "Community Recycling Day",
    description: "A neighborhood initiative to promote responsible disposal of electronic waste. We'll have collection stations for various types of electronics and educational sessions about the importance of e-waste recycling.",
    event_date: "2024-07-08",
    event_time: "9:00 AM - 1:00 PM",
    location: "Community Center, Chicago",
    max_participants: 75,
    current_participants: 45,
    image_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=400&fit=crop"
  },
  {
    id: "4",
    title: "Electronics Repair Cafe",
    description: "Bring your broken electronics and learn how to fix them with the help of our expert volunteers. This event aims to promote repair culture and reduce unnecessary waste.",
    event_date: "2024-07-15",
    event_time: "11:00 AM - 5:00 PM",
    location: "Maker Space, Austin",
    max_participants: 40,
    current_participants: 18,
    image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop"
  },
  {
    id: "5",
    title: "Corporate E-Waste Program Launch",
    description: "Introducing our new corporate partnership program for large-scale e-waste management. Learn how your company can benefit from sustainable disposal practices and earn EcoCredits.",
    event_date: "2024-08-05",
    event_time: "9:00 AM - 11:00 AM",
    location: "Business Center, Seattle",
    max_participants: 50,
    current_participants: 32,
    image_url: "https://images.unsplash.com/photo-1573167507387-6b4b98cb7c13?w=800&h=400&fit=crop"
  }
];

// Eco Tips for Analysis page and chatbot
export interface MockEcoTip {
  id: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
}

let ecoTips: MockEcoTip[] = [
  {
    id: "1",
    title: "Extend Device Lifespan",
    content: "Regularly clean your devices, update software, and use protective cases to extend their lifespan. This reduces the frequency of replacements and saves resources.",
    category: "Electronics",
    imageUrl: "https://images.unsplash.com/photo-1598986646512-9330bcc4c0dc?w=500&h=350&fit=crop"
  },
  {
    id: "2",
    title: "Proper Battery Disposal",
    content: "Never throw batteries in regular trash. They contain toxic chemicals that can leach into soil and water. Use designated battery recycling points for safe disposal.",
    category: "Batteries",
    imageUrl: "https://images.unsplash.com/photo-1584552539879-37e34a724a46?w=500&h=350&fit=crop"
  },
  {
    id: "3",
    title: "E-waste Separation",
    content: "Create a separate bin for electronic waste at home. When it's full, take it to an e-waste collection center rather than mixing with regular recycling.",
    category: "Home",
    imageUrl: "https://images.unsplash.com/photo-1528323273322-d81458248d40?w=500&h=350&fit=crop"
  },
  {
    id: "4",
    title: "Buy Refurbished",
    content: "Consider purchasing refurbished electronics instead of new ones. This reduces manufacturing demand and gives devices a second life.",
    category: "Shopping",
    imageUrl: "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&h=350&fit=crop"
  },
  {
    id: "5",
    title: "Data Security in Recycling",
    content: "Always perform a factory reset and remove storage devices before recycling your electronics to protect your personal data.",
    category: "Security",
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&h=350&fit=crop"
  },
  {
    id: "6",
    title: "Donate Usable Electronics",
    content: "If your electronics still work but you no longer need them, consider donating to schools, community centers, or organizations that can put them to good use.",
    category: "Community",
    imageUrl: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=500&h=350&fit=crop"
  },
  {
    id: "7",
    title: "Repair Instead of Replace",
    content: "Many common electronics issues can be fixed. Look for repair cafes or tutorials online before deciding to replace a device.",
    category: "Maintenance",
    imageUrl: "https://images.unsplash.com/photo-1597424216801-5a74ff6a7ed6?w=500&h=350&fit=crop"
  },
  {
    id: "8",
    title: "Reduce Packaging Waste",
    content: "When buying new electronics, consider the packaging waste. Choose brands that use minimal, recyclable packaging materials.",
    category: "Shopping",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&h=350&fit=crop"
  }
];

// Mock chatbot responses
export interface MockChatbotResponse {
  question: string;
  answer: string;
}

let chatbotResponses: MockChatbotResponse[] = [
  {
    question: "How do I recycle old electronics?",
    answer: "You can recycle your old electronics through Green Byte by scheduling a pickup on our website. We'll collect your items and award you EcoCredits based on their value. Alternatively, you can drop them off at one of our collection points."
  },
  {
    question: "What happens to my e-waste?",
    answer: "When we receive your e-waste, we assess it for potential refurbishment. Devices that can be restored are refurbished and sold in our marketplace. Components that can't be reused are responsibly recycled through our certified recycling partners to minimize environmental impact."
  },
  {
    question: "How do EcoCredits work?",
    answer: "EcoCredits are our reward currency for recycling. You earn them when you recycle electronics with us. The amount depends on the type, condition, and age of your devices. You can use EcoCredits to purchase refurbished items in our marketplace or exchange them for discounts and rewards."
  },
  {
    question: "Can I recycle broken electronics?",
    answer: "Yes! We accept broken electronics. Even if devices aren't working, they contain valuable materials that can be recycled. You'll still earn EcoCredits for recycling broken items, though the amount may be less than for working devices."
  },
  {
    question: "How much are my old devices worth?",
    answer: "The value of your devices depends on their type, age, condition, and current market demand. Working smartphones and laptops typically earn the most EcoCredits. You can get an estimate by using the evaluation tool on our website or mobile app."
  },
  {
    question: "Is my data safe when I recycle?",
    answer: "Data security is our priority. We recommend performing a factory reset on your devices before recycling. For additional security, we provide a certified data wiping service for all storage devices we receive, following industry-standard protocols to ensure your information is completely removed."
  }
];

// User Auth functions
export const mockRegisterUser = (userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) => {
  // Check if user already exists
  const existingUser = users.find(u => u.email === userData.email);
  if (existingUser) {
    return { error: "User with this email already exists" };
  }

  // Create new user with bonus EcoCredits
  const newUser: MockUser = {
    id: (users.length + 1).toString(),
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    password: userData.password, // In a real app, this would be hashed
    ecoCredits: 5000, // Bonus for new sign-ups
    createdAt: new Date()
  };

  users.push(newUser);

  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  return {
    user: userWithoutPassword,
    token: "mock-jwt-token-" + newUser.id
  };
};

export const mockLoginUser = (email: string, password: string) => {
  // Find user
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return { error: "Invalid credentials" };
  }

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return {
    user: userWithoutPassword,
    token: "mock-jwt-token-" + user.id
  };
};

export const mockGetUserById = (id: string) => {
  const user = users.find(u => u.id === id);
  if (!user) {
    return { error: "User not found" };
  }

  // Return user without password
  const { password, ...userWithoutPassword } = user;
  return { user: userWithoutPassword };
};

export const mockUpdateUserCredits = (userId: string, amount: number) => {
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return { error: "User not found" };
  }

  users[userIndex].ecoCredits += amount;
  return { newBalance: users[userIndex].ecoCredits };
};

// Product functions
export const mockGetAllProducts = () => {
  return { products };
};

export const mockGetProductById = (id: string) => {
  const product = products.find(p => p.id === id);
  if (!product) {
    return { error: "Product not found" };
  }
  return { product };
};

// Event functions
export const mockGetAllEvents = () => {
  return { events };
};

export const mockGetEventById = (id: string) => {
  const event = events.find(e => e.id === id);
  if (!event) {
    return { error: "Event not found" };
  }
  return { event };
};

// Eco tips functions
export const mockGetEcoTips = (limit?: number) => {
  if (limit) {
    return { tips: ecoTips.slice(0, limit) };
  }
  return { tips: ecoTips };
};

// Chatbot functions
export const mockGetChatbotResponse = (question: string) => {
  // Try to find an exact match
  let response = chatbotResponses.find(r => 
    r.question.toLowerCase() === question.toLowerCase()
  );
  
  // If no exact match, try to find a response with keywords
  if (!response) {
    response = chatbotResponses.find(r => 
      question.toLowerCase().includes(r.question.toLowerCase().split(" ")[0])
    );
  }
  
  if (response) {
    return { answer: response.answer };
  }
  
  // Default response
  return { 
    answer: "I'm not sure about that. Please contact our support team for more information or try asking about recycling, EcoCredits, or our services." 
  };
};

// Export all mock functions
export const mockDatabase = {
  users,
  products,
  events,
  ecoTips,
  chatbotResponses,
  registerUser: mockRegisterUser,
  loginUser: mockLoginUser,
  getUserById: mockGetUserById,
  updateUserCredits: mockUpdateUserCredits,
  getAllProducts: mockGetAllProducts,
  getProductById: mockGetProductById,
  getAllEvents: mockGetAllEvents,
  getEventById: mockGetEventById,
  getEcoTips: mockGetEcoTips,
  getChatbotResponse: mockGetChatbotResponse
};

export default mockDatabase;
