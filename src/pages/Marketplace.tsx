
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Star } from "lucide-react";

const Marketplace = () => {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Marketplace</h1>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap

-6">
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
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
