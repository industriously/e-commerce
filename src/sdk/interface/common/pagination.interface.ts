export interface PaginatedResponse<T> {
  data: T[];
  /**
   * now page
   * @minimum 0
   */
  page: number;
}
