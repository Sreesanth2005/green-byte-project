
import { Button } from "@/components/ui/button";

interface EmptyCartProps {
  onClose: () => void;
}

export const EmptyCart = ({ onClose }: EmptyCartProps) => {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500 mb-4">Your cart is empty</p>
      <Button onClick={onClose} variant="outline">Continue Shopping</Button>
    </div>
  );
};
