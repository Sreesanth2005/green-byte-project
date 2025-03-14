
import mongoose, { Document, Model } from 'mongoose';
import { connectToDatabase } from './mongodbClient';

/**
 * Generic function to create a document in MongoDB
 * @param model The mongoose model
 * @param data The data to create
 * @returns The created document
 */
export async function createDocument<T extends Document>(
  model: Model<T>,
  data: Partial<T>
): Promise<T> {
  try {
    await ensureConnection();
    const newDocument = new model(data);
    return await newDocument.save();
  } catch (error) {
    console.error(`Error creating document in ${model.modelName}:`, error);
    throw error;
  }
}

/**
 * Generic function to find documents in MongoDB
 * @param model The mongoose model
 * @param filter The filter to apply
 * @param options Optional query options
 * @returns Array of documents
 */
export async function findDocuments<T extends Document>(
  model: Model<T>,
  filter: object = {},
  options: {
    sort?: object;
    limit?: number;
    skip?: number;
    select?: string;
    populate?: string | object;
  } = {}
): Promise<T[]> {
  try {
    await ensureConnection();
    
    let query = model.find(filter);
    
    if (options.sort) {
      query = query.sort(options.sort);
    }
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.skip) {
      query = query.skip(options.skip);
    }
    
    if (options.select) {
      query = query.select(options.select);
    }
    
    if (options.populate) {
      query = query.populate(options.populate);
    }
    
    return await query.exec();
  } catch (error) {
    console.error(`Error finding documents in ${model.modelName}:`, error);
    throw error;
  }
}

/**
 * Generic function to find a single document in MongoDB
 * @param model The mongoose model
 * @param filter The filter to apply
 * @param options Optional query options
 * @returns Single document or null
 */
export async function findOneDocument<T extends Document>(
  model: Model<T>,
  filter: object,
  options: {
    select?: string;
    populate?: string | object;
  } = {}
): Promise<T | null> {
  try {
    await ensureConnection();
    
    let query = model.findOne(filter);
    
    if (options.select) {
      query = query.select(options.select);
    }
    
    if (options.populate) {
      query = query.populate(options.populate);
    }
    
    return await query.exec();
  } catch (error) {
    console.error(`Error finding document in ${model.modelName}:`, error);
    throw error;
  }
}

/**
 * Generic function to update a document in MongoDB
 * @param model The mongoose model
 * @param filter The filter to apply
 * @param update The update to apply
 * @returns The updated document
 */
export async function updateDocument<T extends Document>(
  model: Model<T>,
  filter: object,
  update: object,
  options: {
    new?: boolean;
    runValidators?: boolean;
  } = { new: true, runValidators: true }
): Promise<T | null> {
  try {
    await ensureConnection();
    return await model.findOneAndUpdate(filter, update, options).exec();
  } catch (error) {
    console.error(`Error updating document in ${model.modelName}:`, error);
    throw error;
  }
}

/**
 * Generic function to delete a document in MongoDB
 * @param model The mongoose model
 * @param filter The filter to apply
 * @returns Deletion result
 */
export async function deleteDocument<T extends Document>(
  model: Model<T>,
  filter: object
): Promise<boolean> {
  try {
    await ensureConnection();
    const result = await model.deleteOne(filter).exec();
    return result.deletedCount > 0;
  } catch (error) {
    console.error(`Error deleting document in ${model.modelName}:`, error);
    throw error;
  }
}

/**
 * Function to count documents in MongoDB
 * @param model The mongoose model
 * @param filter The filter to apply
 * @returns Count of documents
 */
export async function countDocuments<T extends Document>(
  model: Model<T>,
  filter: object = {}
): Promise<number> {
  try {
    await ensureConnection();
    return await model.countDocuments(filter).exec();
  } catch (error) {
    console.error(`Error counting documents in ${model.modelName}:`, error);
    throw error;
  }
}

/**
 * Function to perform aggregation in MongoDB
 * @param model The mongoose model
 * @param pipeline The aggregation pipeline
 * @returns Aggregation result
 */
export async function aggregate<T extends Document, R = any>(
  model: Model<T>,
  pipeline: object[]
): Promise<R[]> {
  try {
    await ensureConnection();
    return await model.aggregate(pipeline).exec();
  } catch (error) {
    console.error(`Error performing aggregation in ${model.modelName}:`, error);
    throw error;
  }
}

/**
 * Ensure that we have a database connection
 */
async function ensureConnection(): Promise<void> {
  if (mongoose.connection.readyState !== 1) {
    await connectToDatabase();
  }
}
