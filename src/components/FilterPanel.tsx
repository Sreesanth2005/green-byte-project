
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Star, ChevronsUpDown, Filter as FilterIcon, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";

interface FilterPanelProps {
  onFilterChange: (filters: FilterState) => void;
  isMobile?: boolean;
}

export interface FilterState {
  priceRange: [number, number];
  categories: string[];
  minRating: number;
  sortBy: string;
}

const initialState: FilterState = {
  priceRange: [0, 12000],
  categories: [],
  minRating: 0,
  sortBy: "recommended",
};

const categories = [
  { id: "phones", label: "Smartphones" },
  { id: "laptops", label: "Laptops & Computers" },
  { id: "tablets", label: "Tablets & E-Readers" },
  { id: "accessories", label: "Accessories" },
  { id: "audio", label: "Audio Devices" },
];

const FilterPanel = ({ onFilterChange, isMobile = false }: FilterPanelProps) => {
  const [filters, setFilters] = useState<FilterState>(initialState);

  const handleCategoryChange = (category: string, checked: boolean) => {
    const updatedCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter((c) => c !== category);
    
    const updatedFilters = { ...filters, categories: updatedCategories };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSortChange = (value: string) => {
    const updatedFilters = { ...filters, sortBy: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleRatingChange = (rating: number) => {
    const updatedFilters = { ...filters, minRating: rating };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handlePriceChange = (value: number[]) => {
    const updatedFilters = { ...filters, priceRange: [value[0], value[1]] };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    setFilters(initialState);
    onFilterChange(initialState);
  };

  const renderFilters = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Price Range (Credits)</h3>
        <div className="px-1">
          <Slider
            defaultValue={filters.priceRange}
            min={0}
            max={12000}
            step={100}
            onValueChange={handlePriceChange}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <div>{filters.priceRange[0]} Credits</div>
            <div>{filters.priceRange[1]} Credits</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={filters.categories.includes(category.id)}
                onCheckedChange={(checked) => 
                  handleCategoryChange(category.id, checked as boolean)
                }
              />
              <Label htmlFor={`category-${category.id}`}>{category.label}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Minimum Rating</h3>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button
              key={rating}
              variant="outline"
              size="sm"
              className={`px-2 ${filters.minRating >= rating ? "bg-primary/10" : ""}`}
              onClick={() => handleRatingChange(rating)}
            >
              <Star
                className={`h-4 w-4 ${
                  filters.minRating >= rating ? "fill-primary text-primary" : "text-gray-400"
                }`}
              />
              <span className="ml-1">{rating}+</span>
            </Button>
          ))}
          {filters.minRating > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="px-2"
              onClick={() => handleRatingChange(0)}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Sort By</h3>
        <RadioGroup
          value={filters.sortBy}
          onValueChange={handleSortChange}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="recommended" id="sort-recommended" />
            <Label htmlFor="sort-recommended">Recommended</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price_low_high" id="sort-price-low" />
            <Label htmlFor="sort-price-low">Price: Low to High</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price_high_low" id="sort-price-high" />
            <Label htmlFor="sort-price-high">Price: High to Low</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="rating" id="sort-rating" />
            <Label htmlFor="sort-rating">Highest Rated</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="newest" id="sort-newest" />
            <Label htmlFor="sort-newest">Newest First</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );

  // Mobile view with Sheet component
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <FilterIcon className="w-4 h-4" />
            Filter
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle className="flex justify-between">
              <span>Filters</span>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </SheetTitle>
          </SheetHeader>
          <div className="py-4">{renderFilters()}</div>
          <SheetFooter>
            <SheetClose asChild>
              <Button className="w-full">Apply Filters</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop view
  return (
    <div className="rounded-md border p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold flex items-center">
          <FilterIcon className="w-4 h-4 mr-2" />
          Filters
        </h2>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>
      {renderFilters()}
    </div>
  );
};

export default FilterPanel;
