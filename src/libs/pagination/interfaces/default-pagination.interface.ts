/**
 * Interface designed to assign default parameters to pagination
 */
export interface DefaultPagination {
  defaultSkip?: number;
  defaultPage?: number;
  defaultLimit?: number;
  defaultOrder?: any;
  defaultOrderDirection?: string;
  maxAllowedSize?: number;
}
