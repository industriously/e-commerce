import { Module } from '@nestjs/common';
import { UserModule } from '@USER/user.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [UserModule, ProductModule],
})
export class ApiModule {}
