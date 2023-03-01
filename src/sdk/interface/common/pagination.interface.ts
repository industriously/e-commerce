export interface PaginatedResponse<T> {
  data: T[];
  /**
   * now page
   * @minimum 0
   */
  page: number;
  /**
   * total count of T
   * @minimum 0
   */
  total_count: number;
}
