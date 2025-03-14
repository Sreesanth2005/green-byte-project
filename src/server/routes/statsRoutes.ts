
import express from 'express';
import { User } from '../../models/User';
import { MarketplaceItem } from '../../models/MarketplaceItem';
import { Transaction } from '../../models/Transaction';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get database statistics
router.get('/', auth, async (req, res) => {
  try {
    // Aggregate statistics
    const [totalUsers, totalItems, salesStats, creditsStats] = await Promise.all([
      User.countDocuments(),
      MarketplaceItem.countDocuments(),
      Transaction.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      User.aggregate([
        { $group: { _id: null, total: { $sum: '$ecoCredits' } } }
      ])
    ]);
    
    // Extract values from aggregation results
    const totalSales = salesStats.length > 0 ? salesStats[0].total : 0;
    const totalEcoCredits = creditsStats.length > 0 ? creditsStats[0].total : 0;
    
    res.json({
      totalUsers,
      totalItems,
      totalSales,
      totalEcoCredits
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user growth data for charts
router.get('/user-growth', auth, async (req, res) => {
  try {
    // Get user signups by month for the last 12 months
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' }, 
            month: { $month: '$createdAt' } 
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);
    
    // Format data for chart display
    const formattedData = userGrowth.map(item => ({
      date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
      users: item.count
    }));
    
    res.json(formattedData);
  } catch (error) {
    console.error('User growth stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get marketplace activity data
router.get('/marketplace-activity', auth, async (req, res) => {
  try {
    // Get items listed and sold per month
    const marketplaceActivity = await MarketplaceItem.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)) }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: '$createdAt' }, 
            month: { $month: '$createdAt' },
            sold: '$isSold'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);
    
    // Process data to get listed vs sold by month
    const months: { [key: string]: { listed: number, sold: number } } = {};
    
    marketplaceActivity.forEach(item => {
      const monthKey = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
      
      if (!months[monthKey]) {
        months[monthKey] = { listed: 0, sold: 0 };
      }
      
      if (item._id.sold) {
        months[monthKey].sold += item.count;
      }
      
      // All items are listed, so add to listed count regardless of sold status
      months[monthKey].listed += item.count;
    });
    
    // Format for chart display
    const formattedData = Object.keys(months).map(month => ({
      date: month,
      listed: months[month].listed,
      sold: months[month].sold
    }));
    
    res.json(formattedData);
  } catch (error) {
    console.error('Marketplace activity stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
