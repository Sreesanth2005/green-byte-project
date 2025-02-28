
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Coins, TrendingUp, Recycle, Award, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase, Transaction, User } from "@/lib/supabase";
import { convertToEcoCredits, convertToMoney } from "@/lib/razorpay";

const MyEcoCredits = () => {
  const [rupeeAmount, setRupeeAmount] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [convertionType, setConvertionType] = useState<"toCredits" | "toRupees">("toCredits");
  const [userData, setUserData] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDataAndTransactions = async () => {
      try {
        setIsLoading(true);
        // Get current user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast({
            title: "Please log in",
            description: "You need to be logged in to view your eco-credits",
            variant: "destructive",
          });
          return;
        }

        const userId = session.user.id;

        // Fetch user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (userError) throw userError;
        setUserData(userData as User);

        // Fetch user transactions
        const { data: transactionData, error: transactionError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        if (transactionError) throw transactionError;
        setTransactions(transactionData as Transaction[]);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load your eco-credits data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDataAndTransactions();
  }, []);

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
    if (!userData) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to convert currency",
        variant: "destructive",
      });
      return;
    }

    try {
      if (convertionType === "toCredits") {
        if (!rupeeAmount || parseInt(rupeeAmount) <= 0) {
          toast({
            title: "Invalid amount",
            description: "Please enter a valid amount to convert",
            variant: "destructive",
          });
          return;
        }

        // Convert money to eco-credits
        const result = await convertToEcoCredits(
          userData.id, 
          parseInt(rupeeAmount)
        );

        if (result.success) {
          toast({
            title: "Conversion Successful",
            description: `Converted ₹${rupeeAmount} to ${creditAmount} EcoCredits`,
          });
          
          // Refresh user data and transactions
          const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', userData.id)
            .single();
          
          setUserData(data as User);
          
          // Refresh transactions
          const { data: transactionData } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userData.id)
            .order('created_at', { ascending: false });
          
          setTransactions(transactionData as Transaction[]);
        } else {
          toast({
            title: "Conversion Failed",
            description: result.error || "There was an error processing your payment",
            variant: "destructive",
          });
        }
      } else {
        // Convert eco-credits to money
        if (!creditAmount || parseInt(creditAmount) <= 0) {
          toast({
            title: "Invalid amount",
            description: "Please enter a valid amount to convert",
            variant: "destructive",
          });
          return;
        }

        const credits = parseInt(creditAmount);
        
        // Check if user has enough credits
        if (userData.eco_credits < credits) {
          toast({
            title: "Insufficient credits",
            description: `You only have ${userData.eco_credits} EcoCredits available`,
            variant: "destructive",
          });
          return;
        }

        const result = await convertToMoney(
          userData.id,
          credits
        );

        if (result.success) {
          toast({
            title: "Conversion Successful",
            description: `Converted ${creditAmount} EcoCredits to ₹${rupeeAmount}`,
          });
          
          // Refresh user data and transactions
          const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', userData.id)
            .single();
          
          setUserData(data as User);
          
          // Refresh transactions
          const { data: transactionData } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userData.id)
            .order('created_at', { ascending: false });
          
          setTransactions(transactionData as Transaction[]);
        } else {
          toast({
            title: "Conversion Failed",
            description: result.error || "There was an error processing your conversion",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error during conversion:", error);
      toast({
        title: "Conversion Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
    
    // Reset form
    setRupeeAmount("");
    setCreditAmount("");
  };

  // If database connection is enabled, use actual transactions, else use sample data
  const displayTransactions = transactions.length > 0 ? transactions : [
    {
      id: "1",
      user_id: "user1",
      type: "earned",
      amount: 50,
      description: "Recycled Laptop",
      created_at: "2024-03-01T00:00:00.000Z",
    },
    {
      id: "2",
      user_id: "user1",
      type: "spent",
      amount: 20,
      description: "Marketplace Purchase",
      created_at: "2024-02-28T00:00:00.000Z",
    },
    {
      id: "3",
      user_id: "user1",
      type: "converted_to_credits",
      amount: 100,
      description: "Rupees Conversion (₹10)",
      created_at: "2024-02-25T00:00:00.000Z",
    },
    {
      id: "4",
      user_id: "user1",
      type: "converted_to_money",
      amount: 50,
      description: "Converted to Rupees (₹5)",
      created_at: "2024-02-20T00:00:00.000Z",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-6 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading your eco-credits...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            <p className="text-3xl font-bold">{userData?.eco_credits || 0}</p>
            <p className="text-sm text-gray-600">Available to spend</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Monthly Earned</h3>
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <p className="text-3xl font-bold">
              {displayTransactions
                .filter(t => 
                  t.type === "earned" && 
                  new Date(t.created_at).getMonth() === new Date().getMonth()
                )
                .reduce((sum, t) => sum + t.amount, 0)}
            </p>
            <p className="text-sm text-gray-600">This month</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Items Recycled</h3>
              <Recycle className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold">
              {displayTransactions
                .filter(t => t.type === "earned" && t.description.includes("Recycled"))
                .length}
            </p>
            <p className="text-sm text-gray-600">Total items</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Current Level</h3>
              <Award className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold">
              {userData && userData.eco_credits >= 1000 ? "Gold" : 
               userData && userData.eco_credits >= 500 ? "Silver" : "Bronze"}
            </p>
            <p className="text-sm text-gray-600">
              {userData && userData.eco_credits >= 1000 ? "Top tier achieved!" : 
               userData && userData.eco_credits >= 500 ? "250 to next level" : "500 to next level"}
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
            {displayTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{transaction.description}</p>
                  <p className="text-sm text-gray-600">{new Date(transaction.created_at).toLocaleDateString()}</p>
                </div>
                <div className={`text-lg font-semibold ${
                  transaction.type === 'earned' || transaction.type === 'converted_to_credits' 
                    ? 'text-success' 
                    : 'text-destructive'
                }`}>
                  {transaction.type === 'earned' || transaction.type === 'converted_to_credits' 
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
