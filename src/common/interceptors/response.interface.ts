/**
 * Interface for the response
 */
export interface Response<T> {
  payload: T;
  timestamp: number;
}
