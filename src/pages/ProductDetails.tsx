
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Star, ArrowLeft, Share2, ShoppingCart, Heart } from "lucide-react";

// This would normally come from an API or database
const products = [
  {
    id: 1,
    name: "Refurbished iPhone 12",
    price: 499,
    ecoCredits: 4990,
    rating: 4.5,
    reviews: 128,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop",
    category: "phones",
    description: "This refurbished iPhone 12 has been fully tested and restored to factory settings. It comes with a 1-year warranty and all original accessories.",
    specs: [
      "128GB Storage",
      "6.1-inch Super Retina XDR display",
      "A14 Bionic chip",
      "Dual 12MP camera system",
      "Face ID"
    ],
    condition: "Excellent - Like new with minimal signs of use"
  },
  {
    id: 2,
    name: "Dell XPS 13 Laptop",
    price: 899,
    ecoCredits: 8990,
    rating: 4.8,
    reviews: 256,
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=400&h=300&fit=crop",
    category: "laptops",
    description: "The Dell XPS 13 is a premium ultrabook with InfinityEdge display and powerful performance in a compact design. This refurbished model has been thoroughly tested and comes with our quality guarantee.",
    specs: [
      "Intel Core i7 processor",
      "16GB RAM",
      "512GB SSD",
      "13.4-inch FHD+ display",
      "Windows 11 Pro"
    ],
    condition: "Very Good - Minor cosmetic imperfections that don't affect performance"
  },
  {
    id: 3,
    name: "iPad Air (2020)",
    price: 449,
    ecoCredits: 4490,
    rating: 4.7,
    reviews: 189,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
    category: "tablets",
    description: "The iPad Air features a stunning Liquid Retina display and Apple's powerful A14 Bionic chip. This refurbished model has been thoroughly tested and is in excellent condition.",
    specs: [
      "64GB Storage",
      "10.9-inch Liquid Retina display",
      "A14 Bionic chip",
      "12MP rear camera, 7MP front camera",
      "Touch ID"
    ],
    condition: "Excellent - Like new with minimal signs of use"
  },
  {
    id: 4,
    name: "Sony WH-1000XM4 Headphones",
    price: 249,
    ecoCredits: 2490,
    rating: 4.9,
    reviews: 320,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    category: "audio",
    description: "Industry-leading noise cancellation with premium sound quality. These refurbished Sony WH-1000XM4 headphones have been thoroughly tested and come with a 6-month warranty.",
    specs: [
      "Industry-leading noise cancellation",
      "30-hour battery life",
      "Touch controls",
      "Speak-to-chat technology",
      "Bluetooth 5.0"
    ],
    condition: "Very Good - Minor cosmetic imperfections that don't affect performance"
  },
  {
    id: 5,
    name: "Samsung Galaxy Watch",
    price: 179,
    ecoCredits: 1790,
    rating: 4.6,
    reviews: 142,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
    category: "accessories",
    description: "Track your fitness goals and stay connected with this refurbished Samsung Galaxy Watch. It has been thoroughly tested and is in excellent working condition.",
    specs: [
      "1.4-inch Super AMOLED display",
      "5 ATM water resistance",
      "Heart rate monitoring",
      "GPS",
      "NFC for Samsung Pay"
    ],
    condition: "Good - Visible signs of use but fully functional"
  },
  {
    id: 6,
    name: "Google Pixel 6",
    price: 549,
    ecoCredits: 5490,
    rating: 4.4,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop",
    category: "phones",
    description: "Experience Google's best camera yet with the Pixel 6. This refurbished phone has been thoroughly tested and comes with a 1-year warranty.",
    specs: [
      "128GB Storage",
      "6.4-inch OLED display",
      "Google Tensor chip",
      "50MP wide + 12MP ultrawide cameras",
      "Android 12"
    ],
    condition: "Excellent - Like new with minimal signs of use"
  },
  {
    id: 7,
    name: "MacBook Pro M1",
    price: 1199,
    ecoCredits: 11990,
    rating: 4.8,
    reviews: 276,
    image: "https://images.unsplash.com/photo-1537498425277-c283d32ef9db?w=400&h=300&fit=crop",
    category: "laptops",
    description: "The MacBook Pro with M1 chip delivers breakthrough performance. This refurbished model has been thoroughly tested and comes with our quality guarantee.",
    specs: [
      "Apple M1 chip with 8‑core CPU",
      "8GB unified memory",
      "256GB SSD storage",
      "13-inch Retina display",
      "macOS"
    ],
    condition: "Very Good - Minor cosmetic imperfections that don't affect performance"
  },
  {
    id: 8,
    name: "Wireless Earbuds",
    price: 79,
    ecoCredits: 790,
    rating: 4.3,
    reviews: 105,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f37?w=400&h=300&fit=crop",
    category: "audio",
    description: "These refurbished wireless earbuds offer premium sound quality and comfortable fit. They have been thoroughly tested and come with a 3-month warranty.",
    specs: [
      "True wireless design",
      "5-hour battery life (20 hours with case)",
      "Water resistant",
      "Touch controls",
      "Built-in microphone for calls"
    ],
    condition: "Good - Visible signs of use but fully functional"
  }
];

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Find the product with the matching ID
    const foundProduct = products.find(p => p.id === Number(id));
    if (foundProduct) {
      setProduct(foundProduct);
    }
    // In a real app, you might fetch from an API here
  }, [id]);

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
                  {product.specs.map((spec: string, index: number) => (
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
                
                <Button className="flex-1" size="lg">
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
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map(relatedProduct => (
                <div key={relatedProduct.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <Link to={`/product/${relatedProduct.id}`}>
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
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;
