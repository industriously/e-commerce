export interface PaginatedResponse<T> {
  data: T[];
  /**
   * now page
   * @type uint
   * @minimum 1
   */
  page: number;
}
