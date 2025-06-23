import mongoose, { Document, Schema } from 'mongoose';
import { IFile } from '../types';

export interface IFileDocument extends Omit<IFile, '_id'>, Document {}

const fileSchema = new Schema<IFileDocument>({
  fileId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  originalName: {
    type: String,
    required: true,
    trim: true,
  },
  filename: {
    type: String,
    required: true,
    trim: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
    min: 0,
  },
  path: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: String,
    required: true,
    ref: 'User',
  },
  relatedTo: {
    type: {
      type: String,
      enum: ['SCHOOL', 'BEGGAR', 'USER'],
    },
    id: {
      type: String,
    },
  },
}, {
  timestamps: true,
});

// Indexes
fileSchema.index({ uploadedBy: 1 });
fileSchema.index({ 'relatedTo.type': 1, 'relatedTo.id': 1 });
fileSchema.index({ createdAt: -1 });

export const File = mongoose.model<IFileDocument>('File', fileSchema); 