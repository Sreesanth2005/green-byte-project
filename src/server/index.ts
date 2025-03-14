
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToDatabase } from '../lib/mongodbClient';
import userRoutes from './routes/userRoutes';
import marketplaceRoutes from './routes/marketplaceRoutes';
import eventRoutes from './routes/eventRoutes';
import pickupRoutes from './routes/pickupRoutes';
import paymentRoutes from './routes/paymentRoutes';
import analysisRoutes from './routes/analysisRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import ecoTipRoutes from './routes/ecoTipRoutes';
import statsRoutes from './routes/statsRoutes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectToDatabase().catch(err => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/eco-tips', ecoTipRoutes);
app.use('/api/stats', statsRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
