
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Star, ArrowLeft, Share2, ShoppingCart, Heart } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      
      // Fetch the product
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .eq('id', productId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setProduct(data);
        
        // Fetch related products
        const { data: related, error: relatedError } = await supabase
          .from('marketplace_items')
          .select('*')
          .eq('category', data.category)
          .neq('id', productId)
          .limit(4);
          
        if (relatedError) throw relatedError;
        
        setRelatedProducts(related || []);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "Failed to load product",
        description: "Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }
    
    if (!product || !id) {
      toast({
        title: "Error",
        description: "Product information is missing.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Check if item already exists in cart
      const { data: existingItems, error: checkError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', id);
        
      if (checkError) throw checkError;
      
      if (existingItems && existingItems.length > 0) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ 
            quantity: existingItems[0].quantity + quantity,
            updated_at: new Date()
          })
          .eq('id', existingItems[0].id);
          
        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase
          .from('cart_items')
          .insert([
            { 
              user_id: user.id, 
              product_id: id,
              quantity: quantity
            }
          ]);
          
        if (error) throw error;
      }
      
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} added to your cart.`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/marketplace">Back to Marketplace</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <Link to="/marketplace" className="inline-flex items-center text-primary mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Marketplace
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Product Image */}
            <div className="flex items-center justify-center">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-auto max-h-[400px] object-contain rounded-lg"
              />
            </div>
            
            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
                <div className="flex items-center mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-primary fill-primary' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">({product.reviews} reviews)</span>
                </div>
              </div>
              
              <div className="pb-4 border-b">
                <div className="text-3xl font-bold text-primary">
                  {product.eco_credits} Credits
                </div>
                <div className="text-gray-600 mt-1">(₹{product.price})</div>
              </div>
              
              <div className="space-y-4 pb-4 border-b">
                <h3 className="font-semibold">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
              
              <div className="space-y-4 pb-4 border-b">
                <h3 className="font-semibold">Condition</h3>
                <p className="text-gray-600">{product.condition}</p>
              </div>
              
              <div className="space-y-4 pb-4 border-b">
                <h3 className="font-semibold">Key Specifications</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  {product.specs && product.specs.map((spec: string, index: number) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
                
                <Button className="flex-1" size="lg" onClick={addToCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
              
              <div className="flex items-center space-x-4 pt-2">
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          
          <div className="flex items-start justify-between flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="text-5xl font-bold text-center">{product.rating.toFixed(1)}</div>
              <div className="flex justify-center my-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-primary fill-primary' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <div className="text-center text-gray-600">{product.reviews} reviews</div>
              
              <Button className="w-full mt-6">Write a Review</Button>
            </div>
            
            <div className="md:w-2/3 space-y-6">
              {/* Mock Reviews */}
              <div className="border-b pb-6">
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < 5 ? 'text-primary fill-primary' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 font-medium">Excellent purchase</span>
                </div>
                <p className="text-gray-600 mb-2">
                  This refurbished product is in excellent condition. It looks and functions like new. I couldn't be happier with my purchase.
                </p>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">John D.</span> - 2 weeks ago
                </div>
              </div>
              
              <div className="border-b pb-6">
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < 4 ? 'text-primary fill-primary' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 font-medium">Great value</span>
                </div>
                <p className="text-gray-600 mb-2">
                  Very happy with this product. It has a few minor scratches but works perfectly. The price was great compared to buying new.
                </p>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Sarah M.</span> - 1 month ago
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < 5 ? 'text-primary fill-primary' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 font-medium">Impressive quality</span>
                </div>
                <p className="text-gray-600 mb-2">
                  I was initially skeptical about buying refurbished, but this product exceeded my expectations. It's in fantastic condition and performs flawlessly.
                </p>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Michael T.</span> - 3 weeks ago
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <div key={relatedProduct.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <Link to={`/product/${relatedProduct.id}`}>
                    <img
                      src={relatedProduct.image_url}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{relatedProduct.name}</h3>
                      <div className="flex items-center mb-2">
                        <div className="flex items-center text-primary mr-2">
                          <Star className="w-4 h-4 fill-primary" />
                          <span className="ml-1">{relatedProduct.rating}</span>
                        </div>
                        <span className="text-sm text-gray-600">({relatedProduct.reviews} reviews)</span>
                      </div>
                      <div>
                        <span className="text-lg font-semibold">{relatedProduct.eco_credits} Credits</span>
                        <p className="text-xs text-gray-500">(₹{relatedProduct.price})</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;
