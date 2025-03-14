
import express from 'express';
import { SchedulePickup } from '../../models/SchedulePickup';
import { User } from '../../models/User';
import { auth } from '../middleware/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Get recycling analysis
router.post('/recycling-impact', auth, async (req, res) => {
  try {
    const { category, timeFrame } = req.body;
    const userId = req.user._id;
    
    // Get user data
    const user = await User.findById(userId).select('-password');
    
    // Get pickup data with filters
    let query: any = { userId };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (timeFrame) {
      const now = new Date();
      let fromDate = new Date();
      
      if (timeFrame === 'week') {
        fromDate.setDate(now.getDate() - 7);
      } else if (timeFrame === 'month') {
        fromDate.setMonth(now.getMonth() - 1);
      } else if (timeFrame === 'year') {
        fromDate.setFullYear(now.getFullYear() - 1);
      }
      
      query.pickupDate = { $gte: fromDate };
    }
    
    const pickups = await SchedulePickup.find(query);
    
    // Calculate statistics
    const totalPickups = pickups.length;
    const ecoCreditsEarned = pickups.reduce((sum, pickup) => 
      sum + (pickup.ecoCreditsEarned || 0), 0);
    
    // Categorize pickups
    const categoryCounts = pickups.reduce((acc, pickup) => {
      acc[pickup.category] = (acc[pickup.category] || 0) + 1;
      return acc;
    }, {});
    
    // Generate analysis using Gemini AI
    const API_KEY = 'AIzaSyAuRC8nEx9CZ1220iOnliDpde5jOR-zgk0';
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const analysisPrompt = `
    Analyze the following recycling data and provide insights:
    
    User: ${user ? `${user.firstName} ${user.lastName}` : 'Anonymous'}
    Total Eco Credits: ${user ? user.ecoCredits : 0}
    
    Recycling Summary:
    - Total Pickups: ${totalPickups}
    - Categories: ${JSON.stringify(categoryCounts)}
    - Total Eco Credits Earned from Recycling: ${ecoCreditsEarned}
    - Time Period: ${timeFrame || "all time"}
    
    Please provide the following:
    1. A brief summary of the recycling impact
    2. Environmental benefits (CO2 reduction, water saved, trees saved, etc.)
    3. Suggestions for improvement
    4. A motivational message
    `;
    
    const result = await model.generateContent(analysisPrompt);
    const analysisText = result.response.text();
    
    res.json({
      analysis: analysisText,
      stats: {
        totalPickups,
        ecoCreditsEarned,
        categoryCounts
      }
    });
  } catch (error) {
    console.error('Recycling analysis error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
