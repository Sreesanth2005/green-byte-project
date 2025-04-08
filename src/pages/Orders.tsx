
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";
import mockDatabase from "@/utils/mockDatabase";

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to view your orders.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    fetchOrders();
  }, [user]);
  
  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const result = mockDatabase.getUserOrders(user.id);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Get product details for each order item
      const ordersWithDetails = result.orders.map(order => {
        const productsWithDetails = order.products.map((item: any) => {
          const product = mockDatabase.getProductById(item.productId).product;
          return {
            ...item,
            product
          };
        });
        
        return {
          ...order,
          products: productsWithDetails
        };
      });
      
      setOrders(ordersWithDetails || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Failed to load orders",
        description: "Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-gray-50 p-4 border-b flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div>
                    <div className="text-sm text-gray-500">Order #{order.id.substring(3, 10)}</div>
                    <div className="font-medium">{formatDate(order.createdAt)}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium 
                      ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/orders/${order.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  {order.products.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 py-3 border-b last:border-b-0">
                      <img 
                        src={item.product.image} 
                        alt={item.product.name} 
                        className="w-16 h-16 object-cover rounded-md" 
                      />
                      <div className="flex-1">
                        <Link to={`/product/${item.productId}`} className="font-medium hover:text-primary">
                          {item.product.name}
                        </Link>
                        <div className="text-sm text-gray-500">Quantity: {item.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-primary">{item.ecoCredits * item.quantity} Credits</div>
                        <div className="text-sm text-gray-500">₹{item.price * item.quantity}</div>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end pt-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Order Total</div>
                      <div className="text-xl font-semibold text-primary">{order.totalEcoCredits} Credits</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="mx-auto mb-6 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">You haven't made any orders yet. Start shopping to see your orders here.</p>
            <Button asChild>
              <Link to="/marketplace">
                Browse Products <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Orders;
