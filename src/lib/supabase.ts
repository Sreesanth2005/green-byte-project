
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase credentials when connecting
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseAnonKey = 'your-anon-key';

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

// Analytics helpers
export const getEWasteStats = async () => {
  const { data, error } = await supabase
    .rpc('get_ewaste_stats');
  
  if (error) throw error;
  return data;
};
