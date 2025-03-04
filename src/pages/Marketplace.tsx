import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, ChevronLeft, ChevronRight, MessageSquare, ShoppingCart } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import FilterPanel, { FilterState } from "@/components/FilterPanel";
import Cart from "@/components/Cart";
import { useAuth } from "@/contexts/AuthContext";

const Marketplace = () => {
  const [activeBanner, setActiveBanner] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 12000],
    categories: [],
    minRating: 0,
    sortBy: "recommended",
  });
  const [showCart, setShowCart] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  
  const { toast } = useToast();
  const { user } = useAuth();

  const banners = [
    {
      title: "Refurbished Electronics",
      description: "Quality checked and certified devices at amazing prices",
      image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1200&h=400&fit=crop",
      cta: "Shop Now",
    },
    {
      title: "Spring Sale",
      description: "Up to 50% off on selected items",
      image: "https://images.unsplash.com/photo-1516397281156-ca3b5d4c8744?w=1200&h=400&fit=crop",
      cta: "View Deals",
    },
  ];

  useEffect(() => {
    fetchProducts();
    if (user) {
      fetchCartCount();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*');
        
      if (error) throw error;
      
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Failed to load products",
        description: "Please try refreshing the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    if (!user) return;
    
    try {
      const { count, error } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setCartItemsCount(count || 0);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  const addToCart = async (productId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart.",
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
        .eq('product_id', productId);
        
      if (checkError) throw checkError;
      
      if (existingItems && existingItems.length > 0) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ 
            quantity: existingItems[0].quantity + 1,
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
              product_id: productId,
              quantity: 1
            }
          ]);
          
        if (error) throw error;
      }
      
      toast({
        title: "Added to Cart",
        description: "Item has been added to your cart.",
      });
      
      // Update cart count
      fetchCartCount();
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Failed to add item",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Price range filter
      const priceInRange = 
        product.eco_credits >= filters.priceRange[0] && 
        product.eco_credits <= filters.priceRange[1];
      
      // Category filter
      const matchesCategory = 
        filters.categories.length === 0 || 
        filters.categories.includes(product.category);
      
      // Rating filter
      const matchesRating = product.rating >= filters.minRating;
      
      // Search query
      const matchesSearch = searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return priceInRange && matchesCategory && matchesRating && matchesSearch;
    }).sort((a, b) => {
      // Apply sorting
      switch (filters.sortBy) {
        case 'price_low_high':
          return a.eco_credits - b.eco_credits;
        case 'price_high_low':
          return b.eco_credits - a.eco_credits;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'recommended':
        default:
          // Default sorting (recommended)
          return 0;
      }
    });
  }, [products, filters, searchQuery]);

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    if (!feedback.trim()) {
      toast({
        title: "Feedback required",
        description: "Please enter your feedback before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('feedback')
        .insert([
          { 
            name: user?.user_metadata?.name || "Anonymous",
            email: user?.email || "anonymous@example.com",
            message: feedback,
            rating,
            user_id: user?.id
          }
        ]);
        
      if (error) throw error;
      
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
      
      setShowFeedback(false);
      setRating(0);
      setFeedback("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Failed to submit feedback",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Banner Section */}
        <div className="relative h-[400px] overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeBanner * 100}%)` }}
          >
            {banners.map((banner, index) => (
              <div key={index} className="w-full flex-shrink-0 relative">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center text-white">
                  <div>
                    <h1 className="text-4xl font-bold mb-4">{banner.title}</h1>
                    <p className="text-xl mb-8">{banner.description}</p>
                    <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                      {banner.cta}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => setActiveBanner(prev => prev === 0 ? banners.length - 1 : prev - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setActiveBanner(prev => prev === banners.length - 1 ? 0 : prev + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-grow max-w-md">
                <Input
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <div className="flex gap-2">
                <FilterPanel onFilterChange={handleFilterChange} isMobile={true} />
                <Button 
                  variant="outline" 
                  className="relative" 
                  onClick={() => setShowCart(true)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Filter Panel */}
            <div className="hidden lg:block">
              <FilterPanel onFilterChange={handleFilterChange} />
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <Link to={`/product/${product.id}`} className="block">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                          <div className="flex items-center mb-2">
                            <div className="flex items-center text-primary mr-2">
                              <Star className="w-4 h-4 fill-primary" />
                              <span className="ml-1">{product.rating}</span>
                            </div>
                            <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xl font-semibold">{product.eco_credits} Credits</span>
                              <p className="text-xs text-gray-500">(₹{product.price})</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <div className="px-4 pb-4">
                        <Button 
                          onClick={() => addToCart(product.id)}
                          className="w-full"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Button */}
        <Button
          onClick={() => setShowFeedback(true)}
          className="fixed bottom-20 right-4 rounded-full shadow-lg"
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          Give Feedback
        </Button>

        {/* Feedback Modal */}
        {showFeedback && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Share Your Feedback</h3>
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div>
                  <label className="block mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating ? "fill-primary text-primary" : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block mb-2">Your Feedback</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    rows={4}
                    required
                  ></textarea>
                </div>
                <div className="flex gap-4">
                  <Button type="submit" className="flex-1">Submit</Button>
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowFeedback(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Cart Component */}
        <Cart 
          open={showCart} 
          onClose={() => setShowCart(false)} 
        />
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
