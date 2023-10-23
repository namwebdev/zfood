import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthRequestPayLoad, UserDTO, UserLoginDTO } from "./auth.dto";
import { hash, verify } from "argon2";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { SuccessResponse } from "src/common/successResponse";

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async signUp(userInfo: UserDTO) {
    const { password, name, phone, address } = userInfo;

    const isUserExist = await this.prismaService.user.findFirst({
      where: {
        phone,
      },
    });
    if (isUserExist)
      throw new BadRequestException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Phone is already in used!",
      });

    const hashPassword = await hash(password);
    const data = {
      name,
      password: hashPassword,
      phone,
      ...(address && { address }),
    };
    const user = await this.prismaService.user.create({ data });

    const { password: _password, ...res } = user;
    return SuccessResponse({ data: res });
  }

  async login(userInfo: UserLoginDTO) {
    const { phone, password } = userInfo;
    const unauthorizedError = new UnauthorizedException({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: "Phone or password are incorrect!",
    });

    const user = await this.prismaService.user.findUnique({
      where: { phone },
    });
    if (!user) throw unauthorizedError;

    const isMatchPassword = await verify(user.password, password);
    if (!isMatchPassword) throw unauthorizedError;

    const payload: AuthRequestPayLoad = {
      id: user.id,
      phone,
    };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: "1w",
      secret: this.configService.get("SECRET_KEY"),
    });

    return SuccessResponse({ data: { token } });
  }
}
