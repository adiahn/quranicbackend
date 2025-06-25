import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    interviewerId: z.string().min(4).max(10).regex(/^[A-Z0-9]+$/),
    name: z.string().min(2).max(100),
    email: z.string().email().optional(),
    phone: z.string().regex(/^(\+234|0)[789][01]\d{8}$/).optional(),
    lga: z.string().min(1),
    role: z.enum(['INTERVIEWER', 'SUPERVISOR', 'ADMIN']).default('INTERVIEWER'),
    password: z.string().min(6).max(100),
    isActive: z.boolean().default(true),
  }),
});

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    interviewerId: z.string().min(4).max(10).regex(/^[A-Z0-9]+$/).optional(),
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    phone: z.string().regex(/^(\+234|0)[789][01]\d{8}$/).optional(),
    lga: z.string().min(1).optional(),
    role: z.enum(['INTERVIEWER', 'SUPERVISOR', 'ADMIN']).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const getUserSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const deleteUserSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const getUsersSchema = z.object({
  query: z.object({
    page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
    limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('10'),
    search: z.string().optional(),
    role: z.enum(['INTERVIEWER', 'SUPERVISOR', 'ADMIN']).optional(),
    lga: z.string().optional(),
    isActive: z.string().transform(val => val === 'true').optional(),
  }),
});

export const changePasswordSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    password: z.string().min(6).max(100),
  }),
});

export const deactivateUserSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
}); 