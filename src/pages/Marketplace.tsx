
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Star, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { useState } from "react";

const Marketplace = () => {
  const [activeBanner, setActiveBanner] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

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

  const products = [
    {
      id: 1,
      name: "Refurbished iPhone 12",
      price: 499,
      rating: 4.5,
      reviews: 128,
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      name: "Dell XPS 13 Laptop",
      price: 899,
      rating: 4.8,
      reviews: 256,
      image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=300&fit=crop",
    },
    // Add more products as needed
  ];

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle feedback submission
    console.log({ rating, feedback });
    setShowFeedback(false);
    setRating(0);
    setFeedback("");
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  placeholder="Search products..."
                  className="pl-10 w-64"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={product.image}
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
                    <span className="text-xl font-semibold">${product.price}</span>
                    <Button>Add to Cart</Button>
                  </div>
                </div>
              </div>
            ))}
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
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
