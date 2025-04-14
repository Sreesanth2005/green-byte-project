
import mockDatabase from '@/utils/mockDatabase';

// Since these functions were referenced in components, we'll implement them
// using our mock database so they work with the existing code

export const getRandomEcoTips = async (count: number = 5) => {
  const { ecoTips } = mockDatabase.getAllEcoTips();
  
  // Randomly select tips up to the count requested
  const shuffled = [...ecoTips].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);
  
  // Format them for the components that use this function
  return selected.map(tip => ({
    tip: tip.content,
    category: tip.category,
    impact: tip.impact
  }));
};

export const analyzeRecyclingImpact = async (
  userId: string | undefined,
  category: string,
  timeFrame: string
) => {
  // Generate mock analysis text
  const analysisText = `Based on your ${timeFrame} recycling data for ${category === 'all' ? 'all categories' : category}:

You've recycled approximately 24.5 kg of e-waste, which has:
• Prevented 85 kg of CO2 emissions (equivalent to planting 4 trees)
• Recovered valuable materials including 0.5g of gold and 25g of copper
• Saved 120 gallons of water that would have been used in new production

Your recycling efforts rank in the top 25% of our Green Byte community. Keep up the great work!

Recommendations:
1. Consider recycling smaller electronics like chargers and cables
2. Join our next community e-waste drive for additional EcoCredits
3. Explore our marketplace for refurbished electronics to complete the cycle`;

  return {
    analysis: analysisText,
    stats: {
      totalPickups: 12,
      ecoCreditsEarned: 3500,
      categoryCounts: {
        "electronics": 8,
        "plastic": 3,
        "glass": 1
      }
    }
  };
};
