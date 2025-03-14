
import mongoose, { Document, Schema } from 'mongoose';

export interface IEcoTip extends Document {
  tip: string;
  category: string;
  createdAt: Date;
}

const EcoTipSchema = new Schema<IEcoTip>({
  tip: { type: String, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const EcoTip = mongoose.model<IEcoTip>('EcoTip', EcoTipSchema);
