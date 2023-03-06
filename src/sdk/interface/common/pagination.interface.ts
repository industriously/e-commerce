export interface PaginatedResponse<T> extends Page {
  data: T[];

  page: number;
}

export interface Page {
  /**
   * @type uint
   * @minimum 1
   */
  page?: number;
}
