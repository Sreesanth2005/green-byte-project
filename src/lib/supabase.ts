
import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = 'https://dqzzkycxafylvjghppst.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxenpreWN4YWZ5bHZqZ2hwcHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MzExODQsImV4cCI6MjA1NjMwNzE4NH0.4SyCIDGl57xtW418fTXvipgq2UrOL6WgC5vGUX1hASs';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export type User = {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  eco_credits: number;
  role: 'user' | 'admin';
  phone?: string;
  address?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  eco_credits_price: number;
  stock: number;
  category: string;
  condition: string;
  images: string[];
  created_at: string;
};

export type PickupRequest = {
  id: string;
  user_id: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  items: {
    type: string;
    quantity: number;
    details: string;
  }[];
  pickup_date: string;
  address: string;
  estimated_credits: number;
  actual_credits?: number;
  created_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  type: 'earned' | 'spent' | 'converted_to_credits' | 'converted_to_money';
  amount: number;
  description: string;
  payment_id?: string;
  order_id?: string;
  created_at: string;
};

// Helper functions for data operations
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*');
  
  if (error) throw error;
  return data as User[];
};

export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) throw error;
  return data as Product[];
};

export const getPickupRequests = async () => {
  const { data, error } = await supabase
    .from('pickup_requests')
    .select('*');
  
  if (error) throw error;
  return data as PickupRequest[];
};

export const getTransactions = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*');
  
  if (error) throw error;
  return data as Transaction[];
};

// Get a specific user by ID
export const getUserById = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data as User;
};

// Get a specific product by ID
export const getProductById = async (productId: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();
  
  if (error) throw error;
  return data as Product;
};

// Get pickup requests for a specific user
export const getUserPickupRequests = async (userId: string) => {
  const { data, error } = await supabase
    .from('pickup_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as PickupRequest[];
};

// Get transactions for a specific user
export const getUserTransactions = async (userId: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Transaction[];
};

// Create a new pickup request
export const createPickupRequest = async (pickupRequest: Omit<PickupRequest, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('pickup_requests')
    .insert([pickupRequest])
    .select()
    .single();
  
  if (error) throw error;
  return data as PickupRequest;
};

// Update a product's stock after purchase
export const updateProductStock = async (productId: string, newStock: number) => {
  const { data, error } = await supabase
    .from('products')
    .update({ stock: newStock })
    .eq('id', productId)
    .select()
    .single();
  
  if (error) throw error;
  return data as Product;
};

// Create a new transaction
export const createTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()
    .single();
  
  if (error) throw error;
  return data as Transaction;
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data as User;
};

// Analytics helpers
export const getEWasteStats = async () => {
  const { data, error } = await supabase
    .rpc('get_ewaste_stats');
  
  if (error) throw error;
  return data;
};

// Increment a user's eco_credits
export const incrementUserCredits = async (userId: string, amount: number) => {
  const { data, error } = await supabase
    .rpc('increment_credits', { user_id: userId, amount });
  
  if (error) throw error;
  return data as number; // Returns the new credit balance
};

// Decrement a user's eco_credits
export const decrementUserCredits = async (userId: string, amount: number) => {
  const { data, error } = await supabase
    .rpc('decrement_credits', { user_id: userId, amount });
  
  if (error) throw error;
  return data as number; // Returns the new credit balance
};
