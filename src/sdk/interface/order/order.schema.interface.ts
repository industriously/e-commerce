export namespace OrderSchema {
  export interface Payment {
    readonly imp_uid: string;
    readonly status: string;
    readonly amount: number;
  }

  export interface Recipient {
    readonly name: string;
    readonly phone: string;
    readonly address: string;
  }

  export interface OrderItem {
    readonly id: string;
    readonly name: string;
    /**
     * @type uint
     * @minimum 0
     */
    readonly price: number;
    /**
     * @type uint
     * @minimum 0
     */
    readonly quantity: number;
    readonly product_id: string;
  }

  export type Status =
    | 'Ready'
    | 'Approved'
    | 'Rejected'
    | 'Delivering'
    | 'Delivered'
    | 'Cancelled'
    | 'Refunded';

  export interface Aggregate {
    readonly id: string;
    readonly orderer_id: string;
    readonly store_id: string;
    /**
     * @type uint
     * @minimum 0
     */
    readonly total_price: number;
    readonly payment: Payment;
    readonly recipient: Recipient;
    readonly order_items: OrderItem[];
    readonly created_at: Date;
    readonly updated_at: Date;
    readonly status: Status;
  }

  export interface Store {
    readonly id: string;
    readonly name: string;
  }

  export interface Detail
    extends Omit<Aggregate, 'created_at' | 'updated_at' | 'store_id'> {
    readonly store: Store;
    readonly created_at: string;
    readonly updated_at: string;
  }
}
