import { Module } from '@nestjs/common';
import { ProductModule } from '@PRODUCT/product.module';
import { UserModule } from '@USER/user.module';

@Module({
  imports: [UserModule, ProductModule],
})
export class ApiModule {}
