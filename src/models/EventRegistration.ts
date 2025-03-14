
import mongoose, { Document, Schema } from 'mongoose';

export interface IEventRegistration extends Document {
  eventId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: Date;
}

const EventRegistrationSchema = new Schema<IEventRegistration>({
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const EventRegistration = mongoose.model<IEventRegistration>('EventRegistration', EventRegistrationSchema);
