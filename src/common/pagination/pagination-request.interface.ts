export interface PaginationRequest {
  skip: number;
  page?: number;
  limit: number;
  order?: { [field: string]: 'ASC' | 'DESC' };
  params?: any;
}
