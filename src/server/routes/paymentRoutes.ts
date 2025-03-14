
import express from 'express';
import { User } from '../../models/User';
import { Transaction } from '../../models/Transaction';
import { auth } from '../middleware/auth';

const router = express.Router();

// Process add credits request
router.post('/add-credits', auth, async (req, res) => {
  try {
    const { amount, paymentMethod, otp } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    
    // In a real application, you would verify the OTP
    // and process the payment through a payment gateway
    
    // Convert money to eco credits
    const ecoCreditsToAdd = amount * 100; // 1 USD = 100 eco credits
    
    // Update user's eco credits
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.ecoCredits += ecoCreditsToAdd;
    user.updatedAt = new Date();
    await user.save();
    
    // Record the transaction
    const transaction = new Transaction({
      userId: req.user._id,
      type: 'credit',
      amount: ecoCreditsToAdd,
      description: `Added ${ecoCreditsToAdd} eco credits via ${paymentMethod}`,
      paymentReference: `PAY-${Date.now()}`,
      status: 'completed'
    });
    
    await transaction.save();
    
    res.json({
      success: true,
      message: 'Eco credits added successfully',
      newBalance: user.ecoCredits
    });
  } catch (error) {
    console.error('Add credits error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Process withdraw credits request
router.post('/withdraw-credits', auth, async (req, res) => {
  try {
    const { amount, accountNumber, upiId, otp } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }
    
    // In a real application, you would verify the OTP
    
    // Check if user has enough eco credits
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.ecoCredits < amount) {
      return res.status(400).json({ message: 'Insufficient eco credits' });
    }
    
    // Convert eco credits to money
    const moneyToWithdraw = amount / 100; // 100 eco credits = 1 USD
    
    // Update user's eco credits
    user.ecoCredits -= amount;
    user.updatedAt = new Date();
    await user.save();
    
    // Record the transaction
    const transaction = new Transaction({
      userId: req.user._id,
      type: 'debit',
      amount: amount,
      description: `Withdrew ${amount} eco credits ($${moneyToWithdraw})`,
      paymentReference: accountNumber || upiId || `WIT-${Date.now()}`,
      status: 'processing' // In a real app, this would be updated once the money transfer is complete
    });
    
    await transaction.save();
    
    res.json({
      success: true,
      message: 'Withdrawal processed successfully',
      newBalance: user.ecoCredits
    });
  } catch (error) {
    console.error('Withdraw credits error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's transaction history
router.get('/transactions', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
