export interface PagedResult<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalCount: number;
}
