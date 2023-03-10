import { IProductRepository, ProductSchema } from '@INTERFACE/product';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ProductRepositoryToken } from '@PRODUCT/_constants_';

export class FindManyProductCommand implements ICommand {
  constructor(readonly ids: string[]) {}
}

@CommandHandler(FindManyProductCommand)
export class FindManyProductCommandHandler
  implements ICommandHandler<FindManyProductCommand>
{
  constructor(
    @Inject(ProductRepositoryToken) private repository: IProductRepository,
  ) {}

  async execute(
    command: FindManyProductCommand,
  ): Promise<ProductSchema.Aggregate[]> {
    return this.repository.findManyByIds(command.ids);
  }
}
