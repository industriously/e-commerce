/**
 * @packageDocumentation
 * @module api.functional.orders
 * @nestia Generated by Nestia - https://github.com/samchon/nestia 
 */
//================================================================
import { Fetcher } from "@nestia/fetcher";
import type { IConnection } from "@nestia/fetcher";
import typia from "typia";

import type { IOrderUsecase } from "./../../interface/order/order.usecase.interface";
import type { OrderSchema } from "./../../interface/order/order.schema.interface";

/**
 * 주문 생성 요청 API
 * 
 * @tag order
 * @param connection connection Information of the remote HTTP(s) server with headers (+encryption password)
 * @param token 사용자 access token
 * @param body 주문 목록
 * @returns 생성된 주문 정보
 * @throw 400 잘못된 토큰입니다.
 * @throw 404 이미 결제 대기중인 주문이 있습니다.
 * 
 * @controller OrdersController.create()
 * @path POST /orders
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export function create
    (
        connection: IConnection,
        body: IOrderUsecase.CreateData
    ): Promise<create.Output>
{
    return Fetcher.fetch
    (
        connection,
        create.ENCRYPTED,
        create.METHOD,
        create.path(),
        body,
        create.stringify
    );
}
export namespace create
{
    export type Input = IOrderUsecase.CreateData;
    export type Output = OrderSchema.Detail;

    export const METHOD = "POST" as const;
    export const PATH: string = "/orders";
    export const ENCRYPTED: Fetcher.IEncrypted = {
        request: false,
        response: false,
    };

    export function path(): string
    {
        return `/orders`;
    }
    export const stringify = (input: Input) => typia.assertStringify(input);
}