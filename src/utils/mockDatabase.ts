
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
}

let products: MockProduct[] = [
  {
    id: "1",
    name: "Refurbished Laptop",
    description: "15.6-inch laptop with 8GB RAM, 256GB SSD, and Intel Core i5 processor.",
    category: "Computers",
    condition: "Excellent",
    price: 549.99,
    ecoCredits: 2000,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=350&fit=crop",
    stock: 5
  },
  {
    id: "2",
    name: "Second-hand Smartphone",
    description: "6.1-inch smartphone with 128GB storage, 12MP camera.",
    category: "Phones",
    condition: "Good",
    price: 349.99,
    ecoCredits: 1500,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=350&fit=crop",
    stock: 10
  },
  {
    id: "3",
    name: "Reconditioned Tablet",
    description: "10.2-inch tablet with 64GB storage, perfect for reading and browsing.",
    category: "Tablets",
    condition: "Very Good",
    price: 219.99,
    ecoCredits: 1000,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=350&fit=crop",
    stock: 8
  },
  {
    id: "4",
    name: "Wireless Headphones",
    description: "Noise-cancelling headphones with 20-hour battery life.",
    category: "Audio",
    condition: "Like New",
    price: 129.99,
    ecoCredits: 500,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=350&fit=crop",
    stock: 15
  },
  {
    id: "5",
    name: "Smart Watch",
    description: "Fitness tracking, heart rate monitoring, and notifications.",
    category: "Wearables",
    condition: "Excellent",
    price: 179.99,
    ecoCredits: 800,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=350&fit=crop",
    stock: 7
  },
  {
    id: "6",
    name: "Portable Bluetooth Speaker",
    description: "Waterproof speaker with 12-hour battery life.",
    category: "Audio",
    condition: "Good",
    price: 79.99,
    ecoCredits: 300,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=350&fit=crop",
    stock: 12
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
