import mongoose, { Document, Schema } from 'mongoose';
import { IBeggar } from '../types';

export interface IBeggarDocument extends Omit<IBeggar, '_id'>, Document {}

const beggarSchema = new Schema<IBeggarDocument>({
  beggarId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 120,
  },
  sex: {
    type: String,
    enum: ['MALE', 'FEMALE'],
    required: true,
  },
  nationality: {
    type: String,
    required: true,
    trim: true,
  },
  stateOfOrigin: {
    type: String,
    required: true,
    trim: true,
  },
  lga: {
    type: String,
    required: true,
    trim: true,
  },
  townVillage: {
    type: String,
    required: true,
    trim: true,
  },
  permanentHomeAddress: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 500,
  },
  fathersContactNumber: {
    type: String,
    trim: true,
    match: /^(\+234|0)[789][01]\d{8}$/,
  },
  contactNumber: {
    type: String,
    trim: true,
    match: /^(\+234|0)[789][01]\d{8}$/,
  },
  isBegging: {
    type: Boolean,
    default: false,
  },
  reasonForBegging: {
    type: String,
    trim: true,
  },
  nin: {
    type: String,
    trim: true,
  },
  pictureUrl: {
    type: String,
  },
  interviewerId: {
    type: String,
    required: true,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Indexes
beggarSchema.index({ interviewerId: 1 });
beggarSchema.index({ lga: 1 });
beggarSchema.index({ stateOfOrigin: 1 });
beggarSchema.index({ isBegging: 1 });
beggarSchema.index({ name: 'text' });

export const Beggar = mongoose.model<IBeggarDocument>('Beggar', beggarSchema); 