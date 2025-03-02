
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
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
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import { AuthProvider } from "./contexts/AuthContext";
import { initializeDatabase } from "./lib/supabaseClient";

const queryClient = new QueryClient();

const App = () => {
  // Initialize the database on app start
  useEffect(() => {
    const init = async () => {
      await initializeDatabase();
    };
    init();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/schedule-pickup" element={<SchedulePickup />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/my-ecocredits" element={<MyEcoCredits />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/events" element={<Events />} />
              <Route path="/event/:id" element={<EventDetails />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <AiAssistant />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
