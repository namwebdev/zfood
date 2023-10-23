import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserDTO, UserLoginDTO } from "./auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  signUp(@Body() body: UserDTO) {
    return this.authService.signUp(body);
  }

  @Post("login")
  @HttpCode(200)
  login(@Body() body: UserLoginDTO) {
    return this.authService.login(body);
  }
}
