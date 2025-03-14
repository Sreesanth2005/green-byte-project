
import express from 'express';
import cors from 'cors';
import { connectToDatabase } from '../lib/mongodbClient';
import userRoutes from './routes/userRoutes';
import pickupRoutes from './routes/pickupRoutes';
import marketplaceRoutes from './routes/marketplaceRoutes';
import eventRoutes from './routes/eventRoutes';
import ecoTipRoutes from './routes/ecoTipRoutes';
import analysisRoutes from './routes/analysisRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import paymentRoutes from './routes/paymentRoutes';

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectToDatabase();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/eco-tips', ecoTipRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/payments', paymentRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
