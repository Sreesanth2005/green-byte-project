
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    eco_credits: number;
    price: number;
    image_url: string;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  totalCredits: number;
  userCredits: number;
  fetchCartItems: () => Promise<void>;
  fetchUserCredits: () => Promise<void>;
  updateQuantity: (itemId: string, newQuantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCredits, setTotalCredits] = useState(0);
  const [userCredits, setUserCredits] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchCartItems = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // First, get cart items
      const { data: cartData, error: cartError } = await supabase
        .from('cart_items')
        .select('id, product_id, quantity')
        .eq('user_id', user.id);
        
      if (cartError) throw cartError;
      
      if (!cartData || cartData.length === 0) {
        setCartItems([]);
        setTotalCredits(0);
        setLoading(false);
        return;
      }
      
      // Then, fetch product details for each cart item
      const productPromises = cartData.map(async (item) => {
        const { data: productData, error: productError } = await supabase
          .from('marketplace_items')
          .select('id, name, eco_credits, price, image_url')
          .eq('id', item.product_id)
          .single();
          
        if (productError) {
          console.error("Error fetching product:", productError);
          return null;
        }
        
        return {
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          product: productData
        };
      });
      
      const results = await Promise.all(productPromises);
      const validCartItems = results.filter(item => item !== null) as CartItem[];
      
      setCartItems(validCartItems);
      
      // Calculate total credits
      const total = validCartItems.reduce((sum, item) => {
        return sum + item.product.eco_credits * item.quantity;
      }, 0);
      
      setTotalCredits(total);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast({
        title: "Error",
        description: "Failed to load your cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCredits = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('eco_credits')
        .eq('id', user.id)
        .limit(1);
        
      if (error) throw error;
      
      setUserCredits(data && data.length > 0 ? data[0].eco_credits : 0);
    } catch (error) {
      console.error("Error fetching user credits:", error);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (!user || newQuantity < 1) return;
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
      
      // Recalculate total
      const newTotal = cartItems
        .map(item => item.id === itemId ? 
          { ...item, quantity: newQuantity } : item
        )
        .reduce((sum, item) => sum + item.product.eco_credits * item.quantity, 0);
      
      setTotalCredits(newTotal);
    } catch (error) {
      console.error("Error updating item quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update item quantity. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Update local state
      const itemToRemove = cartItems.find(item => item.id === itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      
      // Recalculate total
      if (itemToRemove) {
        setTotalCredits(prev => prev - itemToRemove.product.eco_credits * itemToRemove.quantity);
      }
      
      toast({
        title: "Item Removed",
        description: "The item has been removed from your cart.",
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchCartItems();
      fetchUserCredits();
    }
  }, [user]);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      totalCredits,
      userCredits,
      fetchCartItems,
      fetchUserCredits,
      updateQuantity,
      removeFromCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
