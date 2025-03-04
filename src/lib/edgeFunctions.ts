
import { supabase } from './supabaseClient';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with the provided API key
const genAI = new GoogleGenerativeAI("AIzaSyAuRC8nEx9CZ1220iOnliDpde5jOR-zgk0");

export const analyzeRecyclingImpact = async (userId: string | undefined, category: string, timeFrame: string) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Get user recycling data from Supabase if user is logged in
    let recyclingData = null;
    if (userId) {
      const { data, error } = await supabase
        .from('recycling_stats')
        .select('*')
        .eq('user_id', userId);
      
      if (!error) {
        recyclingData = data;
      }
    }
    
    // Create a prompt for Gemini AI
    const prompt = `
    As an environmental impact analyst for Green Byte, generate an analysis of the user's e-waste recycling impact.
    
    ${recyclingData ? `Here is the user's recycling data: ${JSON.stringify(recyclingData)}` : 'The user does not have specific recycling data yet.'}
    Category filter: ${category}
    Time period: ${timeFrame}
    
    Please provide an analysis that includes:
    1. Environmental impact (CO2 saved, water saved, energy saved)
    2. Resources recovered (metals, plastics, etc.)
    3. Comparison to average recycling habits
    4. Suggestions for improving recycling habits
    
    Keep the response concise, informative, and motivational.
    `;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    return { analysis: response.text() };
  } catch (error) {
    console.error("Error analyzing recycling impact:", error);
    throw error;
  }
};

export const getRandomEcoTips = async (count: number = 5) => {
  try {
    const { data, error } = await supabase
      .from('eco_tips')
      .select('*')
      .order('id', { ascending: false })
      .limit(count);
      
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error fetching eco tips:", error);
    throw error;
  }
};
