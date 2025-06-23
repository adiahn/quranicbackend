import mongoose from 'mongoose';
import { config } from './index';

declare global {
  var mongooseConnection: typeof mongoose | undefined;
}

export const connectDB = async (): Promise<void> => {
  try {
    if (globalThis.mongooseConnection) {
      console.log('Using existing database connection');
      return;
    }

    const conn = await mongoose.connect(config.database.uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    globalThis.mongooseConnection = mongoose;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
};

export default mongoose; 