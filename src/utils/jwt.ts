import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import { IUser } from '../types';

export interface JWTPayload {
  userId: string;
  interviewerId: string;
  role: string;
  lga: string;
}

export const generateAccessToken = (user: IUser): string => {
  const payload: JWTPayload = {
    userId: user._id!,
    interviewerId: user.interviewerId,
    role: user.role,
    lga: user.lga,
  };

  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: '24h',
  });
};

export const generateRefreshToken = (user: IUser): string => {
  const payload: JWTPayload = {
    userId: user._id!,
    interviewerId: user.interviewerId,
    role: user.role,
    lga: user.lga,
  };

  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: '7d',
  });
};

export const verifyAccessToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.jwt.secret) as JWTPayload;
};

export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as JWTPayload;
}; 