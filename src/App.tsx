
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import SchedulePickup from './pages/SchedulePickup';
import MyEcoCredits from './pages/MyEcoCredits';
import Marketplace from './pages/Marketplace';
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "./contexts/CartContext";
import { Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AboutUs from './pages/AboutUs';
import Admin from './pages/Admin';
import Events from './pages/Events';
import Analysis from './pages/Analysis';
import AiAssistant from './components/AiAssistant';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Navigate to="/marketplace" replace />} />
            <Route path="/schedule-pickup" element={<SchedulePickup />} />
            <Route path="/my-ecocredits" element={<MyEcoCredits />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/events" element={<Events />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Toaster />
          <AiAssistant />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
