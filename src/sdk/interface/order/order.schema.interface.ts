export namespace OrderSchema {
  export interface Orderer {
    /**
     * 주문자 고유 id
     * @format uuid
     */
    readonly orderer_id: string;
    /**
     * 주문자 명
     */
    readonly name: string;
    /**
     * 주문자 연락처
     */
    readonly phone: string;

    /**
     * 배달 목적지
     */
    readonly address: string;
  }

  export interface OrderItem {
    // id = order_id:product_id

    /**
     * 주문 상품 정보
     * @format uuid
     */
    readonly product_id: string;
    /**
     * 주문 상품명
     */
    readonly name: string;
    /**
     * 1개당 가격
     * @type uint
     * @minimum 0
     */
    readonly price: number;

    /**
     * 주문 수량
     * @type uint
     * @minimum 0
     */
    readonly quantity: number;
  }

  /**
   * UnReady - 주문 승인 전 상태, 결제가 완료된 경우, 승인 가능
   *
   * Ready - 주문 승인 후, 배달 준비 상태
   *
   * delivering - 배송 중
   *
   * delivered - 배송 완료
   */
  export type DeliveryStatus = 'UnReady' | 'Ready' | 'Delivering' | 'Delivered';

  export type PaymentStatus = 'UnPaid' | 'Paid';

  export interface Aggregate {
    /**
     * @format uuid
     */
    readonly id: string;
    /**
     * 주문자 id
     */
    readonly orderer: Orderer;

    readonly order_items: OrderItem[];

    /**
     * 상품 금액 및 할인이 적용된
     * 최종 결제 금액
     * @type uint
     * @minimum 0
     */
    readonly total_price: number;

    readonly delivery_status: DeliveryStatus;

    readonly payment_status: PaymentStatus;

    readonly is_deleted: boolean;

    readonly created_at: Date;

    readonly updated_at: Date;
  }

  export interface Detail
    extends Pick<
      Aggregate,
      | 'id'
      | 'orderer'
      | 'order_items'
      | 'total_price'
      | 'delivery_status'
      | 'payment_status'
      | 'is_deleted'
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
