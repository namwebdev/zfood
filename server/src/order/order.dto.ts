import { Transform, Type } from "class-transformer";
import { IsInt, IsNotEmpty, Min, ValidateNested } from "class-validator";
import { IsNotEmptyArray } from "src/validators";

class DishInOrderDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  dish_id: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  quantity: number;
}

export class OrderDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  restaurant_id: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(20000)
  total_price: number;

  @IsNotEmptyArray("Dishes must have at least one item!")
  @ValidateNested({ each: true })
  @Type(() => DishInOrderDto)
  dishes: DishInOrderDto[];
}
