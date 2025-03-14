
import mongoose, { 
  Document, 
  Model, 
  SortOrder, 
  PopulateOptions, 
  PipelineStage, 
  AggregateOptions,
  Query
} from 'mongoose';
import { connectToDatabase } from './mongodbClient';

// Type for sort options
type SortOptions = { [key: string]: SortOrder };

/**
 * Generic function to create a document in MongoDB
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
 */
export async function findDocuments<T extends Document>(
  model: Model<T>,
  filter: object = {},
  options: {
    sort?: SortOptions;
    limit?: number;
    skip?: number;
    select?: string;
    populate?: string | PopulateOptions | (string | PopulateOptions)[];
  } = {}
): Promise<T[]> {
  try {
    await ensureConnection();
    
    let query: any = model.find(filter);
    
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
      if (typeof options.populate === 'string') {
        query = query.populate(options.populate);
      } else {
        query = query.populate(options.populate);
      }
    }
    
    const result = await query.exec();
    return result as T[];
  } catch (error) {
    console.error(`Error finding documents in ${model.modelName}:`, error);
    throw error;
  }
}

/**
 * Generic function to find a single document in MongoDB
 */
export async function findOneDocument<T extends Document>(
  model: Model<T>,
  filter: object,
  options: {
    select?: string;
    populate?: string | PopulateOptions | (string | PopulateOptions)[];
  } = {}
): Promise<T | null> {
  try {
    await ensureConnection();
    
    let query: any = model.findOne(filter);
    
    if (options.select) {
      query = query.select(options.select);
    }
    
    if (options.populate) {
      if (typeof options.populate === 'string') {
        query = query.populate(options.populate);
      } else {
        query = query.populate(options.populate);
      }
    }
    
    const result = await query.exec();
    return result as T | null;
  } catch (error) {
    console.error(`Error finding document in ${model.modelName}:`, error);
    throw error;
  }
}

/**
 * Generic function to update a document in MongoDB
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
    return await model.findOneAndUpdate(filter, update, options).exec() as T | null;
  } catch (error) {
    console.error(`Error updating document in ${model.modelName}:`, error);
    throw error;
  }
}

/**
 * Generic function to delete a document in MongoDB
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
 */
export async function aggregate<T extends Document, R = any>(
  model: Model<T>,
  pipeline: PipelineStage[]
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
