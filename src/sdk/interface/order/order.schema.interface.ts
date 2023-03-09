import { UserSchema } from '@INTERFACE/user';
import { ProductSchema } from '@INTERFACE/product';

export namespace OrderSchema {
  export type Orderer = Pick<
    UserSchema.Aggregate,
    'id' | 'username' | 'email' | 'phone' | 'address'
  >;

  export type Product = Pick<
    ProductSchema.Aggregate,
    'id' | 'description' | 'name' | 'price'
  >;

  export interface OrderItem {
    /**
     * @format uuid
     */
    readonly id: string;

    /**
     * 주문 상품 정보
     */
    readonly product: Product;

    /**
     * 주문 수량
     * @type unint
     * @minimum 0
     */
    readonly quantity: number;
  }

  /**
   * waiting - 주문 승인 대기중
   *
   * approved - 판매자의 주문 승인 후 배달 준비중
   *
   * delivering - 배송 중
   *
   * delivered - 배송 완료
   */
  export type DeliveryStatus =
    | 'Waiting'
    | 'Approved'
    | 'Delivering'
    | 'Delivered';

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
     */
    readonly total_price: number;

    readonly delivery_status: DeliveryStatus;
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
