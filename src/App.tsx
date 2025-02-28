
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import { supabase, User } from "./lib/supabase";
import Index from "./pages/Index";
import SchedulePickup from "./pages/SchedulePickup";
import Marketplace from "./pages/Marketplace";
import ProductDetails from "./pages/ProductDetails";
import MyEcoCredits from "./pages/MyEcoCredits";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import AiAssistant from "./components/AiAssistant";
import Analysis from "./pages/Analysis";
import AboutUs from "./pages/AboutUs";
import Admin from "./pages/Admin";

// Create auth context
export const AuthContext = createContext<{
  user: User | null;
  isLoading: boolean;
}>({
  user: null,
  isLoading: true,
});

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Fetch user details from the database
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setUser(data as User);
      }
      
      setIsLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Fetch user details
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setUser(data as User);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) return <div>Loading...</div>;
    
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    return <>{children}</>;
  };

  // Admin route component
  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    if (isLoading) return <div>Loading...</div>;
    
    if (!user || user.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
    
    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ user, isLoading }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route 
                path="/schedule-pickup" 
                element={
                  <ProtectedRoute>
                    <SchedulePickup />
                  </ProtectedRoute>
                } 
              />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route 
                path="/my-ecocredits" 
                element={
                  <ProtectedRoute>
                    <MyEcoCredits />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <AiAssistant />
          </BrowserRouter>
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
