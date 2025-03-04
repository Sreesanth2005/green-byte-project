
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

interface CartSummaryProps {
  onClose: () => void;
  onCheckout: () => void;
}

export const CartSummary = ({ onClose, onCheckout }: CartSummaryProps) => {
  const { totalCredits, userCredits } = useCart();

  return (
    <div className="border-t pt-4 mt-4">
      <div className="flex justify-between items-center mb-4">
        <span className="font-medium">Total:</span>
        <span className="font-bold text-lg text-primary">{totalCredits} Credits</span>
      </div>
      <div className="text-xs text-gray-500 mb-4">
        Your balance: {userCredits} EcoCredits
        {totalCredits > userCredits && (
          <div className="text-red-500 mt-1">
            You need {totalCredits - userCredits} more credits to complete this purchase.
          </div>
        )}
      </div>
      <div className="flex gap-3">
        {totalCredits > userCredits ? (
          <Button className="flex-1" asChild>
            <Link to="/my-ecocredits" onClick={onClose}>
              Add EcoCredits
            </Link>
          </Button>
        ) : (
          <Button className="flex-1" onClick={onCheckout}>
            Checkout
          </Button>
        )}
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};
