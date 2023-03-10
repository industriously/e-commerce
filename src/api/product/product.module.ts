import { Module } from '@nestjs/common';
import { ProductsController } from './presentation';
import { providers } from './providers';

@Module({
  providers,
  controllers: [ProductsController],
})
export class ProductModule {}
