
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import SchedulePickup from './pages/SchedulePickup';
import MyEcoCredits from './pages/MyEcoCredits';
import Marketplace from './pages/Marketplace';
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "./contexts/CartContext";
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/marketplace" replace />} />
            <Route path="/dashboard" element={<Navigate to="/marketplace" replace />} />
            <Route path="/schedule-pickup" element={<SchedulePickup />} />
            <Route path="/my-ecocredits" element={<MyEcoCredits />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/signup" element={<Navigate to="/marketplace" replace />} />
            <Route path="/signin" element={<Navigate to="/marketplace" replace />} />
            <Route path="/checkout" element={<Navigate to="/marketplace" replace />} />
          </Routes>
          <Toaster />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
