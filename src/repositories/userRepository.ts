
import { User, IUser } from '../models/User';
import {
  createDocument,
  findDocuments,
  findOneDocument,
  updateDocument,
  deleteDocument,
  countDocuments
} from '../lib/mongodbUtils';
import { SortOrder } from 'mongoose';

/**
 * Create a new user
 */
export async function createUser(userData: Partial<IUser>): Promise<IUser> {
  return await createDocument(User, userData);
}

/**
 * Find a user by ID
 */
export async function findUserById(id: string): Promise<IUser | null> {
  return await findOneDocument(User, { _id: id }, { select: '-password' });
}

/**
 * Find a user by email
 */
export async function findUserByEmail(email: string): Promise<IUser | null> {
  return await findOneDocument(User, { email });
}

/**
 * Update a user
 */
export async function updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
  delete updateData.password; // Don't allow password update via this method
  return await updateDocument(User, { _id: id }, { ...updateData, updatedAt: new Date() });
}

/**
 * Delete a user
 */
export async function deleteUser(id: string): Promise<boolean> {
  return await deleteDocument(User, { _id: id });
}

/**
 * Find all users (with pagination)
 */
export async function findUsers(
  filter: object = {},
  options: {
    sort?: { [key: string]: SortOrder };
    limit?: number;
    page?: number;
    select?: string;
  } = {}
): Promise<{ users: IUser[]; total: number; pages: number }> {
  const { sort = { createdAt: -1 as SortOrder }, limit = 10, page = 1, select = '-password' } = options;
  const skip = (page - 1) * limit;
  
  const [users, total] = await Promise.all([
    findDocuments(User, filter, { sort, limit, skip, select }),
    countDocuments(User, filter)
  ]);
  
  return {
    users,
    total,
    pages: Math.ceil(total / limit)
  };
}

/**
 * Update user eco credits
 */
export async function updateEcoCredits(id: string, amount: number): Promise<IUser | null> {
  return await updateDocument(
    User,
    { _id: id },
    { $inc: { ecoCredits: amount }, updatedAt: new Date() }
  );
}

/**
 * Search users by name or email
 */
export async function searchUsers(query: string): Promise<IUser[]> {
  return await findDocuments(User, {
    $or: [
      { firstName: { $regex: query, $options: 'i' } },
      { lastName: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } }
    ]
  }, { select: '-password' });
}
