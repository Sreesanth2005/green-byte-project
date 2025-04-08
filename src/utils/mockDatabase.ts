
// Mock database for frontend development

// Types for our mock data
export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // In a real app, this would be hashed
  phone?: string;
  streetAddress?: string;
  apartmentNumber?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  avatarUrl?: string;
  ecoCredits: number;
  level: string;
  createdAt: string;
  updatedAt: string;
  registeredEvents: string[];
  orders: MockOrder[];
  cart: MockCartItem[];
}

export interface MockProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  ecoCredits: number;
  image: string;
  category: string;
  condition: string;
  specs: string[];
  stock: number;
  rating: number;
  reviews: number;
  seller: string;
  createdAt: string;
}

export interface MockEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  maxParticipants: number;
  currentParticipants: number;
  type: string;
  ecoCreditsReward: number;
  organizer: string;
}

export interface MockEcoTip {
  id: string;
  title: string;
  content: string;
  category: string;
  impact: "low" | "medium" | "high";
  imageUrl: string;
}

export interface MockOrder {
  id: string;
  userId: string;
  products: {
    productId: string;
    quantity: number;
    price: number;
    ecoCredits: number;
  }[];
  totalPrice: number;
  totalEcoCredits: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
}

export interface MockCartItem {
  id: string;
  productId: string;
  quantity: number;
}

// Mock data
const users: MockUser[] = [
  {
    id: "u1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "password123",
    phone: "9876543210",
    streetAddress: "123 Green Street",
    city: "Eco City",
    state: "Green State",
    pinCode: "560001",
    ecoCredits: 8000,
    level: "Gold",
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-04-10T14:20:00Z",
    registeredEvents: ["e1", "e3"],
    orders: [],
    cart: []
  },
  {
    id: "u2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    password: "jane123",
    ecoCredits: 3500,
    level: "Silver",
    createdAt: "2023-02-20T09:15:00Z",
    updatedAt: "2023-04-05T16:45:00Z",
    registeredEvents: ["e2"],
    orders: [],
    cart: []
  },
  {
    id: "admin",
    firstName: "Admin",
    lastName: "User",
    email: "admin@greenbyte.com",
    password: "admin123",
    ecoCredits: 999999, // Infinite credits for testing
    level: "Admin",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-04-01T00:00:00Z",
    registeredEvents: [],
    orders: [],
    cart: []
  }
];

const products: MockProduct[] = [
  {
    id: "p1",
    name: "Refurbished iPhone 12",
    description: "This refurbished iPhone 12 has been fully tested and restored to factory settings. It comes with a 1-year warranty and all original accessories.",
    price: 499,
    ecoCredits: 4990,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
    category: "phones",
    condition: "Excellent - Like new with minimal signs of use",
    specs: ["128GB Storage", "6.1-inch Super Retina XDR display", "A14 Bionic chip", "Dual 12MP camera system", "Face ID"],
    stock: 15,
    rating: 4.5,
    reviews: 128,
    seller: "Green Electronics",
    createdAt: "2023-03-15T10:30:00Z"
  },
  {
    id: "p2",
    name: "Restored MacBook Air (2020)",
    description: "This MacBook Air has been professionally refurbished with new battery and keyboard. Perfect for students and professionals alike.",
    price: 799,
    ecoCredits: 7990,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    category: "laptops",
    condition: "Very Good - Minor scratches on bottom case",
    specs: ["Apple M1 Chip", "8GB RAM", "256GB SSD", "13.3-inch Retina display", "Touch ID"],
    stock: 8,
    rating: 4.7,
    reviews: 95,
    seller: "Apple Renewed",
    createdAt: "2023-03-10T14:20:00Z"
  },
  {
    id: "p3",
    name: "Refurbished Sony WH-1000XM4 Headphones",
    description: "Industry-leading noise cancellation headphones with premium sound quality. These have been professionally cleaned and tested.",
    price: 229,
    ecoCredits: 2290,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=300&fit=crop",
    category: "audio",
    condition: "Good - Light wear on ear cushions",
    specs: ["Industry-leading noise cancellation", "30-hour battery life", "Touch controls", "Speak-to-chat technology"],
    stock: 12,
    rating: 4.8,
    reviews: 203,
    seller: "Sound Revival",
    createdAt: "2023-02-28T09:15:00Z"
  },
  {
    id: "p4",
    name: "Reconditioned Samsung Galaxy S21",
    description: "This Galaxy S21 has been thoroughly tested and restored to like-new condition. Full functionality with minor cosmetic imperfections.",
    price: 389,
    ecoCredits: 3890,
    image: "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=400&h=300&fit=crop",
    category: "phones",
    condition: "Good - Minor scratches on frame",
    specs: ["8GB RAM", "128GB Storage", "6.2-inch Dynamic AMOLED display", "64MP triple camera", "5G Enabled"],
    stock: 7,
    rating: 4.2,
    reviews: 87,
    seller: "Galaxy Renewed",
    createdAt: "2023-03-05T11:30:00Z"
  },
  {
    id: "p5",
    name: "Refurbished iPad Pro 12.9\" (2021)",
    description: "This iPad Pro has been professionally refurbished and is in excellent condition. Comes with charger and 6-month warranty.",
    price: 899,
    ecoCredits: 8990,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
    category: "tablets",
    condition: "Excellent - No visible wear",
    specs: ["M1 chip", "12.9-inch Liquid Retina XDR display", "256GB Storage", "12MP Ultra Wide front camera with Center Stage", "5G connectivity"],
    stock: 5,
    rating: 4.9,
    reviews: 56,
    seller: "Apple Certified Refurbished",
    createdAt: "2023-03-20T15:45:00Z"
  },
  {
    id: "p6",
    name: "Renewed Dell XPS 13",
    description: "This Dell XPS 13 has been refurbished to meet manufacturer specifications. Includes new battery and comes with Windows 11 Pro.",
    price: 749,
    ecoCredits: 7490,
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=300&fit=crop",
    category: "laptops",
    condition: "Very Good - Minor wear on keyboard",
    specs: ["11th Gen Intel Core i7", "16GB RAM", "512GB SSD", "13.4-inch FHD+ display", "Thunderbolt 4"],
    stock: 6,
    rating: 4.6,
    reviews: 73,
    seller: "Dell Renewed",
    createdAt: "2023-02-25T13:10:00Z"
  },
  {
    id: "p7",
    name: "Restored Nintendo Switch",
    description: "This Nintendo Switch has been refurbished and tested to ensure full functionality. Perfect for gaming at home or on the go.",
    price: 229,
    ecoCredits: 2290,
    image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&h=300&fit=crop",
    category: "gaming",
    condition: "Good - Light scratches on screen protector",
    specs: ["32GB Storage", "6.2-inch touch screen", "TV Mode, Tabletop Mode, Handheld Mode", "Includes Joy-Con controllers"],
    stock: 9,
    rating: 4.4,
    reviews: 112,
    seller: "GameRevive",
    createdAt: "2023-03-08T10:00:00Z"
  },
  {
    id: "p8",
    name: "Reconditioned Canon EOS R6",
    description: "Professional mirrorless camera that has been factory reconditioned. Includes battery, charger and 90-day warranty.",
    price: 1799,
    ecoCredits: 17990,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop",
    category: "cameras",
    condition: "Excellent - Professionally refurbished",
    specs: ["20MP Full-Frame CMOS Sensor", "4K60p Video Recording", "In-Body Image Stabilization", "12 fps Mechanical Shutter", "Dual Pixel CMOS AF II"],
    stock: 3,
    rating: 4.8,
    reviews: 42,
    seller: "Canon Certified Refurbished",
    createdAt: "2023-03-22T09:30:00Z"
  },
  {
    id: "p9",
    name: "Refurbished Dyson V11 Vacuum",
    description: "This Dyson V11 has been thoroughly tested and restored with genuine Dyson parts. Includes all attachments and 1-year warranty.",
    price: 399,
    ecoCredits: 3990,
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&h=300&fit=crop",
    category: "appliances",
    condition: "Very Good - Light cosmetic wear",
    specs: ["Up to 60 minutes of fade-free power", "LCD screen display", "High Torque cleaner head", "HEPA filtration", "Point & shoot bin emptying"],
    stock: 7,
    rating: 4.5,
    reviews: 89,
    seller: "Dyson Certified Refurbished",
    createdAt: "2023-03-12T14:15:00Z"
  },
  {
    id: "p10",
    name: "Restored Bose QuietComfort 35 II",
    description: "These premium noise-cancelling headphones have been professionally restored and tested for audio quality and comfort.",
    price: 189,
    ecoCredits: 1890,
    image: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=400&h=300&fit=crop",
    category: "audio",
    condition: "Good - Minor wear on ear cushions",
    specs: ["World-class noise cancellation", "Bluetooth and NFC pairing", "Up to 20 hours battery life", "Alexa voice control", "Balanced audio performance"],
    stock: 11,
    rating: 4.3,
    reviews: 156,
    seller: "Bose Renewed",
    createdAt: "2023-02-18T16:20:00Z"
  },
  {
    id: "p11",
    name: "Refurbished GoPro HERO10 Black",
    description: "This GoPro HERO10 has been factory refurbished to ensure it meets original specifications. Perfect for capturing your adventures.",
    price: 329,
    ecoCredits: 3290,
    image: "https://images.unsplash.com/photo-1525328557941-8d523746c6e5?w=400&h=300&fit=crop",
    category: "cameras",
    condition: "Excellent - Minimal signs of use",
    specs: ["5.3K Video", "23MP Photos", "HyperSmooth 4.0 Stabilization", "Waterproof to 33ft", "Front and rear LCD screens"],
    stock: 6,
    rating: 4.6,
    reviews: 67,
    seller: "GoPro Refurbished",
    createdAt: "2023-03-25T11:40:00Z"
  },
  {
    id: "p12",
    name: "Renewed Philips Hue Starter Kit",
    description: "This smart lighting kit has been tested and certified. Includes bridge and 4 color bulbs to transform your home lighting.",
    price: 129,
    ecoCredits: 1290,
    image: "https://images.unsplash.com/photo-1565741171094-35ab1c47cae9?w=400&h=300&fit=crop",
    category: "smart home",
    condition: "Excellent - Like new in box",
    specs: ["4 Color A19 Bulbs", "Hue Bridge included", "16 million colors", "Voice control with Alexa, Google Assistant", "Create custom scenes"],
    stock: 14,
    rating: 4.7,
    reviews: 93,
    seller: "Smart Home Renewed",
    createdAt: "2023-03-15T13:25:00Z"
  },
  {
    id: "p13",
    name: "Reconditioned Apple Watch Series 6",
    description: "This Apple Watch has been professionally refurbished with a new battery. Track your fitness and stay connected on the go.",
    price: 259,
    ecoCredits: 2590,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=300&fit=crop",
    category: "wearables",
    condition: "Very Good - Minor scratches on case",
    specs: ["44mm case size", "GPS + Cellular", "Always-On Retina display", "Blood Oxygen app", "ECG app"],
    stock: 8,
    rating: 4.5,
    reviews: 112,
    seller: "Apple Certified Refurbished",
    createdAt: "2023-03-08T09:50:00Z"
  },
  {
    id: "p14",
    name: "Restored Microsoft Surface Pro 7",
    description: "This Surface Pro 7 has been refurbished to meet Microsoft's quality standards. The perfect 2-in-1 for productivity on the go.",
    price: 649,
    ecoCredits: 6490,
    image: "https://images.unsplash.com/photo-1617469767053-3ef9567d152f?w=400&h=300&fit=crop",
    category: "laptops",
    condition: "Excellent - Minimal signs of use",
    specs: ["10th Gen Intel Core i5", "8GB RAM", "256GB SSD", "12.3\" PixelSense Display", "All-day battery life"],
    stock: 5,
    rating: 4.4,
    reviews: 78,
    seller: "Microsoft Certified Refurbished",
    createdAt: "2023-03-18T10:35:00Z"
  },
  {
    id: "p15",
    name: "Refurbished LG 55\" 4K OLED TV",
    description: "This high-end OLED TV has been professionally reconditioned and tested. Experience stunning picture quality with perfect blacks.",
    price: 899,
    ecoCredits: 8990,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
    category: "televisions",
    condition: "Very Good - No screen issues",
    specs: ["55-inch 4K OLED Display", "Dolby Vision IQ & Dolby Atmos", "webOS Smart TV", "HDMI 2.1 for gaming", "AI Picture Pro"],
    stock: 4,
    rating: 4.8,
    reviews: 63,
    seller: "LG Certified Refurbished",
    createdAt: "2023-03-22T16:40:00Z"
  },
  {
    id: "p16",
    name: "Reconditioned Roomba i7+",
    description: "This Roomba i7+ has been factory refurbished. Features automatic dirt disposal and smart mapping for effortless cleaning.",
    price: 549,
    ecoCredits: 5490,
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&h=300&fit=crop",
    category: "appliances",
    condition: "Excellent - Fully refurbished",
    specs: ["Automatic Dirt Disposal", "Smart Mapping", "10x Power-Lifting Suction", "Works with Alexa & Google Assistant", "Ideal for pet hair"],
    stock: 6,
    rating: 4.6,
    reviews: 72,
    seller: "iRobot Certified Refurbished",
    createdAt: "2023-03-10T13:15:00Z"
  },
  {
    id: "p17",
    name: "Restored Nespresso Vertuo Coffee Machine",
    description: "This Nespresso machine has been professionally restored and descaled. Brew perfect coffee and espresso with the touch of a button.",
    price: 129,
    ecoCredits: 1290,
    image: "https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?w=400&h=300&fit=crop",
    category: "appliances",
    condition: "Very Good - Minor wear on exterior",
    specs: ["Single-Serve Coffee & Espresso Maker", "5 cup sizes", "Centrifusion technology", "Automatic pod recognition", "Fast heat-up time"],
    stock: 10,
    rating: 4.5,
    reviews: 128,
    seller: "Kitchen Renewed",
    createdAt: "2023-03-05T14:20:00Z"
  },
  {
    id: "p18",
    name: "Refurbished Sony PlayStation 5",
    description: "This PlayStation 5 has been professionally refurbished and tested. Experience next-gen gaming with lightning-fast loading times.",
    price: 449,
    ecoCredits: 4490,
    image: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&h=300&fit=crop",
    category: "gaming",
    condition: "Excellent - Like new",
    specs: ["AMD Zen 2 CPU", "10.28 TFLOPs GPU", "825GB SSD", "4K Gaming", "Includes DualSense controller"],
    stock: 3,
    rating: 4.9,
    reviews: 56,
    seller: "Game Renewed",
    createdAt: "2023-03-26T09:10:00Z"
  },
  {
    id: "p19",
    name: "Restored Kindle Paperwhite",
    description: "This Kindle Paperwhite has been refurbished to work and look like new. Perfect for reading anywhere with its glare-free display.",
    price: 89,
    ecoCredits: 890,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
    category: "tablets",
    condition: "Very Good - Light cosmetic wear",
    specs: ["6.8\" glare-free display", "8GB Storage", "Waterproof", "10 weeks of battery life", "Built-in adjustable light"],
    stock: 15,
    rating: 4.7,
    reviews: 167,
    seller: "Amazon Renewed",
    createdAt: "2023-03-12T12:30:00Z"
  },
  {
    id: "p20",
    name: "Refurbished Sonos One SL",
    description: "This Sonos One SL has been professionally refurbished. Fill your room with rich, detailed sound controlled by the Sonos app.",
    price: 159,
    ecoCredits: 1590,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&h=300&fit=crop",
    category: "audio",
    condition: "Excellent - Factory refurbished",
    specs: ["Rich room-filling sound", "Stream from 100+ services", "Multi-room listening", "Humidity resistant", "Compact design"],
    stock: 7,
    rating: 4.5,
    reviews: 89,
    seller: "Sonos Certified Refurbished",
    createdAt: "2023-03-20T15:20:00Z"
  }
];

const events: MockEvent[] = [
  {
    id: "e1",
    title: "E-Waste Collection Drive",
    description: "Bring your old electronics for responsible recycling. All participants will receive eco-credits based on the items recycled.",
    date: "2025-05-15",
    time: "09:00 AM - 02:00 PM",
    location: "Green Park Community Center",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=500&fit=crop",
    maxParticipants: 100,
    currentParticipants: 45,
    type: "collection",
    ecoCreditsReward: 500,
    organizer: "Green Byte Foundation"
  },
  {
    id: "e2",
    title: "DIY Electronics Repair Workshop",
    description: "Learn how to repair common electronic issues and extend the life of your devices. Hands-on session with professional repair technicians.",
    date: "2025-05-22",
    time: "10:00 AM - 01:00 PM",
    location: "Tech Hub Innovation Center",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&h=500&fit=crop",
    maxParticipants: 30,
    currentParticipants: 24,
    type: "workshop",
    ecoCreditsReward: 300,
    organizer: "Repair Cafe Network"
  },
  {
    id: "e3",
    title: "Sustainable Technology Conference",
    description: "Join industry experts for discussions on the future of sustainable technology and circular economy innovations.",
    date: "2025-06-05",
    time: "09:00 AM - 05:00 PM",
    location: "Green Convention Center",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=500&fit=crop",
    maxParticipants: 200,
    currentParticipants: 125,
    type: "conference",
    ecoCreditsReward: 750,
    organizer: "Sustainable Tech Alliance"
  },
  {
    id: "e4",
    title: "Community Upcycling Challenge",
    description: "Transform discarded electronics into art, furniture, or functional items. Prizes for the most creative and practical upcycled creations.",
    date: "2025-06-12",
    time: "11:00 AM - 04:00 PM",
    location: "Downtown Arts District",
    image: "https://images.unsplash.com/photo-1607748851687-ba9a10d47fea?w=800&h=500&fit=crop",
    maxParticipants: 50,
    currentParticipants: 32,
    type: "competition",
    ecoCreditsReward: 600,
    organizer: "Creative Reuse Coalition"
  },
  {
    id: "e5",
    title: "Green Coding Bootcamp",
    description: "Learn how to write energy-efficient code and build sustainable software applications in this two-day intensive workshop.",
    date: "2025-06-18",
    time: "09:00 AM - 04:00 PM",
    location: "University Technology Center",
    image: "https://images.unsplash.com/photo-1623479322729-28b25c16b011?w=800&h=500&fit=crop",
    maxParticipants: 40,
    currentParticipants: 28,
    type: "workshop",
    ecoCreditsReward: 800,
    organizer: "Green Code Initiative"
  }
];

const ecoTips: MockEcoTip[] = [
  {
    id: "t1",
    title: "Extend Your Devices' Lifespan",
    content: "Keep your electronics in good condition by regularly cleaning them, using protective cases, and updating software. Simple maintenance can extend their life by years.",
    category: "maintenance",
    impact: "high",
    imageUrl: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=400&h=300&fit=crop"
  },
  {
    id: "t2",
    title: "Proper E-Waste Disposal",
    content: "Never throw electronics in regular trash. Use certified e-waste recycling centers to ensure hazardous materials are properly handled and valuable materials recovered.",
    category: "recycling",
    impact: "high",
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop"
  },
  {
    id: "t3",
    title: "Energy-Saving Settings",
    content: "Configure your devices to use energy-saving modes. Adjust screen brightness, enable sleep mode after short periods of inactivity, and disable features you don't use.",
    category: "energy",
    impact: "medium",
    imageUrl: "https://images.unsplash.com/photo-1542435503-956c469947f6?w=400&h=300&fit=crop"
  },
  {
    id: "t4",
    title: "Buy Refurbished Electronics",
    content: "Purchasing refurbished devices can reduce e-waste by up to 80% compared to buying new. Many refurbished products work like new but at a fraction of the cost.",
    category: "purchasing",
    impact: "high",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=300&fit=crop"
  },
  {
    id: "t5",
    title: "Unplug When Not In Use",
    content: "Devices continue to draw power even when turned off. Unplug chargers and electronics when not in use or use power strips that can be turned off completely.",
    category: "energy",
    impact: "medium",
    imageUrl: "https://images.unsplash.com/photo-1592890288564-76628a30a657?w=400&h=300&fit=crop"
  },
  {
    id: "t6",
    title: "Repair, Don't Replace",
    content: "Many common issues with electronics can be fixed. Look up repair guides online or visit local repair cafes before deciding to replace your device.",
    category: "maintenance",
    impact: "high",
    imageUrl: "https://images.unsplash.com/photo-1580974852861-c381510bc98e?w=400&h=300&fit=crop"
  },
  {
    id: "t7",
    title: "Donate Working Electronics",
    content: "If you upgrade, donate your old devices to schools, charities, or community organizations that can give them a second life.",
    category: "reuse",
    impact: "medium",
    imageUrl: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=300&fit=crop"
  },
  {
    id: "t8",
    title: "Use Cloud Storage Wisely",
    content: "While cloud storage reduces the need for physical storage devices, it still consumes energy. Regularly clean up your cloud storage and delete unnecessary files.",
    category: "digital",
    impact: "low",
    imageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=300&fit=crop"
  },
  {
    id: "t9",
    title: "Choose Energy Efficient Devices",
    content: "Look for ENERGY STAR certification when purchasing new electronics. These products consume less power and can significantly reduce your carbon footprint.",
    category: "purchasing",
    impact: "medium",
    imageUrl: "https://images.unsplash.com/photo-1605792657660-596af9009e82?w=400&h=300&fit=crop"
  },
  {
    id: "t10",
    title: "Participate in Trade-In Programs",
    content: "Many manufacturers offer trade-in programs where you can exchange your old device for credit toward a new purchase. This ensures proper recycling of your old device.",
    category: "recycling",
    impact: "medium",
    imageUrl: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&h=300&fit=crop"
  }
];

// Mock Class to handle database operations
class MockDB {
  users: MockUser[];
  products: MockProduct[];
  events: MockEvent[];
  ecoTips: MockEcoTip[];

  constructor() {
    this.users = users;
    this.products = products;
    this.events = events;
    this.ecoTips = ecoTips;
  }

  // User methods
  loginUser(email: string, password: string) {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (!user) {
      return { error: "Invalid credentials" };
    }
    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        ecoCredits: user.ecoCredits,
        level: user.level
      },
      token: `mock-token-${user.id}-${Date.now()}`
    };
  }

  registerUser(userData: { firstName: string; lastName: string; email: string; password: string; }) {
    // Check if user already exists
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    // Create new user with 5000 EcoCredits bonus
    const newUser: MockUser = {
      id: `u${this.users.length + 1}`,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      ecoCredits: 5000, // Welcome bonus
      level: "Bronze",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      registeredEvents: [],
      orders: [],
      cart: []
    };

    this.users.push(newUser);
    return {
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        ecoCredits: newUser.ecoCredits,
        level: newUser.level
      },
      token: `mock-token-${newUser.id}-${Date.now()}`
    };
  }

  getUserById(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      return { error: "User not found" };
    }
    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        ecoCredits: user.ecoCredits,
        level: user.level,
        phone: user.phone,
        streetAddress: user.streetAddress,
        apartmentNumber: user.apartmentNumber,
        city: user.city,
        state: user.state,
        pinCode: user.pinCode
      }
    };
  }

  updateUserProfile(userId: string, data: Partial<MockUser>) {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { error: "User not found" };
    }

    // Update user data
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };

    return {
      user: {
        id: this.users[userIndex].id,
        firstName: this.users[userIndex].firstName,
        lastName: this.users[userIndex].lastName,
        email: this.users[userIndex].email,
        ecoCredits: this.users[userIndex].ecoCredits,
        level: this.users[userIndex].level,
        phone: this.users[userIndex].phone,
        streetAddress: this.users[userIndex].streetAddress,
        apartmentNumber: this.users[userIndex].apartmentNumber,
        city: this.users[userIndex].city,
        state: this.users[userIndex].state,
        pinCode: this.users[userIndex].pinCode
      }
    };
  }

  // Product methods
  getAllProducts() {
    return { products: this.products };
  }

  getProductById(productId: string) {
    const product = this.products.find(p => p.id === productId);
    if (!product) {
      return { error: "Product not found" };
    }
    return { product };
  }

  getProductsByCategory(category: string) {
    const filteredProducts = this.products.filter(p => p.category === category);
    return { products: filteredProducts };
  }

  // Cart methods
  getCart(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      return { error: "User not found" };
    }

    // Get full product details for cart items
    const cartItems = user.cart.map(item => {
      const product = this.products.find(p => p.id === item.productId);
      return {
        id: item.id,
        product: product,
        quantity: item.quantity
      };
    });

    return { cartItems };
  }

  addToCart(userId: string, productId: string, quantity: number) {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { error: "User not found" };
    }

    const product = this.products.find(p => p.id === productId);
    if (!product) {
      return { error: "Product not found" };
    }

    // Check if item already in cart
    const existingItemIndex = this.users[userIndex].cart.findIndex(
      item => item.productId === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      this.users[userIndex].cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      this.users[userIndex].cart.push({
        id: `ci${Date.now()}`,
        productId,
        quantity
      });
    }

    return { success: true };
  }

  updateCartItem(userId: string, cartItemId: string, quantity: number) {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { error: "User not found" };
    }

    const cartItemIndex = this.users[userIndex].cart.findIndex(
      item => item.id === cartItemId
    );

    if (cartItemIndex === -1) {
      return { error: "Cart item not found" };
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      this.users[userIndex].cart = this.users[userIndex].cart.filter(
        item => item.id !== cartItemId
      );
    } else {
      // Update quantity
      this.users[userIndex].cart[cartItemIndex].quantity = quantity;
    }

    return { success: true };
  }

  removeFromCart(userId: string, cartItemId: string) {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { error: "User not found" };
    }

    this.users[userIndex].cart = this.users[userIndex].cart.filter(
      item => item.id !== cartItemId
    );

    return { success: true };
  }

  clearCart(userId: string) {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { error: "User not found" };
    }

    this.users[userIndex].cart = [];
    return { success: true };
  }

  // Order methods
  createOrder(userId: string) {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { error: "User not found" };
    }

    const user = this.users[userIndex];
    if (user.cart.length === 0) {
      return { error: "Cart is empty" };
    }

    // Calculate order totals
    let totalPrice = 0;
    let totalEcoCredits = 0;
    const orderItems = user.cart.map(item => {
      const product = this.products.find(p => p.id === item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      const itemPrice = product.price * item.quantity;
      const itemEcoCredits = product.ecoCredits * item.quantity;
      
      totalPrice += itemPrice;
      totalEcoCredits += itemEcoCredits;

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
        ecoCredits: product.ecoCredits
      };
    });

    // Check if user has enough eco credits
    if (user.ecoCredits < totalEcoCredits) {
      return { error: "Insufficient eco credits" };
    }

    // Create order
    const order: MockOrder = {
      id: `ord${Date.now()}`,
      userId: user.id,
      products: orderItems,
      totalPrice,
      totalEcoCredits,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    // Deduct eco credits
    this.users[userIndex].ecoCredits -= totalEcoCredits;

    // Update stock
    order.products.forEach(item => {
      const productIndex = this.products.findIndex(p => p.id === item.productId);
      if (productIndex !== -1) {
        this.products[productIndex].stock -= item.quantity;
      }
    });

    // Add order to user's orders
    this.users[userIndex].orders.push(order);

    // Clear cart
    this.users[userIndex].cart = [];

    return { order };
  }

  getUserOrders(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      return { error: "User not found" };
    }

    return { orders: user.orders };
  }

  // Event methods
  getAllEvents() {
    return { events: this.events };
  }

  getEventById(eventId: string) {
    const event = this.events.find(e => e.id === eventId);
    if (!event) {
      return { error: "Event not found" };
    }
    return { event };
  }

  registerForEvent(userId: string, eventId: string) {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { error: "User not found" };
    }

    const eventIndex = this.events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) {
      return { error: "Event not found" };
    }

    // Check if event is full
    if (
      this.events[eventIndex].maxParticipants > 0 &&
      this.events[eventIndex].currentParticipants >= this.events[eventIndex].maxParticipants
    ) {
      return { error: "Event is full" };
    }

    // Check if user is already registered
    if (this.users[userIndex].registeredEvents.includes(eventId)) {
      return { error: "Already registered for this event" };
    }

    // Register user for event
    this.users[userIndex].registeredEvents.push(eventId);
    
    // Increment participant count
    this.events[eventIndex].currentParticipants += 1;
    
    // Award eco credits
    this.users[userIndex].ecoCredits += this.events[eventIndex].ecoCreditsReward;

    return { 
      success: true,
      message: `Successfully registered for ${this.events[eventIndex].title} and earned ${this.events[eventIndex].ecoCreditsReward} eco credits!`
    };
  }

  getUserRegisteredEvents(userId: string) {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      return { error: "User not found" };
    }

    const registeredEvents = this.events.filter(event =>
      user.registeredEvents.includes(event.id)
    );

    return { events: registeredEvents };
  }

  // Eco Tips methods
  getAllEcoTips() {
    return { ecoTips: this.ecoTips };
  }

  getEcoTipsByCategory(category: string) {
    const filteredTips = this.ecoTips.filter(tip => tip.category === category);
    return { ecoTips: filteredTips };
  }
}

const mockDatabase = new MockDB();
export default mockDatabase;
