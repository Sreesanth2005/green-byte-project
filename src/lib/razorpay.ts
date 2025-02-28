
// Razorpay payment utilities
import { supabase, Transaction, createTransaction, incrementUserCredits, decrementUserCredits } from './supabase';

// Types
export type PaymentOptions = {
  amount: number; // in rupees, will be converted to paise
  currency?: string;
  name: string;
  description: string;
  userId: string;
  orderId?: string;
  notes?: Record<string, string>;
};

export type ConversionResponse = {
  success: boolean;
  credits?: number;
  rupees?: number;
  error?: string;
};

// Helper to initialize Razorpay
export const initializeRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    
    document.body.appendChild(script);
  });
};

// In a real production app, this would be handled on the server side
// This is a simplified mock for development purposes
export const createPaymentOrder = async (options: PaymentOptions): Promise<string> => {
  try {
    // Mock order ID creation (in production, this would be a server API call)
    const orderId = 'order_' + Math.random().toString(36).substring(2, 15);
    
    console.log('Created mock order:', orderId);
    return orderId;
  } catch (error) {
    console.error('Error creating payment order:', error);
    throw error;
  }
};

// Process payment with Razorpay
export const processPayment = async (options: PaymentOptions): Promise<any> => {
  const rzpInitialized = await initializeRazorpay();
  
  if (!rzpInitialized) {
    throw new Error('Razorpay SDK failed to load');
  }
  
  // Create order ID if not provided
  let orderId = options.orderId;
  if (!orderId) {
    orderId = await createPaymentOrder(options);
  }
  
  // Configure Razorpay options
  const rzpOptions = {
    key: 'rzp_test_aaKWH8yvrWE4yR', // Replace with your actual Razorpay test key
    amount: options.amount * 100, // in paise
    currency: options.currency || 'INR',
    name: options.name,
    description: options.description,
    order_id: orderId,
    handler: function (response: any) {
      // Handle successful payment
      saveTransaction({
        userId: options.userId,
        amount: options.amount,
        paymentId: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        description: options.description,
      });
      
      return response;
    },
    prefill: {
      name: 'User Name', // Would be populated dynamically
      email: 'user@example.com',
      contact: '9999999999',
    },
    notes: options.notes || {},
    theme: {
      color: '#4CAF50',
    },
  };
  
  // Create Razorpay instance and open payment modal
  return new Promise((resolve, reject) => {
    const rzp = new (window as any).Razorpay(rzpOptions);
    
    rzp.on('payment.failed', function (response: any) {
      reject(response.error);
    });
    
    rzp.open();
    
    resolve(rzp);
  });
};

// Save transaction to database
const saveTransaction = async ({
  userId,
  amount,
  paymentId,
  orderId,
  description,
}: {
  userId: string;
  amount: number;
  paymentId: string;
  orderId: string;
  description: string;
}) => {
  try {
    // Calculate credits (10 credits per rupee)
    const credits = amount * 10;
    
    // Create transaction record
    await createTransaction({
      user_id: userId,
      type: 'converted_to_credits',
      amount: credits,
      description,
      payment_id: paymentId,
      order_id: orderId,
    });
    
    // Update user's eco-credits
    await incrementUserCredits(userId, credits);
    
    return true;
  } catch (error) {
    console.error('Error saving transaction:', error);
    throw error;
  }
};

// Convert money to eco-credits
export const convertToEcoCredits = async (
  userId: string,
  rupees: number
): Promise<ConversionResponse> => {
  try {
    if (rupees <= 0) {
      return {
        success: false,
        error: 'Amount must be greater than zero',
      };
    }
    
    // Conversion rate: 1 rupee = 10 eco-credits
    const credits = rupees * 10;
    
    // Process payment first (in a real app, this would wait for payment confirmation)
    await processPayment({
      amount: rupees,
      name: 'Green Byte',
      description: `Convert ₹${rupees} to ${credits} EcoCredits`,
      userId: userId,
      notes: {
        type: 'credit_conversion',
        credits: credits.toString(),
      },
    });
    
    return {
      success: true,
      credits: credits,
    };
  } catch (error) {
    console.error('Error converting to eco-credits:', error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
};

// Convert eco-credits to money 
export const convertToMoney = async (
  userId: string,
  credits: number
): Promise<ConversionResponse> => {
  try {
    if (credits <= 0) {
      return {
        success: false,
        error: 'Credits must be greater than zero',
      };
    }
    
    // Conversion rate: 10 eco-credits = 1 rupee
    const rupees = credits / 10;
    
    // First check if user has enough credits
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('eco_credits')
      .eq('id', userId)
      .single();
    
    if (userError) throw userError;
    
    if (!userData || userData.eco_credits < credits) {
      return {
        success: false,
        error: 'Insufficient eco-credits',
      };
    }
    
    // Decrease user's eco-credits
    await decrementUserCredits(userId, credits);
    
    // Save transaction
    await createTransaction({
      user_id: userId,
      type: 'converted_to_money',
      amount: credits,
      description: `Converted ${credits} EcoCredits to ₹${rupees}`,
    });
    
    // In a real app, this would trigger a bank transfer or payment to the user
    
    return {
      success: true,
      rupees: rupees,
    };
  } catch (error) {
    console.error('Error converting to money:', error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
};

// Purchase product with eco-credits
export const purchaseWithEcoCredits = async (
  userId: string,
  productId: string,
  productName: string,
  creditCost: number
): Promise<ConversionResponse> => {
  try {
    // First check if user has enough credits
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('eco_credits')
      .eq('id', userId)
      .single();
    
    if (userError) throw userError;
    
    if (!userData || userData.eco_credits < creditCost) {
      return {
        success: false,
        error: 'Insufficient eco-credits',
      };
    }
    
    // Get current product stock
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('stock')
      .eq('id', productId)
      .single();
    
    if (productError) throw productError;
    
    if (!productData || productData.stock < 1) {
      return {
        success: false,
        error: 'Product out of stock',
      };
    }
    
    // Decrease user's eco-credits
    await decrementUserCredits(userId, creditCost);
    
    // Update product stock
    await supabase
      .from('products')
      .update({ stock: productData.stock - 1 })
      .eq('id', productId);
    
    // Save transaction
    await createTransaction({
      user_id: userId,
      type: 'spent',
      amount: creditCost,
      description: `Purchased ${productName}`,
    });
    
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error purchasing with eco-credits:', error);
    return {
      success: false,
      error: (error as Error).message,
    };
  }
};
