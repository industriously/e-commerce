import { TypedQuery } from '@COMMON/decorator/http';
import { Page, PaginatedResponse } from '@INTERFACE/common';
import { IProductUsecase, ProductSchema } from '@INTERFACE/product';
import { TypedBody, TypedParam } from '@nestia/core';
import { Controller, Get, Patch, Post, Delete, Inject } from '@nestjs/common';
import { ProductUsecaseToken } from '@PRODUCT/_constants_';
import typia from 'typia';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(ProductUsecaseToken)
    private readonly productUsecase: IProductUsecase,
  ) {}

  /**
   * 상품 목록 조회 API
   *
   * 전체 상품 목록 조회
   *
   * 추후에 쿼리를 통해 가게별, 카테고리별 등의 필터링 기준 추가
   *
   * 추후에 쿼리를 통해 가격 낮은 순/높은 순, 인기 순 등의 정렬 기준 추가
   *
   * @tag product
   * @param page query로 전달된 페이지 정보, default 1
   * @returns 페이지 정보와 함께 요청한 상품 목록
   */
  @Get()
  findMany(
    @TypedQuery('page', typia.createIs<Page>(), { type: 'number' })
    page?: number,
  ): Promise<PaginatedResponse<ProductSchema.General>> {
    return this.productUsecase.findMany(page ?? 1);
  }

  @Get('count')
  getCount(): Promise<number> {
    return this.productUsecase.getCount();
  }
  /**
   * 상품 상세 조회 API
   *
   * @tag product
   * @param product_id 상품 id
   * @returns 상품 상세 정보
   */
  @Get(':product_id')
  find(
    @TypedParam('product_id', 'uuid') product_id: string,
  ): Promise<ProductSchema.Detail> {
    return this.productUsecase.findOne(product_id);
  }

  /**
   * 상품 생성 요청 API
   *
   * body에 포함된 store_id에 해당하는 가게에 등록된 사용자만 요청할 수 있다.
   *
   * @tag product
   * @param body 상품 생성 정보
   * @returns 생성된 상품 정보
   */
  @Post()
  create(
    @TypedBody() body: IProductUsecase.CreateData,
  ): Promise<ProductSchema.Detail> {
    return this.productUsecase.create(body);
  }

  /**
   * 상품 수정 요청 API
   *
   * @tag product
   * @param product_id 변경할 상품 id
   * @param body 변경된 상품 정보
   * @returns 변경된 상품의 상세 정보
   */
  @Patch(':product_id')
  update(
    @TypedParam('product_id', 'uuid') product_id: string,
    @TypedBody() body: IProductUsecase.UpdateData,
  ): Promise<ProductSchema.Detail> {
    return this.productUsecase.update(product_id, body);
  }

  /**
   * 상품 삭제(비활성화) 요청 API
   *
   * @tag product
   * @param product_id 삭제 대상 상품의 id
   */
  @Delete(':product_id')
  inActivate(
    @TypedParam('product_id', 'uuid') product_id: string,
  ): Promise<void> {
    return this.productUsecase.inActivate(product_id);
  }
}
