
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { CartItem as CartItemType, useCart } from "@/contexts/CartContext";

interface CartItemProps {
  item: CartItemType;
}

export const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center border rounded-lg p-3">
      <img 
        src={item.product.image_url} 
        alt={item.product.name} 
        className="w-16 h-16 object-cover rounded"
      />
      <div className="ml-4 flex-grow">
        <h4 className="font-medium text-sm">{item.product.name}</h4>
        <p className="text-sm text-primary">{item.product.eco_credits} Credits</p>
        <div className="flex items-center mt-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="mx-2 text-sm">{item.quantity}</span>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => removeFromCart(item.id)}
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
