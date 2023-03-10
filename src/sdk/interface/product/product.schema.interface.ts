export namespace ProductSchema {
  export interface Aggregate {
    /**
     * @format uuid
     */
    readonly id: string;
    /**
     * 상품명
     */
    readonly name: string;
    /**
     * 상품을 판매하는 판매점 id
     * @pattern uuid
     */
    readonly store_id: string;
    /**
     * 상품 가격(원)
     * @type uint
     * @minimum 0
     */
    readonly price: number;
    /**
     * 현재 판매가능한 상품 수량
     * @type uint
     * @minimum 0
     */
    readonly quantity: number;
    /**
     * 상품 설명
     */
    readonly description: string;
    readonly is_deleted: boolean;
    readonly created_at: Date;
    readonly updated_at: Date;
  }
  /**
   * 상품 리스트 등에서 확인할 수 있는 간단한 상품 정보
   */
  export type General = Pick<Aggregate, 'id' | 'name' | 'store_id' | 'price'>;
  /**
   * 판매자만 보이는 정보 등을 제거한 상품 상세 정보
   */
  export interface Detail
    extends Pick<
      Aggregate,
      'id' | 'name' | 'store_id' | 'price' | 'quantity' | 'description'
    > {
    /**
     * ISO 8601 type
     * @pattern ^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]).[0-9]{3}Z$
     */
    readonly created_at: string;
    /**
     * ISO 8601 type
     * @pattern ^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]).[0-9]{3}Z$
     */
    readonly updated_at: string;
  }
}
