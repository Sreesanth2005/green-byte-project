
import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export interface FilterState {
  priceRange: [number, number];
  categories: string[];
  minRating: number;
  sortBy: 'recommended' | 'price_low_high' | 'price_high_low' | 'rating' | 'newest';
}

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  isMobile?: boolean;
}

const FilterPanel = ({ onFilterChange, isMobile = false }: FilterPanelProps) => {
  const [open, setOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 12000]);
  const [categories, setCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState<FilterState['sortBy']>('recommended');

  // Available categories
  const availableCategories = [
    { id: 'phones', label: 'Phones' },
    { id: 'laptops', label: 'Laptops' },
    { id: 'tablets', label: 'Tablets' },
    { id: 'audio', label: 'Audio' },
    { id: 'accessories', label: 'Accessories' },
  ];

  // Apply filters
  const applyFilters = () => {
    onFilterChange({
      priceRange,
      categories,
      minRating,
      sortBy,
    });
    if (isMobile) {
      setOpen(false);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setPriceRange([0, 12000]);
    setCategories([]);
    setMinRating(0);
    setSortBy('recommended');
    
    onFilterChange({
      priceRange: [0, 12000],
      categories: [],
      minRating: 0,
      sortBy: 'recommended',
    });
  };

  // Format price to display as EcoCredits
  const formatPrice = (value: number) => {
    return `${value}`;
  };

  // Handle category toggle
  const toggleCategory = (categoryId: string) => {
    setCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  // Update filters when component mounts
  useEffect(() => {
    applyFilters();
  }, []);

  const filterContent = (
    <div className="space-y-6">
      {/* Price Range Filter */}
      <div>
        <h3 className="font-medium mb-3">Price Range (EcoCredits)</h3>
        <div className="px-2">
          <Slider
            defaultValue={priceRange}
            min={0}
            max={12000}
            step={100}
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>
      
      {/* Category Filter */}
      <div>
        <h3 className="font-medium mb-3">Category</h3>
        <div className="space-y-2">
          {availableCategories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`category-${category.id}`}
                checked={categories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <Label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer">
                {category.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Rating Filter */}
      <div>
        <h3 className="font-medium mb-3">Minimum Rating</h3>
        <div className="px-2">
          <Slider
            defaultValue={[minRating]}
            min={0}
            max={5}
            step={0.5}
            value={[minRating]}
            onValueChange={(value) => setMinRating(value[0])}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>0</span>
            <span>5</span>
          </div>
        </div>
        <div className="text-center text-sm text-primary font-medium mt-1">
          {minRating} stars & up
        </div>
      </div>
      
      {/* Sort By */}
      <div>
        <h3 className="font-medium mb-3">Sort By</h3>
        <RadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as FilterState['sortBy'])}>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="recommended" id="sort-recommended" />
            <Label htmlFor="sort-recommended" className="text-sm cursor-pointer">Recommended</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="price_low_high" id="sort-price-low" />
            <Label htmlFor="sort-price-low" className="text-sm cursor-pointer">Price: Low to High</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="price_high_low" id="sort-price-high" />
            <Label htmlFor="sort-price-high" className="text-sm cursor-pointer">Price: High to Low</Label>
          </div>
          <div className="flex items-center space-x-2 mb-2">
            <RadioGroupItem value="rating" id="sort-rating" />
            <Label htmlFor="sort-rating" className="text-sm cursor-pointer">Highest Rated</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="newest" id="sort-newest" />
            <Label htmlFor="sort-newest" className="text-sm cursor-pointer">Newest</Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Filter Actions */}
      <div className="flex gap-2 pt-2">
        <Button onClick={applyFilters} className="flex-1">Apply Filters</Button>
        <Button onClick={resetFilters} variant="outline" className="flex-1">Reset</Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              Filter & Sort
            </DialogTitle>
          </DialogHeader>
          {filterContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <SlidersHorizontal className="w-5 h-5" />
        Filter & Sort
      </h2>
      {filterContent}
    </div>
  );
};

export default FilterPanel;
