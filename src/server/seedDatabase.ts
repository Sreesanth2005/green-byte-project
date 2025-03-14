
import { connectToDatabase, closeDatabaseConnection } from '../lib/mongodbClient';
import { User } from '../models/User';
import { MarketplaceItem } from '../models/MarketplaceItem';
import { Event } from '../models/Event';
import { EcoTip } from '../models/EcoTip';

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Connect to MongoDB
    await connectToDatabase();
    
    // Seed marketplace items
    const marketplaceCount = await MarketplaceItem.countDocuments();
    if (marketplaceCount === 0) {
      console.log('Seeding marketplace items...');
      
      const marketplaceItems = [
        {
          title: "Refurbished iPhone 12",
          description: "This refurbished iPhone 12 has been fully tested and restored to factory settings. It comes with a 1-year warranty and all original accessories.",
          price: 499,
          ecoCredits: 4990,
          category: "phones",
          condition: "Excellent - Like new with minimal signs of use",
          specs: ["128GB Storage", "6.1-inch Super Retina XDR display", "A14 Bionic chip", "Dual 12MP camera system", "Face ID"],
          imageUrls: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop"],
          rating: 4.5,
          reviews: 128,
          isSold: false
        },
        {
          title: "Dell XPS 13 Laptop",
          description: "The Dell XPS 13 is a premium ultrabook with InfinityEdge display and powerful performance in a compact design. This refurbished model has been thoroughly tested and comes with our quality guarantee.",
          price: 899,
          ecoCredits: 8990,
          category: "laptops",
          condition: "Very Good - Minor cosmetic imperfections that don't affect performance",
          specs: ["Intel Core i7 processor", "16GB RAM", "512GB SSD", "13.4-inch FHD+ display", "Windows 11 Pro"],
          imageUrls: ["https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=300&fit=crop"],
          rating: 4.8,
          reviews: 256,
          isSold: false
        },
        {
          title: "iPad Air (2020)",
          description: "The iPad Air features a stunning Liquid Retina display and Apple's powerful A14 Bionic chip. This refurbished model has been thoroughly tested and is in excellent condition.",
          price: 449,
          ecoCredits: 4490,
          category: "tablets",
          condition: "Excellent - Like new with minimal signs of use",
          specs: ["64GB Storage", "10.9-inch Liquid Retina display", "A14 Bionic chip", "12MP rear camera, 7MP front camera", "Touch ID"],
          imageUrls: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop"],
          rating: 4.7,
          reviews: 189,
          isSold: false
        }
      ];
      
      await MarketplaceItem.insertMany(marketplaceItems);
      console.log(`${marketplaceItems.length} marketplace items added`);
    }
    
    // Seed events
    const eventsCount = await Event.countDocuments();
    if (eventsCount === 0) {
      console.log('Seeding events...');
      
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 15);
      
      const events = [
        {
          title: "E-Waste Collection Drive",
          description: "Bring your old electronics for proper recycling. We'll be collecting smartphones, laptops, tablets, and other e-waste items.",
          date: nextMonth,
          time: "10:00 AM - 2:00 PM",
          location: "Central Community Center, 123 Main St",
          category: "collection",
          organizer: "Green Byte",
          maxParticipants: 50,
          currentParticipants: 0,
          ecoCreditsReward: 500
        },
        {
          title: "Tech Refurbishing Workshop",
          description: "Learn how to repair and refurbish old electronics to extend their lifespan. Hands-on session with experienced technicians.",
          date: new Date(now.getFullYear(), now.getMonth() + 2, 5),
          time: "1:00 PM - 4:00 PM",
          location: "Tech Lab, 456 Innovation Ave",
          category: "workshop",
          organizer: "Green Byte",
          maxParticipants: 20,
          currentParticipants: 0,
          ecoCreditsReward: 300
        }
      ];
      
      await Event.insertMany(events);
      console.log(`${events.length} events added`);
    }
    
    // Seed eco tips
    const ecoTipsCount = await EcoTip.countDocuments();
    if (ecoTipsCount === 0) {
      console.log('Seeding eco tips...');
      
      const ecoTips = [
        {
          tip: "When upgrading your phone, consider trading in or properly recycling your old device instead of keeping it in a drawer.",
          category: "phones"
        },
        {
          tip: "Use a smart power strip for your electronics to easily turn off multiple devices at once and prevent phantom energy use.",
          category: "general"
        },
        {
          tip: "Extend your laptop's battery life by adjusting power settings and avoiding extreme temperatures.",
          category: "laptops"
        },
        {
          tip: "Before recycling electronics, make sure to securely wipe all personal data to protect your privacy.",
          category: "recycling"
        }
      ];
      
      await EcoTip.insertMany(ecoTips);
      console.log(`${ecoTips.length} eco tips added`);
    }
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    await closeDatabaseConnection();
  }
};

// Run the seeding function
seedDatabase();
