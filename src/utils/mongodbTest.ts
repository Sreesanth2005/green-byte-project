
import { connectToDatabase, closeDatabaseConnection } from '../lib/mongodbClient';
import { User } from '../models/User';

/**
 * Test the MongoDB connection and perform basic operations
 */
export async function testMongoDBConnection() {
  try {
    console.log('Testing MongoDB connection...');
    
    // Ensure connection is established
    await connectToDatabase();
    
    // Check if we can count users
    const userCount = await User.countDocuments();
    console.log(`Found ${userCount} users in the database`);
    
    // Create a test user if no users exist
    if (userCount === 0) {
      console.log('Creating a test user...');
      const testUser = new User({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123', // This will be hashed automatically
        ecoCredits: 100
      });
      
      await testUser.save();
      console.log('Test user created successfully');
    }
    
    console.log('MongoDB connection test completed successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    return false;
  }
}

// You can uncomment this to run the test immediately
// testMongoDBConnection();
