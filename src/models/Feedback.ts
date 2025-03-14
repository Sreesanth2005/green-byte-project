
import mongoose, { Document, Schema } from 'mongoose';

export interface IFeedback extends Document {
  userId?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  message: string;
  rating: number;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

export const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);
