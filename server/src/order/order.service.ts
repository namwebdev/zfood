import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { OrderDto } from "./order.dto";
import { SuccessResponse } from "src/common/successResponse";

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async order(user_id: number, body: OrderDto) {
    const { dishes, restaurant_id, total_price } = body;

    const isRestaurantExist = await this.prisma.restaurant.findUnique({
      where: { id: restaurant_id },
    });
    if (!isRestaurantExist)
      throw new BadRequestException({
        message: "Restaurant is not exist!",
      });

    if (!this.validateDishIds(body))
      throw new BadRequestException({
        message: "Restaurant is not exist!",
      });

    const validateDishIds = await this.validateDishIds(body);
    if (!validateDishIds.isValid)
      throw new BadRequestException({
        message: `Dish.${validateDishIds.index} is not exist!`,
      });

    const orderResponse = await this.prisma.order.create({
      data: {
        total_price,
        user_id,
        restaurant_id,
      },
    });
    await this.prisma.dish_Order.createMany({
      data: dishes.map(({ dish_id, quantity }) => {
        return {
          dish_id,
          quantity,
          order_id: orderResponse.id,
        };
      }),
    });
    return SuccessResponse({message: "Order successfully!"});
  }

  async getHistory(user_id: number) {
    const { orders } = await this.prisma.user.findUnique({
      where: { id: user_id },
      select: {
        orders: {
          select: {
            id: true,
            total_price: true,
            restaurant: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            dish_orders: {
              select: {
                quantity: true,
                dish: {
                  select: {
                    id: true,
                    name: true,
                    price: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (orders.length === 0) return SuccessResponse({data: []});

    return SuccessResponse({
      data: orders.map((order) => ({
        id: order.id,
        total_price: order.total_price,
        restaurant: {
          id: order.restaurant.id,
          name: order.restaurant.name,
          image: order.restaurant.image,
        },
        dish_orders: order.dish_orders.map((dishOrder) => ({
          quantity: dishOrder.quantity,
          dish: {
            id: dishOrder.dish.id,
            name: dishOrder.dish.name,
            price: dishOrder.dish.price,
          },
        })),
      })),
    });
  }

  private async validateDishIds(orderDto: OrderDto): Promise<{
    isValid: boolean;
    index?: number;
  }> {
    const dishIds = orderDto.dishes.map((dish) => dish.dish_id);
    const dishesInDatabase = await this.prisma.dish.findMany({
      where: {
        id: {
          in: dishIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (dishIds.length === dishesInDatabase.length) return { isValid: true };

    const selectedDishIds = dishesInDatabase.map((dish) => dish.id);
    const firstMissingIndex = dishIds.findIndex(
      (dishId) => !selectedDishIds.includes(dishId),
    );

    return { isValid: false, index: firstMissingIndex };
  }
}
