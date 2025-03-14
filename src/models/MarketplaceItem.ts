
import mongoose, { Document, Schema } from 'mongoose';

export interface IMarketplaceItem extends Document {
  sellerId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  price: number;
  ecoCredits?: number;
  imageUrls: string[];
  condition?: string;
  category?: string;
  specs?: string[];
  rating?: number;
  reviews?: number;
  isSold: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MarketplaceItemSchema = new Schema<IMarketplaceItem>({
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  ecoCredits: { type: Number },
  imageUrls: { type: [String], default: [] },
  condition: { type: String },
  category: { type: String },
  specs: { type: [String] },
  rating: { type: Number },
  reviews: { type: Number },
  isSold: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
MarketplaceItemSchema.pre<IMarketplaceItem>('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const MarketplaceItem = mongoose.model<IMarketplaceItem>('MarketplaceItem', MarketplaceItemSchema);
