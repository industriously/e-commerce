import { TypedQuery } from '@COMMON/decorator/http';
import { PaginatedResponse } from '@INTERFACE/common';
import { ProductSchema } from '@INTERFACE/product';
import { TypedParam } from '@nestia/core';
import { Controller, Get, Post } from '@nestjs/common';

@Controller('products')
export class ProductsController {
  /**
   * 상품 목록 요청 API
   * @tag product
   * @param page query로 전달된 페이지 정보, default 1
   * @returns 페이지 정보와 함께 요청한 상품 목록
   */
  @Get()
  getProductList(
    @TypedQuery('page', { type: 'number', optional: true }) page?: number,
  ): Promise<PaginatedResponse<ProductSchema.General>> {
    console.log(page ?? 1);
    throw Error();
  }
  /**
   * 상품 상세 정보 요청 API
   * @tag product
   */
  @Get(':product_id')
  getProduct(
    @TypedParam('product_id', 'uuid') product_id: string,
  ): Promise<ProductSchema.Detail> {
    throw Error();
  }

  /**
   * 상품 정보 생성 API
   * @tag product
   * @returns 생성된 상품 정보
   */
  @Post()
  createProduct(): Promise<ProductSchema.Detail> {
    throw Error();
  }
}
