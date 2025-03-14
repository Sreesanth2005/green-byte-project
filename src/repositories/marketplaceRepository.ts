
import { MarketplaceItem, IMarketplaceItem } from '../models/MarketplaceItem';
import {
  createDocument,
  findDocuments,
  findOneDocument,
  updateDocument,
  deleteDocument,
  countDocuments,
  aggregate
} from '../lib/mongodbUtils';
import { PipelineStage } from 'mongoose';

/**
 * Create a new marketplace item
 */
export async function createItem(itemData: Partial<IMarketplaceItem>): Promise<IMarketplaceItem> {
  return await createDocument(MarketplaceItem, itemData);
}

/**
 * Find an item by ID
 */
export async function findItemById(id: string): Promise<IMarketplaceItem | null> {
  return await findOneDocument(MarketplaceItem, { _id: id });
}

/**
 * Find items with filtering, sorting and pagination
 */
export async function findItems(
  filter: object = {},
  options: {
    sort?: { [key: string]: number };
    limit?: number;
    page?: number;
    select?: string;
  } = {}
): Promise<{ items: IMarketplaceItem[]; total: number; pages: number }> {
  const { sort = { createdAt: -1 }, limit = 12, page = 1, select } = options;
  const skip = (page - 1) * limit;
  
  const [items, total] = await Promise.all([
    findDocuments(MarketplaceItem, filter, { sort, limit, skip, select }),
    countDocuments(MarketplaceItem, filter)
  ]);
  
  return {
    items,
    total,
    pages: Math.ceil(total / limit)
  };
}

/**
 * Update an item
 */
export async function updateItem(
  id: string,
  sellerId: string,
  updateData: Partial<IMarketplaceItem>
): Promise<IMarketplaceItem | null> {
  return await updateDocument(
    MarketplaceItem,
    { _id: id, sellerId },
    { ...updateData, updatedAt: new Date() }
  );
}

/**
 * Mark an item as sold
 */
export async function markAsSold(id: string, sellerId: string): Promise<IMarketplaceItem | null> {
  return await updateDocument(
    MarketplaceItem,
    { _id: id, sellerId },
    { isSold: true, updatedAt: new Date() }
  );
}

/**
 * Delete an item
 */
export async function deleteItem(id: string, sellerId: string): Promise<boolean> {
  return await deleteDocument(MarketplaceItem, { _id: id, sellerId });
}

/**
 * Search items by title or description
 */
export async function searchItems(query: string): Promise<IMarketplaceItem[]> {
  return await findDocuments(MarketplaceItem, {
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ],
    isSold: false
  });
}

/**
 * Get items by category with pagination
 */
export async function getItemsByCategory(
  category: string,
  page = 1,
  limit = 12
): Promise<{ items: IMarketplaceItem[]; total: number; pages: number }> {
  return await findItems(
    { category, isSold: false },
    { page, limit, sort: { createdAt: -1 } }
  );
}

/**
 * Get aggregate statistics about marketplace items
 */
export async function getMarketplaceStats(): Promise<any> {
  const pipeline: PipelineStage[] = [
    {
      $facet: {
        categoryStats: [
          { $group: { _id: "$category", count: { $sum: 1 }, avgPrice: { $avg: "$price" } } },
          { $sort: { count: -1 } }
        ],
        conditionStats: [
          { $group: { _id: "$condition", count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ],
        priceRange: [
          { $group: { _id: null, min: { $min: "$price" }, max: { $max: "$price" }, avg: { $avg: "$price" } } }
        ],
        totalItems: [
          { $count: "count" }
        ],
        soldItems: [
          { $match: { isSold: true } },
          { $count: "count" }
        ]
      }
    }
  ];
  
  return await aggregate(MarketplaceItem, pipeline);
}
