import { Module } from '@nestjs/common';
import { ProductsController } from './presentation';

@Module({ controllers: [ProductsController] })
export class ProductModule {}
