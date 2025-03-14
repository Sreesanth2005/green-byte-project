
import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  imageUrl?: string;
  maxParticipants?: number;
  currentParticipants: number;
  category: string;
  organizer: string;
  ecoCreditsReward?: number;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String },
  maxParticipants: { type: Number },
  currentParticipants: { type: Number, default: 0 },
  category: { type: String, required: true },
  organizer: { type: String, required: true },
  ecoCreditsReward: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
EventSchema.pre<IEvent>('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Event = mongoose.model<IEvent>('Event', EventSchema);
