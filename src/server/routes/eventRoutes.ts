
import express from 'express';
import { Event } from '../../models/Event';
import { EventRegistration } from '../../models/EventRegistration';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register for an event
router.post('/:id/register', auth, async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    
    // Check if event exists
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if event is full
    if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' });
    }
    
    // Check if user is already registered
    const existingRegistration = await EventRegistration.findOne({
      eventId: req.params.id,
      userId: req.user._id
    });
    
    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }
    
    // Create registration
    const registration = new EventRegistration({
      eventId: req.params.id,
      userId: req.user._id,
      firstName,
      lastName,
      email,
      phone
    });
    
    await registration.save();
    
    // Update event participant count
    event.currentParticipants += 1;
    await event.save();
    
    res.status(201).json({
      message: 'Successfully registered for event',
      registration
    });
  } catch (error) {
    console.error('Event registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel event registration
router.delete('/:id/register', auth, async (req, res) => {
  try {
    // Check if event exists
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    // Check if user is registered
    const registration = await EventRegistration.findOne({
      eventId: req.params.id,
      userId: req.user._id
    });
    
    if (!registration) {
      return res.status(400).json({ message: 'You are not registered for this event' });
    }
    
    // Delete registration
    await EventRegistration.deleteOne({ _id: registration._id });
    
    // Update event participant count
    if (event.currentParticipants > 0) {
      event.currentParticipants -= 1;
      await event.save();
    }
    
    res.json({
      message: 'Successfully canceled registration'
    });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's registered events
router.get('/user/registered', auth, async (req, res) => {
  try {
    const registrations = await EventRegistration.find({ userId: req.user._id });
    
    const eventIds = registrations.map(reg => reg.eventId);
    const events = await Event.find({ _id: { $in: eventIds } }).sort({ date: 1 });
    
    res.json(events);
  } catch (error) {
    console.error('Get registered events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
