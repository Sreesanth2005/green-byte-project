
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';
import mockDatabase from '@/utils/mockDatabase';

type CartContextType = {
  cartItems: any[];
  loading: boolean;
  userCredits: number;
  fetchCartItems: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartItem: (cartItemId: string, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchUserCredits: () => Promise<void>;
};

const CartContext = createContext<CartContextType>({
  cartItems: [],
  loading: false,
  userCredits: 0,
  fetchCartItems: async () => {},
  addToCart: async () => {},
  updateCartItem: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {},
  fetchUserCredits: async () => {},
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userCredits, setUserCredits] = useState(0);

  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch cart items when user changes
  useEffect(() => {
    if (user) {
      fetchCartItems();
      fetchUserCredits();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { cartItems, error } = mockDatabase.getCart(user.id);
      
      if (error) {
        throw new Error(error);
      }
      
      setCartItems(cartItems || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const result = mockDatabase.addToCart(user.id, productId, quantity);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      toast({
        title: "Added to Cart",
        description: `${quantity} item${quantity > 1 ? 's' : ''} added to your cart.`,
      });
      
      fetchCartItems();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart.",
        variant: "destructive",
      });
    }
  };

  const updateCartItem = async (cartItemId: string, quantity: number) => {
    if (!user) return;
    
    try {
      const result = mockDatabase.updateCartItem(user.id, cartItemId, quantity);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      fetchCartItems();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update item quantity.",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    if (!user) return;
    
    try {
      const result = mockDatabase.removeFromCart(user.id, cartItemId);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
      
      fetchCartItems();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item from cart.",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    if (!user) return;
    
    try {
      const result = mockDatabase.clearCart(user.id);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      setCartItems([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to clear cart.",
        variant: "destructive",
      });
    }
  };

  const fetchUserCredits = async () => {
    if (!user) return;
    
    try {
      const { user: userData, error } = mockDatabase.getUserById(user.id);
      
      if (error) {
        throw new Error(error);
      }
      
      if (userData) {
        setUserCredits(userData.ecoCredits);
      }
    } catch (error) {
      console.error("Error fetching user credits:", error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        userCredits,
        fetchCartItems,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        fetchUserCredits,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
