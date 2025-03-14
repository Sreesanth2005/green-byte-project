
import express from 'express';
import { auth } from '../middleware/auth';
import * as marketplaceRepo from '../../repositories/marketplaceRepository';
import * as userRepo from '../../repositories/userRepository';
import mongoose from 'mongoose';

const router = express.Router();

// Get marketplace items with efficient filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      condition, 
      minPrice, 
      maxPrice, 
      search,
      sort = 'newest',
      page = 1,
      limit = 12
    } = req.query;
    
    // Build filter
    const filter: any = { isSold: false };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (condition) {
      filter.condition = condition;
    }
    
    // Handle price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    // Handle search
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Handle sorting
    let sortOption = {};
    switch (sort) {
      case 'priceAsc':
        sortOption = { price: 1 };
        break;
      case 'priceDesc':
        sortOption = { price: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'newest':
      default:
        sortOption = { createdAt: -1 };
    }
    
    // Get items with pagination
    const result = await marketplaceRepo.findItems(
      filter, 
      { 
        sort: sortOption, 
        page: Number(page), 
        limit: Number(limit) 
      }
    );
    
    // Add metadata to response
    res.json({
      items: result.items,
      pagination: {
        total: result.total,
        pages: result.pages,
        currentPage: Number(page),
        hasMore: Number(page) < result.pages
      }
    });
  } catch (error) {
    console.error('Get marketplace items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get marketplace stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await marketplaceRepo.getMarketplaceStats();
    res.json(stats[0]);
  } catch (error) {
    console.error('Get marketplace stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific item with efficient retrieval
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid item ID' });
    }
    
    const item = await marketplaceRepo.findItemById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Get marketplace item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new item with validation
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      ecoCredits,
      imageUrls,
      condition,
      category,
      specs
    } = req.body;
    
    // Basic validation
    if (!title || !price || !category) {
      return res.status(400).json({ message: 'Title, price and category are required' });
    }
    
    const newItem = await marketplaceRepo.createItem({
      sellerId: req.user._id,
      title,
      description,
      price: Number(price),
      ecoCredits: Number(ecoCredits || 0),
      imageUrls: imageUrls || [],
      condition,
      category,
      specs: specs || [],
      isSold: false
    });
    
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Create marketplace item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an item efficiently
router.put('/:id', auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid item ID' });
    }
    
    const updates = req.body;
    // Prevent updating critical fields
    delete updates._id;
    delete updates.sellerId;
    delete updates.createdAt;
    
    const updatedItem = await marketplaceRepo.updateItem(
      req.params.id,
      req.user._id.toString(),
      updates
    );
    
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found or not authorized' });
    }
    
    res.json(updatedItem);
  } catch (error) {
    console.error('Update marketplace item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark item as sold with efficient update
router.put('/:id/sold', auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid item ID' });
    }
    
    const updatedItem = await marketplaceRepo.markAsSold(
      req.params.id,
      req.user._id.toString()
    );
    
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found or not authorized' });
    }
    
    res.json(updatedItem);
  } catch (error) {
    console.error('Mark item as sold error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an item with validation
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid item ID' });
    }
    
    const result = await marketplaceRepo.deleteItem(
      req.params.id,
      req.user._id.toString()
    );
    
    if (!result) {
      return res.status(404).json({ message: 'Item not found or not authorized' });
    }
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete marketplace item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
