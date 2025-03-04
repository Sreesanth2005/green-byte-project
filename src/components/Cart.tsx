
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShoppingCart, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";
import { LoadingSpinner } from "@/components/cart/LoadingSpinner";

interface CartProps {
  open: boolean;
  onClose: () => void;
}

const Cart = ({ open, onClose }: CartProps) => {
  const { cartItems, loading, fetchCartItems, fetchUserCredits } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (open && user) {
      fetchCartItems();
      fetchUserCredits();
    }
  }, [open, user]);

  const handleCheckout = () => {
    onClose();
    window.location.href = "/checkout";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Your Cart
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Review your items before checkout.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <LoadingSpinner />
        ) : cartItems.length === 0 ? (
          <EmptyCart onClose={onClose} />
        ) : (
          <>
            <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <CartSummary 
              onClose={onClose} 
              onCheckout={handleCheckout} 
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Cart;
