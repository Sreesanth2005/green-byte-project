
import { User } from '../models/User';
import { MarketplaceItem } from '../models/MarketplaceItem';
import { connectToDatabase } from '../lib/mongodbClient';

/**
 * Seeds the database with initial data for development purposes
 */
export async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    await connectToDatabase();
    
    // Check if users already exist
    const userCount = await User.countDocuments();
    
    if (userCount === 0) {
      console.log('Seeding users...');
      
      // Create admin user
      const adminUser = new User({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@greenbyte.com',
        password: 'admin123', // Will be hashed by pre-save hook
        ecoCredits: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Create regular users
      const user1 = new User({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        ecoCredits: 150,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const user2 = new User({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: 'password123',
        ecoCredits: 200,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Save all users
      const admin = await adminUser.save();
      const johnDoe = await user1.save();
      const janeSmith = await user2.save();
      
      console.log('Users seeded successfully');
      
      // Seed marketplace items
      console.log('Seeding marketplace items...');
      
      // Create marketplace items
      const items = [
        {
          title: 'Refurbished Laptop',
          description: 'Eco-friendly refurbished laptop in excellent condition',
          price: 499.99,
          category: 'Electronics',
          condition: 'Refurbished',
          images: ['https://example.com/laptop.jpg'],
          sellerId: admin._id,
          ecoImpact: {
            co2Saved: 120,
            waterSaved: 500,
            wasteReduced: 2.5
          },
          isSold: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Bamboo Cutlery Set',
          description: 'Sustainable bamboo cutlery set, perfect for travel',
          price: 19.99,
          category: 'Kitchen',
          condition: 'New',
          images: ['https://example.com/bamboo.jpg'],
          sellerId: johnDoe._id,
          ecoImpact: {
            co2Saved: 5,
            waterSaved: 100,
            wasteReduced: 0.2
          },
          isSold: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Solar Power Bank',
          description: 'Charge your devices using solar energy',
          price: 39.99,
          category: 'Electronics',
          condition: 'New',
          images: ['https://example.com/solar.jpg'],
          sellerId: janeSmith._id,
          ecoImpact: {
            co2Saved: 15,
            waterSaved: 0,
            wasteReduced: 0.5
          },
          isSold: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      await MarketplaceItem.insertMany(items);
      console.log('Marketplace items seeded successfully');
    } else {
      console.log('Database already contains data, skipping seeding');
    }
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Uncomment to run the seeder
// seedDatabase().catch(console.error);
