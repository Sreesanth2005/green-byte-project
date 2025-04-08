
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Star, ArrowLeft, Share2, ShoppingCart, Heart, Plus, Minus, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import mockDatabase from "@/utils/mockDatabase";
import { useCart } from "@/contexts/CartContext";
import { MockProduct } from "@/utils/mockDatabase";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<MockProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<MockProduct[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart, fetchCartItems } = useCart();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      
      const { product, error } = mockDatabase.getProductById(productId);
      
      if (error) throw new Error(error);
      
      if (product) {
        setProduct(product);
        
        // Get related products of the same category
        const { products: related } = mockDatabase.getProductsByCategory(product.category);
        const filteredRelated = related.filter(p => p.id !== productId).slice(0, 4);
        setRelatedProducts(filteredRelated);
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

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      navigate("/login");
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
      await addToCart(id, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
      await fetchCartItems();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to purchase items.",
        variant: "destructive",
      });
      navigate("/login");
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
    
    // First add to cart
    try {
      await addToCart(id, quantity);
      // Then navigate to checkout
      navigate("/checkout");
    } catch (error) {
      console.error("Error during buy now:", error);
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
                src={product.image}
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
                  {product.ecoCredits} Credits
                </div>
                <div className="text-gray-600 mt-1">(₹{product.price})</div>
                {product.stock > 0 ? (
                  <div className="text-green-600 flex items-center mt-2 text-sm">
                    <Check className="w-4 h-4 mr-1" />
                    In Stock ({product.stock} available)
                  </div>
                ) : (
                  <div className="text-red-600 mt-2 text-sm">Out of Stock</div>
                )}
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
                  {product.specs && product.specs.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <button
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2">{quantity}</span>
                    <button
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button 
                    className="flex-1" 
                    variant={addedToCart ? "outline" : "default"} 
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="mr-2 h-5 w-5" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    className="flex-1" 
                    onClick={handleBuyNow}
                    disabled={product.stock <= 0}
                  >
                    Buy Now
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
                  <Link to={`/product/${relatedProduct.id}`} className="block">
                    <img
                      src={relatedProduct.image}
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
                        <span className="text-lg font-semibold">{relatedProduct.ecoCredits} Credits</span>
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

export default ProductDetail;
