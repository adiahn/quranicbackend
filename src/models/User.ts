import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '../types';

export interface IUserDocument extends Omit<IUser, '_id'>, Document {}

const userSchema = new Schema<IUserDocument>({
  interviewerId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 4,
    maxlength: 10,
    match: /^[A-Z0-9]+$/,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    type: String,
    trim: true,
    match: /^(\+234|0)[789][01]\d{8}$/,
  },
  lga: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ['INTERVIEWER', 'SUPERVISOR', 'ADMIN'],
    default: 'INTERVIEWER',
  },
  passwordHash: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ lga: 1 });

export const User = mongoose.model<IUserDocument>('User', userSchema); 