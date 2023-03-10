import { Module } from '@nestjs/common';
import { ProductsController } from './presentation';
import { providers } from './providers';
import { ProductRepositoryToken } from './_constants_';

@Module({
  providers,
  controllers: [ProductsController],
  exports: [ProductRepositoryToken],
})
export class ProductModule {}
