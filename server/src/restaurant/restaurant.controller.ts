import { Controller, Get, Param, Query } from "@nestjs/common";
import { RestaurantService } from "./restaurant.service";
import { QueryParamsDTO } from "src/utils/classDTO";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "src/constants";

@Controller("restaurants")
export class RestaurantController {
  constructor(private service: RestaurantService) {}

  @Get()
  getAll(@Query() query: QueryParamsDTO) {
    const page = query.page || DEFAULT_PAGE;
    const limit = query.limit || DEFAULT_PAGE_SIZE;
    return this.service.getAll(page, limit);
  }

  @Get(":id")
  getDetails(@Param("id") id: string) {
    return this.service.getById(id);
  }
}
