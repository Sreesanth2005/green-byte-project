
// Razorpay payment utilities
import { supabase, Transaction } from './supabase';

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

// Create payment order
export const createPaymentOrder = async (options: PaymentOptions): Promise<string> => {
  try {
    // In a real implementation, this would be a secure server-side call
    const response = await fetch('/api/create-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: options.amount * 100, // Convert to paise
        currency: options.currency || 'INR',
        notes: options.notes,
      }),
    });
    
    const data = await response.json();
    
    if (!data.id) {
      throw new Error('Failed to create payment order');
    }
    
    return data.id;
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
    key: 'rzp_test_your_key_here', // Replace with your Razorpay key
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
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'converted_to_credits',
        amount: amount,
        description: description,
        payment_id: paymentId,
        order_id: orderId,
        created_at: new Date().toISOString(),
      });
    
    if (error) throw error;
    return data;
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
    // Conversion rate: 1 rupee = 10 eco-credits
    const credits = rupees * 10;
    
    // Process payment first
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
    
    // Update user's eco-credits in database
    const { data, error } = await supabase
      .from('users')
      .update({ 
        eco_credits: supabase.rpc('increment_credits', { amount: credits }) 
      })
      .eq('id', userId);
    
    if (error) throw error;
    
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
    // Conversion rate: 10 eco-credits = 1 rupee
    const rupees = credits / 10;
    
    // First check if user has enough credits
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('eco_credits')
      .eq('id', userId)
      .single();
    
    if (userError) throw userError;
    
    if (userData.eco_credits < credits) {
      return {
        success: false,
        error: 'Insufficient eco-credits',
      };
    }
    
    // Update user's eco-credits in database
    const { error } = await supabase
      .from('users')
      .update({ 
        eco_credits: supabase.rpc('decrement_credits', { amount: credits }) 
      })
      .eq('id', userId);
    
    if (error) throw error;
    
    // Save transaction
    await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'converted_to_money',
        amount: credits,
        description: `Converted ${credits} EcoCredits to ₹${rupees}`,
        created_at: new Date().toISOString(),
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
