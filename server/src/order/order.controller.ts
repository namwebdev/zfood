import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { OrderDto } from "./order.dto";
import { OrderService } from "./order.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { AuthRequestPayLoad } from "src/auth/auth.dto";

@Controller("orders")
export class OrderController {
  constructor(private service: OrderService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post()
  order(@Req() request: Request, @Body() body: OrderDto) {
    const user_id = (request.user as AuthRequestPayLoad).id;
    return this.service.order(user_id, body);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get()
  getHistory(@Req() request: Request) {
    const user_id = (request.user as AuthRequestPayLoad).id;
    return this.service.getHistory(user_id);
  }
}
