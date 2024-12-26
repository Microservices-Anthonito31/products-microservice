"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let ProductsService = class ProductsService extends client_1.PrismaClient {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger('ProductService');
    }
    onModuleInit() {
        this.$connect();
        this.logger.log('Database connected');
    }
    create(createProductDto) {
        return this.product.create({
            data: createProductDto,
        });
    }
    async findAll(paginationDto) {
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
        }
        else {
            throw new common_1.HttpException(`La Página ${page} no existe `, common_1.HttpStatus.NOT_FOUND);
        }
    }
    async findOne(id) {
        const product = await this.product.findUnique({
            where: { id, available: true },
        });
        if (!product) {
            throw new common_1.HttpException(`El producto de id ${id} no existe`, common_1.HttpStatus.NOT_FOUND);
        }
        return product;
    }
    async update(id, updateProductDto) {
        await this.findOne(id);
        return this.product.update({
            where: { id },
            data: updateProductDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.product.update({
            where: { id },
            data: {
                available: false,
            },
        });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)()
], ProductsService);
//# sourceMappingURL=products.service.js.map