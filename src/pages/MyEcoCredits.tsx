
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coins, TrendingUp, Recycle, Award, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const MyEcoCredits = () => {
  const [rupeeAmount, setRupeeAmount] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [convertionType, setConvertionType] = useState<"toCredits" | "toRupees">("toCredits");
  const [totalCredits, setTotalCredits] = useState(0);
  const [monthlyEarned, setMonthlyEarned] = useState(0);
  const [itemsRecycled, setItemsRecycled] = useState(0);
  const [currentLevel, setCurrentLevel] = useState("Bronze");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to view your EcoCredits.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    fetchUserData();
    fetchTransactions();
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profileError) throw profileError;
      
      if (profile) {
        setTotalCredits(profile.eco_credits || 0);
        setCurrentLevel(profile.level || "Bronze");
      }
      
      // Count recycled items
      const { count: recycledCount, error: recycledError } = await supabase
        .from('schedule_pickups')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
        
      if (recycledError) throw recycledError;
      
      setItemsRecycled(recycledCount || 0);
      
      // Calculate monthly earned
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      firstDayOfMonth.setHours(0, 0, 0, 0);
      
      const { data: monthlyData, error: monthlyError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'Earned')
        .gte('created_at', firstDayOfMonth.toISOString());
        
      if (monthlyError) throw monthlyError;
      
      const monthlyTotal = monthlyData?.reduce((sum, transaction) => sum + transaction.amount, 0) || 0;
      setMonthlyEarned(monthlyTotal);
      
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

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

  const handleConvert = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to convert currency.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (!rupeeAmount || !creditAmount) {
      toast({
        title: "Amount required",
        description: "Please enter an amount to convert.",
        variant: "destructive",
      });
      return;
    }
    
    const credits = parseInt(creditAmount);
    
    try {
      setLoading(true);
      
      if (convertionType === "toCredits") {
        // Add credits to user's account
        const { error: updateError } = await supabase.rpc('add_eco_credits', {
          user_id: user.id,
          amount: credits
        });
        
        if (updateError) throw updateError;
        
        // Create transaction record
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert([
            {
              user_id: user.id,
              type: 'Added',
              amount: credits,
              description: `Rupees Conversion (₹${rupeeAmount})`
            }
          ]);
          
        if (transactionError) throw transactionError;
        
        toast({
          title: "Conversion successful",
          description: `You've converted ₹${rupeeAmount} to ${creditAmount} EcoCredits`,
        });
      } else {
        // Check if user has enough credits
        if (credits > totalCredits) {
          toast({
            title: "Insufficient credits",
            description: "You don't have enough EcoCredits for this conversion.",
            variant: "destructive",
          });
          return;
        }
        
        // Remove credits from user's account
        const { error: updateError } = await supabase.rpc('add_eco_credits', {
          user_id: user.id,
          amount: -credits
        });
        
        if (updateError) throw updateError;
        
        // Create transaction record
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert([
            {
              user_id: user.id,
              type: 'Withdrawn',
              amount: credits,
              description: `Converted to Rupees (₹${rupeeAmount})`
            }
          ]);
          
        if (transactionError) throw transactionError;
        
        toast({
          title: "Conversion successful",
          description: `You've converted ${creditAmount} EcoCredits to ₹${rupeeAmount}`,
        });
      }
      
      // Refresh data
      fetchUserData();
      fetchTransactions();
      
      // Reset form
      setRupeeAmount("");
      setCreditAmount("");
      
    } catch (error: any) {
      console.error("Conversion error:", error);
      toast({
        title: "Conversion failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
            <p className="text-3xl font-bold">{totalCredits}</p>
            <p className="text-sm text-gray-600">Available to spend</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Monthly Earned</h3>
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <p className="text-3xl font-bold">{monthlyEarned}</p>
            <p className="text-sm text-gray-600">This month</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Items Recycled</h3>
              <Recycle className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold">{itemsRecycled}</p>
            <p className="text-sm text-gray-600">Total items</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Current Level</h3>
              <Award className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold">{currentLevel}</p>
            <p className="text-sm text-gray-600">
              {currentLevel === "Bronze" ? "250 to next level" : 
               currentLevel === "Silver" ? "500 to next level" : 
               currentLevel === "Gold" ? "1000 to next level" : "Max level"}
            </p>
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
                <Button onClick={handleConvert} className="whitespace-nowrap" disabled={loading}>
                  {loading ? "Converting..." : "Convert Now"}
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
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div key={transaction.id} className="p-6 flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{transaction.description}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
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
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No transactions found. Start recycling or convert currency to see your history.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyEcoCredits;
