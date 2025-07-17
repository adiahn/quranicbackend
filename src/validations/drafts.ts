import { z } from 'zod';

export const createDraftSchema = z.object({
  body: z.object({
    draftId: z.string().min(1),
    type: z.enum(['SCHOOL', 'BEGGAR']),
    data: z.any(),
  }),
});

export const updateDraftSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z.object({
    data: z.any(),
  }),
});

export const getDraftSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const deleteDraftSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const saveDraftSchema = z.object({
  body: z.object({
    draftId: z.string().min(1),
    type: z.enum(['SCHOOL', 'BEGGAR']),
    data: z.any(),
  }),
});

export const getDraftsSchema = z.object({
  query: z.object({
    page: z.string().transform(Number).pipe(z.number().min(1)).default('1'),
    limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).default('10'),
    type: z.enum(['SCHOOL', 'BEGGAR']).optional(),
  }),
}); 