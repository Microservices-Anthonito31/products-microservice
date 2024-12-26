import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalProducts = await this.product.count({
      where: { available: true },
    });
    const lastPage = Math.ceil(totalProducts / limit);

    if (page <= lastPage) {
      return {
        data: await this.product.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where: { available: true },
        }),
        meta: {
          total: totalProducts,
          page: page,
          lastPage: lastPage,
        },
      };
    } else {
      throw new HttpException(
        `La Página ${page} no existe `,
        HttpStatus.NOT_FOUND,
      );
    }
  }
  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: { id, available: true },
    });

    if (!product) {
      throw new HttpException(
        `El producto de id ${id} no existe`,
        HttpStatus.NOT_FOUND,
      );
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    
    const {id:__, ...data} = updateProductDto;

    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.product.update({
      where: { id },
      data: {
        available: false,
      },
    });
  }
}
