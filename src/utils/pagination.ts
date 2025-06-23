import { PaginationParams, PaginatedResponse } from '../types';

export const createPaginationResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> => {
  const pages = Math.ceil(total / limit);
  
  return {
    success: true,
    message: 'Data retrieved successfully',
    data,
    pagination: {
      page,
      limit,
      total,
      pages,
      hasNext: page < pages,
      hasPrev: page > 1,
    },
  };
};

export const getPaginationParams = (query: any): PaginationParams => {
  const page = parseInt(query.page as string) || 1;
  const limit = parseInt(query.limit as string) || 10;
  const search = query.search as string;

  return {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)),
    search,
  };
};

export const buildSearchQuery = (search?: string, fields: string[] = []) => {
  if (!search) return {};
  
  const searchRegex = new RegExp(search, 'i');
  
  if (fields.length === 0) {
    return { $text: { $search: search } };
  }
  
  const searchConditions = fields.map(field => ({
    [field]: searchRegex,
  }));
  
  return { $or: searchConditions };
}; 