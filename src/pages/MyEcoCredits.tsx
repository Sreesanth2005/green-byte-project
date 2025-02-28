
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coins, TrendingUp, Recycle, Award, ArrowRight, ArrowLeft } from "lucide-react";

const MyEcoCredits = () => {
  const [rupeeAmount, setRupeeAmount] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [convertionType, setConvertionType] = useState<"toCredits" | "toRupees">("toCredits");

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
    {
      id: 3,
      type: "Added",
      amount: 100,
      description: "Rupees Conversion (₹10)",
      date: "2024-02-25",
    },
    {
      id: 4,
      type: "Withdrawn",
      amount: 50,
      description: "Converted to Rupees (₹5)",
      date: "2024-02-20",
    },
  ];

  const handleRupeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setRupeeAmount(value);
    // 1 Rupee = 10 EcoCredits
    setCreditAmount(value ? (parseInt(value) * 10).toString() : "");
  };

  const handleCreditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setCreditAmount(value);
    // 10 EcoCredits = 1 Rupee
    setRupeeAmount(value ? (parseInt(value) / 10).toString() : "");
  };

  const handleConvert = () => {
    // This would handle the actual conversion in a real app
    console.log(convertionType === "toCredits" 
      ? `Converting ₹${rupeeAmount} to ${creditAmount} EcoCredits` 
      : `Converting ${creditAmount} EcoCredits to ₹${rupeeAmount}`
    );
    
    // Reset form
    setRupeeAmount("");
    setCreditAmount("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-8">My EcoCredits</h1>

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

        {/* Currency Converter */}
        <div className="bg-white rounded-2xl shadow-sm mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Convert Currency</h2>
            <p className="text-sm text-gray-600 mt-1">1 Rupee = 10 EcoCredits</p>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {convertionType === "toCredits" ? "Rupees (₹)" : "EcoCredits"}
                </label>
                <Input
                  type="text"
                  placeholder={convertionType === "toCredits" ? "Enter amount in Rupees" : "Enter amount in EcoCredits"}
                  value={convertionType === "toCredits" ? rupeeAmount : creditAmount}
                  onChange={convertionType === "toCredits" ? handleRupeeChange : handleCreditChange}
                  className="w-full"
                />
              </div>
              
              <div className="md:pt-6">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setConvertionType(convertionType === "toCredits" ? "toRupees" : "toCredits")}
                  className="mx-auto block"
                >
                  {convertionType === "toCredits" ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="relative w-full">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {convertionType === "toCredits" ? "EcoCredits" : "Rupees (₹)"}
                </label>
                <Input
                  type="text"
                  placeholder={convertionType === "toCredits" ? "Equivalent EcoCredits" : "Equivalent Rupees"}
                  value={convertionType === "toCredits" ? creditAmount : rupeeAmount}
                  onChange={convertionType === "toCredits" ? handleCreditChange : handleRupeeChange}
                  className="w-full"
                />
              </div>
              
              <div className="md:pt-6">
                <Button onClick={handleConvert} className="whitespace-nowrap">
                  Convert Now
                </Button>
              </div>
            </div>
            
            <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              <p className="font-medium mb-2">How it works:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>EcoCredits can be used to purchase refurbished electronics on our marketplace.</li>
                <li>You can earn EcoCredits by recycling your old electronics or by converting money.</li>
                <li>EcoCredits can also be converted back to money when you have a sufficient balance.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Transaction History */}
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
                <div className={`text-lg font-semibold ${
                  transaction.type === 'Earned' || transaction.type === 'Added' 
                    ? 'text-success' 
                    : 'text-destructive'
                }`}>
                  {transaction.type === 'Earned' || transaction.type === 'Added' 
                    ? '+' 
                    : '-'}{transaction.amount} credits
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
