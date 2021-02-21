import { PaginationRequest } from './pagination-request.interface';

export class PaginationResponse<T> {
  currentPage: number;
  skippedRecords: number;
  totalPages: number;
  hasNext: boolean;
  content: T[];
  payloadSize: number;
  totalRecords: number;

  /**
   * Return pagination response
   * @param PaginationRequest {PaginationRequest} 
   * @param totalRecords {number}
   * @param dtos {t[]}
   * @returns {PaginationResponse}
   */
  static of<T>(
    { limit, page, skip }: PaginationRequest,
    totalRecords: number,
    dtos: T[],
  ): PaginationResponse<T> {
    const totalPages =
      Math.floor(totalRecords / limit) +
      (totalRecords % limit > 0 ? 1 : 0);
    const currentPage = (+page > 0 ? +page : 1);
    const hasNext = (currentPage <= (totalPages - 1));

    return {
      totalPages: totalPages,
      payloadSize: dtos.length,
      hasNext: hasNext,
      content: dtos,
      currentPage: currentPage,
      skippedRecords: skip,
      totalRecords: totalRecords
    };
  }
}
