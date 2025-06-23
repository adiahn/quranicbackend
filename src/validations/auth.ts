import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    interviewerId: z.string().min(4).max(10).regex(/^[A-Z0-9]+$/),
    password: z.string().min(6).max(100),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(6).max(100),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6).max(100),
  }),
}); 