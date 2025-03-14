
import express from 'express';
import { EcoTip } from '../../models/EcoTip';
import { auth } from '../middleware/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Get eco tips
router.get('/', async (req, res) => {
  try {
    const { count = 5, category } = req.query;
    
    let query = {};
    if (category) {
      query = { category };
    }
    
    const tips = await EcoTip.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(count));
    
    res.json(tips);
  } catch (error) {
    console.error('Get eco tips error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate a new eco tip
router.post('/generate', auth, async (req, res) => {
  try {
    const { category = 'recycling' } = req.body;
    
    // Replace with your actual API key
    const API_KEY = 'AIzaSyAuRC8nEx9CZ1220iOnliDpde5jOR-zgk0';
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Generate eco tip
    const prompt = `Generate a practical, concise eco-friendly tip related to ${category}. 
    The tip should be actionable, informative, and approximately 1-2 sentences long. 
    Focus on something that the average person can do to be more environmentally conscious.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Save to database
    const ecoTip = new EcoTip({
      tip: text,
      category
    });
    
    await ecoTip.save();
    
    res.status(201).json({
      tip: text,
      id: ecoTip._id
    });
  } catch (error) {
    console.error('Generate eco tip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
