import { Injectable } from "@nestjs/common";
import { SuccessResponse } from "src/common/successResponse";
import { PrismaService } from "src/prisma/prisma.service";



@Injectable()
export class RestaurantService {
  constructor(private prisma: PrismaService) {}

  async getAll(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    const data = await this.prisma.restaurant.findMany({
      skip,
      take: pageSize,
    });
    const total = await this.prisma.restaurant.count();
    const total_pages = Math.ceil(total / pageSize);

    return SuccessResponse({
      data,
      pagination: {
        current_page: page,
        per_page: pageSize,
        total_pages,
      },
    });
  }

  async getById(id: string) {
    const data = await this.prisma.restaurant.findFirst({
      where: { id: parseInt(id) },
    });
    return SuccessResponse({ data });
  }
}
