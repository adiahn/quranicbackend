import { z } from 'zod';

export const createBeggarSchema = z.object({
  body: z.object({
    beggarId: z.string().min(1),
    name: z.string().min(2).max(100),
    age: z.number().min(0).max(120),
    sex: z.enum(['MALE', 'FEMALE']),
    nationality: z.string().min(1),
    stateOfOrigin: z.string().min(1),
    lga: z.string().min(1),
    townVillage: z.string().min(1),
    permanentHomeAddress: z.string().min(5).max(500),
    fathersContactNumber: z.string().regex(/^(\+234|0)[789][01]\d{8}$/).optional(),
    contactNumber: z.string().regex(/^(\+234|0)[789][01]\d{8}$/).optional(),
    isBegging: z.boolean().default(false),
    reasonForBegging: z.string().optional(),
    nin: z.string().optional(),
    pictureUrl: z.string().url().optional(),
  }),
});

export const updateBeggarSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    beggarId: z.string().min(1).optional(),
    name: z.string().min(2).max(100).optional(),
    age: z.number().min(0).max(120).optional(),
    sex: z.enum(['MALE', 'FEMALE']).optional(),
    nationality: z.string().min(1).optional(),
    stateOfOrigin: z.string().min(1).optional(),
    lga: z.string().min(1).optional(),
    townVillage: z.string().min(1).optional(),
    permanentHomeAddress: z.string().min(5).max(500).optional(),
    fathersContactNumber: z.string().regex(/^(\+234|0)[789][01]\d{8}$/).optional(),
    contactNumber: z.string().regex(/^(\+234|0)[789][01]\d{8}$/).optional(),
    isBegging: z.boolean().optional(),
    reasonForBegging: z.string().optional(),
    nin: z.string().optional(),
    pictureUrl: z.string().url().optional(),
  }),
});

export const getBeggarSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const deleteBeggarSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const getBeggarsSchema = z.object({
  query: z.object({
    page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
    limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('10'),
    search: z.string().optional(),
    lga: z.string().optional(),
    stateOfOrigin: z.string().optional(),
    isBegging: z.string().transform(val => val === 'true').optional(),
    interviewerId: z.string().optional(),
  }),
}); 