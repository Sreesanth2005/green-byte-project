import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import SchedulePickup from './pages/SchedulePickup';
import MyEcoCredits from './pages/MyEcoCredits';
import Marketplace from './pages/Marketplace';
import Checkout from './pages/Checkout';
import { Toaster } from "@/components/ui/toaster"

// Add the CartProvider import
import { CartProvider } from "./contexts/CartContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/schedule-pickup" element={<SchedulePickup />} />
            <Route path="/my-ecocredits" element={<MyEcoCredits />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
