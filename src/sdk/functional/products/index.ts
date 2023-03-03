/**
 * @packageDocumentation
 * @module api.functional.products
 * @nestia Generated by Nestia - https://github.com/samchon/nestia 
 */
//================================================================
import { Fetcher } from "@nestia/fetcher";
import type { IConnection } from "@nestia/fetcher";
import typia from "typia";

import type { PaginatedResponse } from "./../../interface/common/pagination.interface";
import type { ProductSchema } from "./../../interface/product/product.schema.interface";

/**
 * 상품 목록 요청 API
 * 
 * @tag product
 * @param connection connection Information of the remote HTTP(s) server with headers (+encryption password)
 * @param page query로 전달된 페이지 정보, default 1
 * @returns 페이지 정보와 함께 요청한 상품 목록
 * 
 * @controller ProductsController.getProductList()
 * @path GET /products
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export function getProductList
    (
        connection: IConnection,
        page?: number | undefined
    ): Promise<getProductList.Output>
{
    return Fetcher.fetch
    (
        connection,
        getProductList.ENCRYPTED,
        getProductList.METHOD,
        getProductList.path(page)
    );
}
export namespace getProductList
{
    export type Output = PaginatedResponse<ProductSchema.General>;

    export const METHOD = "GET" as const;
    export const PATH: string = "/products";
    export const ENCRYPTED: Fetcher.IEncrypted = {
        request: false,
        response: false,
    };

    export function path(page: number | undefined): string
    {
        return `/products?${new URLSearchParams(
        {
            page
        } as any).toString()}`;
    }
}

/**
 * 상품 상세 정보 요청 API
 * 
 * @tag product
 * 
 * @controller ProductsController.getProduct()
 * @path GET /products/:product_id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export function getProduct
    (
        connection: IConnection,
        product_id: string
    ): Promise<getProduct.Output>
{
    return Fetcher.fetch
    (
        connection,
        getProduct.ENCRYPTED,
        getProduct.METHOD,
        getProduct.path(product_id)
    );
}
export namespace getProduct
{
    export type Output = ProductSchema.Detail;

    export const METHOD = "GET" as const;
    export const PATH: string = "/products/:product_id";
    export const ENCRYPTED: Fetcher.IEncrypted = {
        request: false,
        response: false,
    };

    export function path(product_id: string): string
    {
        return `/products/${encodeURIComponent(product_id)}`;
    }
}

/**
 * 상품 정보 생성 API
 * 
 * @tag product
 * @returns 생성된 상품 정보
 * 
 * @controller ProductsController.createProduct()
 * @path POST /products
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export function createProduct
    (
        connection: IConnection
    ): Promise<createProduct.Output>
{
    return Fetcher.fetch
    (
        connection,
        createProduct.ENCRYPTED,
        createProduct.METHOD,
        createProduct.path()
    );
}
export namespace createProduct
{
    export type Output = ProductSchema.Detail;

    export const METHOD = "POST" as const;
    export const PATH: string = "/products";
    export const ENCRYPTED: Fetcher.IEncrypted = {
        request: false,
        response: false,
    };

    export function path(): string
    {
        return `/products`;
    }
    export const stringify = (input: Input) => typia.assertStringify(input);
}