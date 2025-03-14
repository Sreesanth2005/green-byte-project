
import mongoose, { Document, Schema } from 'mongoose';

export interface ISchedulePickup extends Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  pickupDate: Date;
  pickupTime: string;
  address: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  imageUrls: string[];
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  ecoCreditsEarned?: number;
  createdAt: Date;
  updatedAt: Date;
}

const SchedulePickupSchema = new Schema<ISchedulePickup>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  pickupDate: { type: Date, required: true },
  pickupTime: { type: String, required: true },
  address: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  imageUrls: { type: [String], default: [] },
  status: { type: String, enum: ['pending', 'scheduled', 'completed', 'cancelled'], default: 'pending' },
  ecoCreditsEarned: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
SchedulePickupSchema.pre<ISchedulePickup>('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const SchedulePickup = mongoose.model<ISchedulePickup>('SchedulePickup', SchedulePickupSchema);
