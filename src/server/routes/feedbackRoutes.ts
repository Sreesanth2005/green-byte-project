
import express from 'express';
import { Feedback } from '../../models/Feedback';
import { auth } from '../middleware/auth';

const router = express.Router();

// Submit feedback
router.post('/', async (req, res) => {
  try {
    const { name, email, message, rating } = req.body;
    let userId;
    
    // If authenticated, add the user ID
    if (req.user) {
      userId = req.user._id;
    }
    
    const feedback = new Feedback({
      userId,
      name,
      email,
      message,
      rating
    });
    
    await feedback.save();
    
    res.status(201).json({
      message: 'Feedback submitted successfully',
      id: feedback._id
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all feedback (admin only)
router.get('/', auth, async (req, res) => {
  try {
    // In a real application, you would check if the user is an admin
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    
    res.json(feedback);
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
