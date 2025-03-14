
import express from 'express';
import { MarketplaceItem } from '../../models/MarketplaceItem';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all marketplace items
router.get('/', async (req, res) => {
  try {
    const { category, condition, minPrice, maxPrice, search } = req.query;
    
    // Build filter query
    const filter: any = { isSold: false };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (condition) {
      filter.condition = condition;
    }
    
    if (minPrice) {
      filter.price = { ...filter.price, $gte: Number(minPrice) };
    }
    
    if (maxPrice) {
      filter.price = { ...filter.price, $lte: Number(maxPrice) };
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const items = await MarketplaceItem.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Get marketplace items error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific marketplace item
router.get('/:id', async (req, res) => {
  try {
    const item = await MarketplaceItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Get marketplace item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new marketplace item
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
    
    const item = new MarketplaceItem({
      sellerId: req.user._id,
      title,
      description,
      price,
      ecoCredits,
      imageUrls: imageUrls || [],
      condition,
      category,
      specs,
      isSold: false
    });
    
    await item.save();
    
    res.status(201).json(item);
  } catch (error) {
    console.error('Create marketplace item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a marketplace item
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await MarketplaceItem.findOne({
      _id: req.params.id,
      sellerId: req.user._id
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found or not authorized' });
    }
    
    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (key !== '_id' && key !== 'sellerId' && key !== 'createdAt') {
        item[key] = updates[key];
      }
    });
    
    item.updatedAt = new Date();
    await item.save();
    
    res.json(item);
  } catch (error) {
    console.error('Update marketplace item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark item as sold
router.put('/:id/sold', auth, async (req, res) => {
  try {
    const item = await MarketplaceItem.findOne({
      _id: req.params.id,
      sellerId: req.user._id
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found or not authorized' });
    }
    
    if (item.isSold) {
      return res.status(400).json({ message: 'Item is already marked as sold' });
    }
    
    item.isSold = true;
    item.updatedAt = new Date();
    await item.save();
    
    res.json(item);
  } catch (error) {
    console.error('Mark item as sold error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a marketplace item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await MarketplaceItem.findOne({
      _id: req.params.id,
      sellerId: req.user._id
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found or not authorized' });
    }
    
    await MarketplaceItem.deleteOne({ _id: req.params.id });
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Delete marketplace item error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Seed marketplace with initial items (for development)
router.post('/seed', async (req, res) => {
  try {
    // Check if marketplace is empty
    const count = await MarketplaceItem.countDocuments();
    if (count > 0) {
      return res.status(400).json({ message: 'Marketplace already has items' });
    }
    
    // Seed data
    const seedItems = [
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
      // Add more seed items as needed
    ];
    
    await MarketplaceItem.insertMany(seedItems);
    
    res.status(201).json({ message: 'Marketplace seeded successfully' });
  } catch (error) {
    console.error('Seed marketplace error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
