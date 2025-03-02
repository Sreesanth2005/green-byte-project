
import { supabase } from './supabaseClient';

// Function to generate eco tips using Gemini AI
export const generateEcoTip = async (category: string = 'recycling') => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-eco-tips', {
      body: { category },
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error generating eco tip:', error);
    throw error;
  }
};

// Function to analyze recycling impact using Gemini AI
export const analyzeRecyclingImpact = async (
  userId?: string, 
  category: string = 'all', 
  timeFrame: string = 'all'
) => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-recycling-impact', {
      body: { userId, category, timeFrame },
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error analyzing recycling impact:', error);
    throw error;
  }
};

// Function to get random eco tips from the database
export const getRandomEcoTips = async (limit: number = 5) => {
  try {
    const { data, error } = await supabase
      .from('eco_tips')
      .select('*')
      .limit(limit)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching eco tips:', error);
    throw error;
  }
};
