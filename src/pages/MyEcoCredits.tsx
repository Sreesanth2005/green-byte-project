
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Coins, TrendingUp, Recycle, Award } from "lucide-react";

const MyEcoCredits = () => {
  const transactions = [
    {
      id: 1,
      type: "Earned",
      amount: 50,
      description: "Recycled Laptop",
      date: "2024-03-01",
    },
    {
      id: 2,
      type: "Spent",
      amount: 20,
      description: "Marketplace Purchase",
      date: "2024-02-28",
    },
    // Add more transactions as needed
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Total Credits</h3>
              <Coins className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold">1,250</p>
            <p className="text-sm text-gray-600">Available to spend</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Monthly Earned</h3>
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <p className="text-3xl font-bold">320</p>
            <p className="text-sm text-gray-600">This month</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Items Recycled</h3>
              <Recycle className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold">15</p>
            <p className="text-sm text-gray-600">Total items</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Current Level</h3>
              <Award className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold">Gold</p>
            <p className="text-sm text-gray-600">250 to next level</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Transaction History</h2>
          </div>
          <div className="divide-y">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-6 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{transaction.description}</p>
                  <p className="text-sm text-gray-600">{transaction.date}</p>
                </div>
                <div className={`text-lg font-semibold ${transaction.type === 'Earned' ? 'text-success' : 'text-destructive'}`}>
                  {transaction.type === 'Earned' ? '+' : '-'}{transaction.amount} credits
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyEcoCredits;
