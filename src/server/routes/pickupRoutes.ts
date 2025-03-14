
import express from 'express';
import { SchedulePickup } from '../../models/SchedulePickup';
import { User } from '../../models/User';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all pickups for a user
router.get('/', auth, async (req, res) => {
  try {
    const pickups = await SchedulePickup.find({ userId: req.user._id });
    res.json(pickups);
  } catch (error) {
    console.error('Get pickups error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific pickup
router.get('/:id', auth, async (req, res) => {
  try {
    const pickup = await SchedulePickup.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup not found' });
    }
    
    res.json(pickup);
  } catch (error) {
    console.error('Get pickup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Schedule a new pickup
router.post('/', auth, async (req, res) => {
  try {
    const {
      category,
      pickupDate,
      pickupTime,
      address,
      firstName,
      lastName,
      email,
      phone,
      imageUrls
    } = req.body;
    
    const pickup = new SchedulePickup({
      userId: req.user._id,
      category,
      pickupDate,
      pickupTime,
      address,
      firstName,
      lastName,
      email,
      phone,
      imageUrls: imageUrls || [],
      status: 'pending'
    });
    
    await pickup.save();
    
    res.status(201).json(pickup);
  } catch (error) {
    console.error('Schedule pickup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a pickup
router.put('/:id', auth, async (req, res) => {
  try {
    const pickup = await SchedulePickup.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup not found' });
    }
    
    // Don't allow updating if already completed or cancelled
    if (pickup.status === 'completed' || pickup.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot update a completed or cancelled pickup' });
    }
    
    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (key !== '_id' && key !== 'userId' && key !== 'createdAt') {
        pickup[key] = updates[key];
      }
    });
    
    pickup.updatedAt = new Date();
    await pickup.save();
    
    res.json(pickup);
  } catch (error) {
    console.error('Update pickup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel a pickup
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const pickup = await SchedulePickup.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup not found' });
    }
    
    // Don't allow cancelling if already completed or cancelled
    if (pickup.status === 'completed' || pickup.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot cancel a completed or already cancelled pickup' });
    }
    
    pickup.status = 'cancelled';
    pickup.updatedAt = new Date();
    await pickup.save();
    
    res.json(pickup);
  } catch (error) {
    console.error('Cancel pickup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin route: Complete a pickup and award eco credits
router.put('/:id/complete', auth, async (req, res) => {
  try {
    // In a real application, you would check if the user is an admin
    const { ecoCreditsEarned } = req.body;
    
    if (!ecoCreditsEarned || ecoCreditsEarned <= 0) {
      return res.status(400).json({ message: 'Eco credits earned must be a positive number' });
    }
    
    const pickup = await SchedulePickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup not found' });
    }
    
    // Don't allow completing if already completed or cancelled
    if (pickup.status === 'completed' || pickup.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot complete a pickup that is already completed or cancelled' });
    }
    
    // Update pickup status
    pickup.status = 'completed';
    pickup.ecoCreditsEarned = ecoCreditsEarned;
    pickup.updatedAt = new Date();
    await pickup.save();
    
    // Award eco credits to user
    const user = await User.findById(pickup.userId);
    if (user) {
      user.ecoCredits += ecoCreditsEarned;
      user.updatedAt = new Date();
      await user.save();
    }
    
    res.json(pickup);
  } catch (error) {
    console.error('Complete pickup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
