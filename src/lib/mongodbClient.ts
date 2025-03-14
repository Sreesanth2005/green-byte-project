
import mongoose from 'mongoose';

// MongoDB connection URI - this would typically be in an environment variable
const MONGODB_URI = 'mongodb+srv://username:password@cluster0.mongodb.net/greenByte?retryWrites=true&w=majority';

// Initialize connection
export const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Close connection (useful for testing and cleanup)
export const closeDatabaseConnection = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
};

// Initialize connection when this file is imported
connectToDatabase().catch(console.error);
