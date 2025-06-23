import mongoose, { Document, Schema } from 'mongoose';
import { IDraft } from '../types';

export interface IDraftDocument extends Omit<IDraft, '_id'>, Document {}

const draftSchema = new Schema<IDraftDocument>({
  draftId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['SCHOOL', 'BEGGAR'],
    required: true,
  },
  data: {
    type: Schema.Types.Mixed,
    required: true,
  },
  interviewerId: {
    type: String,
    required: true,
    ref: 'User',
  },
  lastSaved: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
draftSchema.index({ interviewerId: 1 });
draftSchema.index({ type: 1 });
draftSchema.index({ lastSaved: -1 });

export const Draft = mongoose.model<IDraftDocument>('Draft', draftSchema); 